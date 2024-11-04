import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";
import { useCart } from "../../context/CartContext";

function ProductGrid({ products, children }) {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const { currentLanguage } = useLanguage();
  const { addToCart } = useCart();
  const isEnglish = i18n.language === "en";

  const getLocalizedContent = (content, contentEn) => {
    return currentLanguage === "zh" ? content : contentEn;
  };

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">{t("common.noProductsFound")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="group">
          {children ? (
            children(product)
          ) : (
            <div>
              <Link
                to={`/product/${product.id}`}
                className="block hover:opacity-80"
              >
                <img
                  src={product.images?.[0] || product.image}
                  alt={isEnglish ? product.nameEn : product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <h3 className="mt-2 text-lg font-semibold">
                  {isEnglish ? product.nameEn : product.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  ¥{product.price.toFixed(2)}
                </p>
              </Link>
              <button
                onClick={() => addToCart(product)}
                className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {t("common.addToCart")}
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
