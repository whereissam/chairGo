import { useParams } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { Button } from "../components/ui/button";
import Breadcrumb from "../components/common/Breadcrumb";
import { Star, Truck, Shield, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../context/LanguageContext";

function ProductPage() {
  const { id } = useParams();
  const { products, categories } = useProducts();
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div>{t("product.notFound")}</div>;
  }

  const getLocalizedContent = (content, contentEn) => {
    return currentLanguage === "zh" ? content : contentEn;
  };

  const breadcrumbItems = [
    { label: t("nav.home"), href: "/" },
    {
      label: t(`categories.${product.category}`),
      href: `/category/${product.category}`,
    },
    { label: getLocalizedContent(product.name, product.nameEn) },
  ];

  return (
    <div className="space-y-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="grid grid-cols-12 gap-8">
        {/* Image Gallery */}
        <div className="col-span-5">
          <div className="sticky top-4">
            <div className="aspect-square w-full">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="border-2 rounded-md overflow-hidden hover:border-primary aspect-square"
                >
                  <img
                    src={image}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="col-span-4">
          <h1 className="text-2xl font-bold mb-2 text-foreground">
            {getLocalizedContent(product.name, product.nameEn)}
          </h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-primary text-sm">
              {product.reviews} {t("common.reviews")}
            </span>
          </div>

          <div className="border-t border-b border-border py-4 my-4">
            <div className="text-3xl font-bold text-foreground">
              ${product.price.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {t("product.freeDelivery")}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">
              {t("product.aboutItem")}
            </h3>
            <p className="text-muted-foreground">
              {getLocalizedContent(product.description, product.descriptionEn)}
            </p>

            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">
                {t("product.specifications")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("product.material")}:
                  </span>
                  <span className="text-foreground">
                    {getLocalizedContent(
                      product.specifications.material,
                      product.specifications.materialEn
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("product.dimensions")}:
                  </span>
                  <span className="text-foreground">
                    {getLocalizedContent(
                      product.specifications.dimensions,
                      product.specifications.dimensionsEn
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("product.weight")}:
                  </span>
                  <span className="text-foreground">
                    {getLocalizedContent(
                      product.specifications.weight,
                      product.specifications.weightEn
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">
                    {t("product.color")}:
                  </span>
                  <span className="text-foreground">
                    {getLocalizedContent(
                      product.specifications.color.join("、"),
                      product.specifications.colorEn.join(", ")
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Buy Box */}
        <div className="col-span-3">
          <div className="border rounded-lg p-4 sticky top-4 bg-card">
            <div className="text-2xl font-bold mb-2 text-foreground">
              ${product.price.toFixed(2)}
            </div>

            <div className="flex items-center text-sm mb-4 text-muted-foreground">
              <Truck className="w-4 h-4 mr-2" />
              <span>{t("product.freeDelivery")}</span>
            </div>

            <div className="text-lg font-semibold mb-2">
              {product.inStock ? (
                <span className="text-green-500 dark:text-green-400">
                  {t("common.inStock")}
                </span>
              ) : (
                <span className="text-red-500 dark:text-red-400">
                  {t("common.outOfStock")}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <Button className="w-full" size="lg" disabled={!product.inStock}>
                {t("common.addToCart")}
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                size="lg"
                disabled={!product.inStock}
              >
                {t("common.buyNow")}
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-muted-foreground">
                <Shield className="w-4 h-4 mr-2" />
                <span>{t("product.secureTransaction")}</span>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <ArrowRight className="w-4 h-4 mr-2" />
                <span>{t("product.shipsFrom")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
