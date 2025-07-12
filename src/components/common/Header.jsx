import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Globe, Menu, X, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import { cn } from "../../lib/utils";
import { useState, useEffect } from "react";
import { useCart } from "../../context/CartContext";
import { gsap } from 'gsap';
import UserSocialLogin from "../auth/UserSocialLogin";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCart();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    // Header entrance animation
    gsap.fromTo('.header-container', {
      y: -100,
      opacity: 0
    }, {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power3.out'
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-container">
      <div className="absolute inset-0 bg-nav backdrop-blur-xl border-b border-border shadow-lg"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Modern Animated Logo */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center gap-3 group" aria-label="Home">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative bg-card rounded-full p-2 shadow-lg border border-border group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <img
                    src="/image/brandLogo.svg"
                    alt="Company Logo"
                    className="h-8 sm:h-10 md:h-12 w-auto"
                  />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl md:text-2xl font-bold text-foreground">
                  ChairGo
                </span>
                <div className="h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>
          </div>

          {/* Desktop Floating Menu */}
          <div className="hidden lg:flex items-center">
            <div className="bg-surface backdrop-blur-md rounded-full px-1 py-1 shadow-lg border border-border">
              <div className="flex items-center space-x-1">
                {[
                  { to: '/', label: t("nav.home"), icon: '🏠' },
                  { to: '/products', label: t("nav.products"), icon: '🪑' },
                  { to: '/about', label: t("nav.about"), icon: '💫' }
                ].map((item, index) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="nav-item relative px-4 py-2 rounded-full text-nav-foreground hover:text-white transition-all duration-300 group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center space-x-2">
                      <span className="text-sm">{item.icon}</span>
                      <span className="font-medium text-sm">{item.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            
            {/* Animated Cart */}
            <Link to="/cart" className="relative group">
              <div className="relative bg-white dark:bg-gray-800 backdrop-blur-sm rounded-full p-3 shadow-lg border border-gray-200 dark:border-gray-700 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                <ShoppingCart className="h-5 w-5 text-gray-700 dark:text-gray-200 group-hover:text-blue-600 transition-colors" />
                {cart.length > 0 && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold animate-pulse">
                    {cart.length}
                  </div>
                )}
              </div>
            </Link>

            {/* User Authentication */}
            <UserSocialLogin className="hidden md:flex" />

            {/* Language & Theme Controls */}
            <div className="hidden md:flex items-center space-x-3">
              {/* Language Picker */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {currentLanguage.toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg p-1">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "cursor-pointer rounded-md p-3 transition-all duration-200",
                        currentLanguage === lang.code 
                          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" 
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{lang.code === 'en' ? '🇺🇸' : '🇹🇼'}</span>
                        <span>{lang.label}</span>
                        {currentLanguage === lang.code && <span className="ml-auto text-blue-500">✓</span>}
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Theme Toggle */}
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">
                {theme === "light" ? t("theme.darkMode") : t("theme.lightMode")}
                </span>
              </Button>
            </div>

            {/* Glowing Admin Button */}
            <Link to="/admin" className="hidden md:block">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
                <button className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm">
                  <span className="relative z-10">⚡ {t("nav.admin")}</span>
                </button>
              </div>
            </Link>

            {/* Animated Mobile Menu */}
            <button
              className="lg:hidden relative p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full shadow-lg border border-white/30 dark:border-gray-700/30 hover:shadow-xl transition-all duration-300"
              onClick={toggleMenu}
            >
              <div className="relative w-5 h-5">
                <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ${isMenuOpen ? 'rotate-45 top-2' : 'top-0'}`}></span>
                <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'top-2'}`}></span>
                <span className={`absolute block w-5 h-0.5 bg-gray-700 dark:bg-gray-200 transition-all duration-300 ${isMenuOpen ? '-rotate-45 top-2' : 'top-4'}`}></span>
              </div>
            </button>
          </div>
        </div>

        {/* Animated Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-500 ease-out ${isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="py-6 bg-card/95 backdrop-blur-xl rounded-2xl mt-4 shadow-xl border border-border">
            <div className="flex flex-col space-y-2 px-4">
              {[
                { to: '/', label: t("nav.home"), icon: '🏠' },
                { to: '/products', label: t("nav.products"), icon: '🪑' },
                { to: '/about', label: t("nav.about"), icon: '💫' },
                { to: '/cart', label: `${t("nav.cart")} (${cart.length})`, icon: '🛒' },
                { to: '/admin', label: t("nav.admin"), icon: '⚡' }
              ].map((item, index) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                    item.to === '/admin' 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                      : 'text-nav-foreground hover:bg-gradient-to-r hover:from-blue-600 hover:to-purple-600 hover:text-white'
                  }`}
                  onClick={toggleMenu}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                  <ArrowRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              ))}
              
              {/* Mobile Language & Theme Controls */}
              <div className="flex items-center justify-center space-x-4 pt-4 mt-4 border-t border-border">
                {/* Mobile Language Picker */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border shadow-sm text-nav-foreground"
                    >
                      <Globe className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        {currentLanguage.toUpperCase()}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[140px] bg-card border border-border shadow-lg rounded-lg p-1">
                    {languages.map((lang) => (
                      <DropdownMenuItem
                        key={lang.code}
                        onClick={() => {
                          changeLanguage(lang.code);
                          toggleMenu();
                        }}
                        className={cn(
                          "cursor-pointer rounded-md p-2 transition-all duration-200",
                          currentLanguage === lang.code 
                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium" 
                            : "text-nav-foreground hover:bg-muted"
                        )}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lang.code === 'en' ? '🇺🇸' : '🇹🇼'}</span>
                          <span className="text-sm">{lang.label}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Mobile Theme Toggle */}
                <Button
                  variant="ghost"
                  onClick={() => {
                    toggleTheme();
                    toggleMenu();
                  }}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border shadow-sm text-nav-foreground"
                >
                  {theme === "light" ? (
                    <Moon className="h-4 w-4" />
                  ) : (
                    <Sun className="h-4 w-4" />
                  )}
                  <span className="text-sm font-medium">
                    {theme === "light" ? t("theme.darkMode") : t("theme.lightMode")}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
