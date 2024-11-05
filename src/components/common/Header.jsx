import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { useLanguage } from "../../context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Sun, Moon, Globe, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown";
import { cn } from "../../lib/utils";
import { useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "zh", label: "中文" },
];

function Header() {
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center space-x-2">
            <Link to="/" className="flex items-center gap-2" aria-label="Home">
              <img
                src="/image/brandLogo.svg"
                alt="Company Logo"
                className="h-12 w-auto"
              />
              <img
                src="/image/brandName.svg"
                alt="Company Logo"
                className="h-8 w-auto dark:bg-white"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.admin")}
            </Link>
            <Link
              to="/cart"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.cart")}
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {t("nav.about")}
            </Link>

            {/* Language & Theme Controls */}
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex items-center gap-2"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="text-sm">
                      {currentLanguage.toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={cn(
                        "cursor-pointer",
                        currentLanguage === lang.code && "font-bold"
                      )}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="icon" onClick={toggleMenu}>
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-3 space-y-3">
            <Link
              to="/"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              {t("nav.home")}
            </Link>
            <Link
              to="/admin"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              {t("nav.admin")}
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              {t("nav.cart")}
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 rounded-md text-base font-medium text-foreground hover:text-primary transition-colors"
              onClick={toggleMenu}
            >
              {t("nav.about")}
            </Link>

            {/* Mobile Language & Theme Controls */}
            <div className="flex items-center justify-start space-x-4 px-3 py-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex items-center gap-2"
                  >
                    <Globe className="h-5 w-5" />
                    <span className="text-sm">
                      {currentLanguage.toUpperCase()}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {languages.map((lang) => (
                    <DropdownMenuItem
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        toggleMenu();
                      }}
                      className={cn(
                        "cursor-pointer",
                        currentLanguage === lang.code && "font-bold"
                      )}
                    >
                      {lang.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  toggleTheme();
                  toggleMenu();
                }}
                className="rounded-full"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
