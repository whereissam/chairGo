import { useTranslation } from "react-i18next";
import { X, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";

const CartSidebar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    getTotal,
  } = useCart();
  const isEnglish = i18n.language === "en";

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/cart");
  };

  if (!isCartOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              {t("nav.cart")}
            </h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                {t("cart.empty")}
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b dark:border-gray-700 pb-4"
                >
                  <img
                    src={item.images?.[0] || item.image}
                    alt={isEnglish ? item.nameEn : item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">
                      {isEnglish ? item.nameEn : item.name}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400">
                      {formatCurrency(item.price, i18n.language)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="mt-auto p-4 border-t">
              <div className="flex justify-between mb-2">
                <span>{t("cart.total")}</span>
                <span className="font-bold">
                  {formatCurrency(getTotal(), i18n.language)}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setIsCartOpen(false);
                  navigate("/checkout");
                }}
              >
                {t("cart.proceedToCheckout")}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
