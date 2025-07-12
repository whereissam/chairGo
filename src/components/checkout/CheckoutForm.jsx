import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { useCustomerAuth } from "../../context/CustomerAuthContext";
import { submitOrder } from "../../services/checkout";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { formatCurrency } from "../../utils/currency";

export function CheckoutForm() {
  const { t, i18n } = useTranslation();
  const { cart, getTotal, clearCart } = useCart();
  const { user } = useCustomerAuth();
  const navigate = useNavigate();
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    // Pre-fill form if user is logged in
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        name: user.username,
        email: user.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const result = await submitOrder(cart, customerInfo, user);

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('checkout.title')}</h1>
          <p className="text-xl text-gray-600">{t('checkout.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('checkout.orderSummary')}</h2>
              <div className="space-y-4 mb-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                      <p className="text-gray-600">{t('checkout.quantity')}：{item.quantity}</p>
                    </div>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(item.price * item.quantity, i18n.language)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">{t('checkout.total')}：</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(getTotal(), i18n.language)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer Information Form */}
          <div className="order-1 lg:order-2">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">{t('checkout.contactInfo')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    {t('checkout.name')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('checkout.namePlaceholder')}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    {t('checkout.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder={t('checkout.emailPlaceholder')}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, email: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500 mt-2">{t('checkout.emailHelp')}</p>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    {t('checkout.phone')} *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={t('checkout.phonePlaceholder')}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, phone: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500 mt-2">{t('checkout.phoneHelp')}</p>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    {t('checkout.address')} *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder={t('checkout.addressPlaceholder')}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customerInfo.address}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, address: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500 mt-2">{t('checkout.addressHelp')}</p>
                </div>

                <div>
                  <label className="block text-lg font-bold text-gray-900 mb-3">
                    {t('checkout.notesOptional')}
                  </label>
                  <textarea
                    rows={3}
                    placeholder={t('checkout.notesPlaceholder')}
                    className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={customerInfo.notes}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, notes: e.target.value })
                    }
                  />
                </div>

                {user && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800">
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">{t('checkout.loggedInNotice')}</span>
                    </div>
                    <p className="text-blue-700 mt-1">{t('checkout.loggedInDescription')}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-4 px-6 text-xl font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  {isSubmitting ? t('checkout.processing') : t('checkout.submitOrder')}
                </button>

                <div className="text-center text-gray-500 mt-4">
                  <p>{t('checkout.termsNotice')}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
