import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { useTheme } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

function ProductGrid({ products }) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

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
        <div
          key={product.id}
          className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-border"
        >
          <Link to={`/product/${product.id}`}>
            <div className="aspect-square overflow-hidden">
              <img
                src={product.images[0]}
                alt={getLocalizedContent(product.name, product.nameEn)}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </Link>
          <div className="p-4">
            <Link
              to={`/product/${product.id}`}
              className="text-lg font-medium hover:text-primary line-clamp-2"
            >
              {getLocalizedContent(product.name, product.nameEn)}
            </Link>
            <div className="mt-2 mb-4">
              <span className="text-2xl font-bold text-foreground">
                ${product.price.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  product.inStock
                    ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100"
                    : "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100"
                }`}
              >
                {t(product.inStock ? "common.inStock" : "common.outOfStock")}
              </span>
              <Button size="sm" disabled={!product.inStock}>
                {t("common.addToCart")}
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductGrid;
