import { convertPrice } from "../utils/currency";

export async function submitOrder(cartData, customerInfo) {
  const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL;
  
  if (!GOOGLE_SCRIPT_URL) {
    console.error('Google Script URL is not configured');
    return {
      success: false,
      error: 'checkout.errorMessage',
      details: 'Google Script URL is not configured'
    };
  }
  
  try {
    const orderId = `ORDER-${Date.now()}`;
    
    // Calculate total in TWD (base currency)
    const total = cartData.reduce((sum, item) => {
      // Convert any USD prices to TWD
      const priceInTWD = convertPrice(item.price, 'zh'); // Convert to TWD
      return sum + (priceInTWD * Number(item.quantity));
    }, 0);

    const cleanedData = {
      orderId,
      items: cartData.map(item => ({
        id: item.id,
        name: item.name?.trim(),
        nameEn: item.nameEn?.trim(),
        price: convertPrice(item.price, 'zh'), // Store price in TWD
        quantity: Number(item.quantity)
      })),
      customerInfo: {
        name: customerInfo.name?.trim(),
        email: customerInfo.email?.trim().toLowerCase(),
        phone: customerInfo.phone?.trim().replace(/\s+/g, ''),
        address: customerInfo.address?.trim()
      },
      total,
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

    // Check if we have permission to show notifications
    if ("Notification" in window) {
      try {
        if (Notification.permission === "default") {
          await Notification.requestPermission();
        }

        if (Notification.permission === "granted") {
          const notification = new Notification("訂單已送出", {
            body: `訂單編號: ${orderId}\n總金額: NT$${total.toLocaleString()}`,
            icon: "/logo.png",
            tag: orderId,
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
      orderId,
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