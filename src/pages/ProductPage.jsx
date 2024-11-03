import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useProducts } from "../context/ProductContext";
import { useTranslation } from "react-i18next";
import { ChevronRight, Star } from "lucide-react";

/**
 * Product detail page component that displays detailed information about a specific product
 * @returns {JSX.Element} Product detail page
 */
const ProductPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const isEnglish = i18n.language === "en";

  useEffect(() => {
    const foundProduct = products.find(
      (p) => p.id === parseInt(id) || p.id === id
    );
    setProduct(foundProduct);
    setLoading(false);
  }, [id, products]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  // Generate rating stars
  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400 dark:text-gray-600"
        }`}
      />
    ));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link
          to="/"
          className="text-blue-600 dark:text-blue-400 hover:opacity-80"
        >
          {t("nav.home")}
        </Link>
        <ChevronRight className="mx-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        <Link
          to={`/category/${product.category}`}
          className="text-blue-600 dark:text-blue-400 hover:opacity-80"
        >
          {t(`categories.${product.category}`)}
        </Link>
        <ChevronRight className="mx-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="text-gray-900 dark:text-gray-100 font-medium">
          {isEnglish ? product.nameEn : product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div className="space-y-4">
          <div className="aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <img
              src={product.images[0]}
              alt={isEnglish ? product.nameEn : product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-md"
                >
                  <img
                    src={img}
                    alt={`${isEnglish ? product.nameEn : product.name} view ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {isEnglish ? product.nameEn : product.name}
            </h1>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderRatingStars(product.rating)}</div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                ({product.reviews || 0} {t("common.reviews")})
              </span>
            </div>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">
              ¥{product.price.toFixed(2)}
            </p>
            {product.oldPrice && (
              <p className="text-gray-500 dark:text-gray-400 line-through">
                ¥{product.oldPrice.toFixed(2)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("product.aboutItem")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {isEnglish ? product.descriptionEn : product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("product.specifications")}
            </h2>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.material")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.materialEn
                    : product.specifications.material}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.dimensions")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.dimensionsEn
                    : product.specifications.dimensions}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.weight")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.weightEn
                    : product.specifications.weight}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.color")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.colorEn.join(", ")
                    : product.specifications.color.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <button className="bg-blue-600 dark:bg-blue-500 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-colors w-full text-lg font-semibold">
                {t("common.addToCart")}
              </button>
            </div>

            {/* Stock Status */}
            <p
              className={`text-lg font-medium ${
                product.inStock
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.inStock ? t("common.inStock") : t("common.outOfStock")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
