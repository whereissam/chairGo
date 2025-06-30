import { useTranslation } from "react-i18next";
import { useCart } from "../context/CartContext";
import { Plus, Minus, X, ShoppingBag, ArrowRight, Sparkles, Heart } from "lucide-react";
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { formatCurrency } from "../utils/currency";
import { useEffect, useRef } from "react";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const CartPage = () => {
  const { t, i18n } = useTranslation();
  const { cart, removeFromCart, updateQuantity, getTotal } = useCart();
  const navigate = useNavigate();
  const isEnglish = i18n.language === "en";
  const cartRef = useRef(null);
  const summaryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Page entrance animation
      gsap.from('.cart-header', {
        duration: 1,
        y: -50,
        opacity: 0,
        ease: 'power3.out'
      });

      // Cart items stagger animation
      gsap.fromTo('.cart-item', 
        {
          x: -100,
          opacity: 0,
          scale: 0.9
        },
        {
          duration: 1,
          x: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.1,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.cart-items-container',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Summary card animation
      gsap.fromTo('.cart-summary', 
        {
          x: 100,
          opacity: 0,
          scale: 0.9
        },
        {
          duration: 1.2,
          x: 0,
          opacity: 1,
          scale: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: summaryRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Floating animation for cart items
      gsap.to('.cart-item', {
        y: -5,
        duration: 3,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
        stagger: {
          amount: 1,
          from: 'random'
        }
      });

    }, [cartRef, summaryRef]);

    return () => ctx.revert();
  }, [cart]);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto py-16 px-4 pt-28">
          {/* Modern Header */}
          <div className="cart-header text-center mb-12">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
              <div className="relative bg-card rounded-full p-4 shadow-xl">
                <ShoppingBag className="h-12 w-12 text-muted-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mt-6 mb-4 text-foreground">
              {t("nav.cart")} ✨
            </h1>
          </div>

          {/* Modern Empty State */}
          <div className="text-center py-16 bg-card/80 backdrop-blur-md rounded-3xl shadow-xl border border-border">
            <div className="relative mb-8">
              <div className="text-6xl mb-4">🛒</div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            </div>
            <h2 className="text-2xl font-semibold mb-4 text-foreground">
              {t("cart.empty.title")}
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {t("cart.empty.description")}
            </p>
            <Link to="/products" className="inline-block group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>{t("cart.empty.startShopping")}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto py-16 px-4 pt-28">
        {/* Modern Header */}
        <div className="cart-header text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30"></div>
            <div className="relative bg-card rounded-full p-4 shadow-xl">
              <ShoppingBag className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mt-6 mb-4 text-foreground">
            {t("nav.cart")} ({cart.length} items) ✨
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {t("cart.reviewItems")}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="cart-items-container lg:col-span-2 space-y-6">
          {cart.map((item, index) => (
            <div
              key={item.id}
              className="cart-item relative bg-card/80 backdrop-blur-md rounded-2xl shadow-xl border border-border overflow-hidden group hover:shadow-2xl transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6">
                {/* Remove button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300 group-hover:scale-110"
                  aria-label={t("cart.remove")}
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/product/${item.id}`} className="shrink-0 group">
                    <div className="relative overflow-hidden rounded-xl">
                      <img
                        src={item.images?.[0] || item.image}
                        alt={isEnglish ? item.nameEn : item.name}
                        className="w-32 h-32 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </Link>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.id}`} className="group">
                      <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                        {isEnglish ? item.nameEn : item.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <p className="text-2xl font-bold text-primary">
                        {formatCurrency(item.price, i18n.language)}
                      </p>
                      {item.inStock ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          ✅ {t("common.inStock")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          ❌ {t("common.outOfStock")}
                        </span>
                      )}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium text-muted-foreground">{t("cart.quantity")}:</span>
                      <div className="flex items-center bg-muted rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors disabled:opacity-50"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-12 text-center font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-accent hover:text-accent-foreground rounded-full transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => {/* Add to wishlist functionality */}}
                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-all duration-300"
                        title={t("cart.addToWishlist")}
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t("cart.subtotal")}:</span>
                        <span className="text-lg font-bold text-foreground">
                          {formatCurrency(item.price * item.quantity, i18n.language)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modern Order Summary */}
        <div ref={summaryRef} className="cart-summary sticky top-8">
          <div className="bg-card/80 backdrop-blur-md rounded-3xl shadow-xl border border-border p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-30"></div>
                <div className="relative bg-card rounded-full p-3 shadow-lg">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mt-4 text-foreground">
                {t("cart.orderSummary")} ✨
              </h2>
            </div>

            {/* Summary Details */}
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">{t("cart.subtotalItems", { count: cart.length })}</span>
                <span className="font-semibold text-lg">{formatCurrency(getTotal(), i18n.language)}</span>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">{t("cart.shipping")}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400 font-semibold">{t("cart.freeShipping")} 🚚</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400">{t("cart.tax")}</span>
                <span className="text-gray-600 dark:text-gray-400">{t("cart.calculatedAtCheckout")}</span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-gray-900 dark:text-gray-100">{t("cart.total")}</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    {formatCurrency(getTotal(), i18n.language)}
                  </span>
                </div>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                <button 
                  onClick={() => navigate("/checkout")}
                  className="relative w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <Sparkles className="h-5 w-5" />
                  <span>{t("cart.proceedToCheckout")}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              
              <Link to="/products" className="block">
                <button className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  {t("cart.continueShopping")}
                </button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <span>🔒</span>
                  <span>{t("cart.secure")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>🚚</span>
                  <span>{t("cart.freeShipping")}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>↩️</span>
                  <span>{t("cart.easyReturns")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
