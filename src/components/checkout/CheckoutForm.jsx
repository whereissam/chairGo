import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { submitOrder } from "../../services/checkout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/currency";

export function CheckoutForm() {
  const { t, i18n } = useTranslation();
  const { cart, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitOrder(cart, customerInfo);

      if (result.success) {
        toast.success(t(result.message, { orderId: result.orderId }), {
          duration: 3000,
        });

        setTimeout(() => {
          clearCart();
          navigate("/");
        }, 2000);
      } else {
        toast.error(t(result.error));
      }
    } catch (error) {
      toast.error(t("checkout.errorMessage"));
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (cart.length === 0 && !isSubmitting) {
      navigate("/");
    }
  }, [cart, navigate, isSubmitting]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-foreground">
        {t("checkout.title")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("checkout.name")}
          </label>
          <input
            type="text"
            required
            className="w-full p-2 border rounded-md bg-background text-foreground"
            value={customerInfo.name}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, name: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("checkout.email")}
          </label>
          <input
            type="email"
            required
            className="w-full p-2 border rounded-md bg-background text-foreground"
            value={customerInfo.email}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, email: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("checkout.phone")}
          </label>
          <input
            type="tel"
            required
            className="w-full p-2 border rounded-md bg-background text-foreground"
            value={customerInfo.phone}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, phone: e.target.value })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("checkout.address")}
          </label>
          <textarea
            required
            className="w-full p-2 border rounded-md bg-background text-foreground"
            value={customerInfo.address}
            onChange={(e) =>
              setCustomerInfo({ ...customerInfo, address: e.target.value })
            }
            rows={3}
          />
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between mb-2">
            <span>{t("cart.total")}</span>
            <span className="font-bold">
              {formatCurrency(getTotal(), i18n.language)}
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-2 px-4 rounded-md hover:bg-primary/90 disabled:opacity-50"
        >
          {isSubmitting ? t("checkout.processing") : t("checkout.submitOrder")}
        </button>
      </form>
    </div>
  );
}
