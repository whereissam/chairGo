import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { Plus, Minus, X } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link } from "react-router-dom";
import { formatCurrency } from "../utils/currency";

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const isEnglish = i18n.language === "en";

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
          {t("nav.cart")}
        </h1>
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {t("cart.empty")}
          </p>
          <Link to="/">
            <Button variant="default">{t("nav.home")}</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        {t("nav.cart")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="relative flex gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow"
            >
              {/* Remove button - moved to top right */}
              <button
                onClick={() => removeFromCart(item.id)}
                className="absolute top-2 right-2 p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                aria-label={t("cart.remove")}
              >
                <X className="h-4 w-4" />
              </button>

              <Link to={`/product/${item.id}`} className="shrink-0">
                <img
                  src={item.images?.[0] || item.image}
                  alt={isEnglish ? item.nameEn : item.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                    {isEnglish ? item.nameEn : item.name}
                  </h3>
                </Link>
                <p className="text-blue-600 dark:text-blue-400 mt-1">
                  {formatCurrency(item.price, i18n.language)}
                </p>
                {item.inStock ? (
                  <p className="text-green-600 dark:text-green-400 text-sm mt-1">
                    {t("common.inStock")}
                  </p>
                ) : (
                  <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                    {t("common.outOfStock")}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 sticky top-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("cart.orderSummary")}
            </h2>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t("cart.subtotal")}</span>
                <span>{formatCurrency(getTotal(), i18n.language)}</span>
              </div>
              <div className="flex justify-between text-gray-600 dark:text-gray-400">
                <span>{t("cart.shipping")}</span>
                <span>{t("cart.freeShipping")}</span>
              </div>
            </div>

            <div className="border-t dark:border-gray-700 pt-4 mb-6">
              <div className="flex justify-between text-lg font-semibold text-gray-900 dark:text-gray-100">
                <span>{t("cart.total")}</span>
                <span>{formatCurrency(getTotal(), i18n.language)}</span>
              </div>
            </div>

            <Button className="w-full py-6 text-lg">
              {t("cart.proceedToCheckout")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
