import { convertPrice } from "../utils/currency";

export async function submitOrder(cartData, customerInfo, user = null) {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787/api';
  
  try {
    // Calculate total in USD (base currency for API)
    const total = cartData.reduce((sum, item) => {
      return sum + (item.price * Number(item.quantity));
    }, 0);

    const orderData = {
      user_id: user?.id || undefined,
      customer_name: customerInfo.name?.trim(),
      customer_email: customerInfo.email?.trim().toLowerCase(),
      customer_phone: customerInfo.phone?.trim().replace(/\s+/g, ''),
      shipping_address: customerInfo.address?.trim(),
      total_amount: total,
      currency: 'USD',
      notes: customerInfo.notes?.trim() || null,
      items: cartData.map(item => ({
        product_id: item.id.toString(),
        product_name: item.name?.trim() || item.nameEn?.trim(),
        product_price: item.price,
        quantity: Number(item.quantity),
        subtotal: item.price * Number(item.quantity)
      }))
    };

    const headers = {
      'Content-Type': 'application/json',
    };

    // Add auth header if user is logged in
    if (user) {
      const token = localStorage.getItem('auth_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to create order');
    }

    const result = await response.json();
    const order = result.data;

    // Also send to Google Sheets for backup (optional)
    const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
    if (GOOGLE_SCRIPT_URL) {
      try {
        const cleanedData = {
          orderId: order.order_number,
          items: cartData.map(item => ({
            id: item.id,
            name: item.name?.trim(),
            nameEn: item.nameEn?.trim(),
            price: convertPrice(item.price, 'zh'), // Store price in TWD for Google Sheets
            quantity: Number(item.quantity)
          })),
          customerInfo: {
            name: customerInfo.name?.trim(),
            email: customerInfo.email?.trim().toLowerCase(),
            phone: customerInfo.phone?.trim().replace(/\s+/g, ''),
            address: customerInfo.address?.trim()
          },
          total: convertPrice(total, 'zh'), // Convert to TWD for Google Sheets
          timestamp: new Date().toISOString()
        };

        await fetch(GOOGLE_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cleanedData)
        });
      } catch (sheetsError) {
        console.warn('Google Sheets backup failed:', sheetsError);
      }
    }

    // Check if we have permission to show notifications
    if ("Notification" in window) {
      try {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }

        if (Notification.permission === "granted") {
          const notification = new Notification("訂單已送出", {
            body: `訂單編號: ${order.order_number}\n總金額: $${total.toLocaleString()}`,
            icon: "/logo.png",
            tag: order.order_number,
            requireInteraction: true
          });

          notification.onclick = () => {
            window.focus();
            notification.close();
          };
        }
      } catch (notificationError) {
        console.error('Notification error:', notificationError);
      }
    }

    return {
      success: true,
      orderId: order.order_number,
      order: order,
      message: 'checkout.successMessage'
    };

  } catch (error) {
    console.error('Checkout error:', error);
    return {
      success: false,
      error: 'checkout.errorMessage',
      details: error.message
    };
  }
} 