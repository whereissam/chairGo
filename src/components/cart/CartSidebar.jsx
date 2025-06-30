import { useTranslation } from "react-i18next";
import { X, Plus, Minus, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../utils/currency";
import { useEffect } from "react";
import { gsap } from 'gsap';

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

  useEffect(() => {
    if (isCartOpen) {
      // Sidebar entrance animation
      gsap.fromTo('.cart-sidebar', {
        x: '100%',
        opacity: 0
      }, {
        x: '0%',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out'
      });

      // Cart items stagger animation
      gsap.fromTo('.sidebar-cart-item', {
        x: 50,
        opacity: 0
      }, {
        x: 0,
        opacity: 1,
        duration: 0.3,
        stagger: 0.1,
        delay: 0.2,
        ease: 'power2.out'
      });
    }
  }, [isCartOpen, cart]);

  if (!isCartOpen) return null;

  return (
    <>
      {/* Modern Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Modern Glassmorphic Sidebar */}
      <div className="cart-sidebar fixed right-0 top-0 h-full w-full sm:w-96 max-w-[90vw] bg-background/95 backdrop-blur-xl shadow-2xl z-50 border-l border-border">
        <div className="flex flex-col h-full">
          {/* Modern Header */}
          <div className="relative p-6 border-b border-border">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
            <div className="relative flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
                  <div className="relative bg-card rounded-full p-2 shadow-lg">
                    <ShoppingBag className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    {t("nav.cart")} ✨
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {cart.length} {cart.length === 1 ? t("cart.item") : t("cart.items")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all duration-300 hover:scale-110"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {t("cart.empty")}
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/products');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {t("cart.startShopping")}
                </button>
              </div>
            ) : (
              cart.map((item, index) => (
                <div
                  key={item.id}
                  className="sidebar-cart-item group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300"
                >
                  {/* Background gradient on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <div className="relative flex gap-4">
                    <div className="shrink-0">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={isEnglish ? item.nameEn : item.name}
                        className="w-16 h-16 object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {isEnglish ? item.nameEn : item.name}
                      </h3>
                      <p className="text-blue-600 dark:text-blue-400 font-medium text-sm mt-1">
                        {formatCurrency(item.price, i18n.language)}
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-full">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Modern Footer */}
          {cart.length > 0 && (
            <div className="mt-auto p-6 border-t border-white/20 dark:border-gray-700/20 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50">
              <div className="space-y-4">
                {/* Total */}
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600 dark:text-gray-400">{t("cart.total")}</span>
                  <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {formatCurrency(getTotal(), i18n.language)}
                  </span>
                </div>
                
                {/* Buttons */}
                <div className="space-y-3">
                  {/* Checkout Button */}
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        navigate("/checkout");
                      }}
                      className="relative w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      <span>{t("cart.checkout")}</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                  
                  {/* View Cart Button */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {t("cart.viewFullCart")}
                  </button>
                </div>
                
                {/* Trust badges */}
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400 pt-2">
                  <span>🔒 {t("cart.secure")}</span>
                  <span>🚚 {t("cart.freeShipping")}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
