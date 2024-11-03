import { Button } from "../ui/button";
import { useTranslation } from "react-i18next";
import { useLanguage } from "../../context/LanguageContext";

function FeaturedProduct({ product }) {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();

  if (!product) return null;

  const getLocalizedContent = (content, contentEn) => {
    return currentLanguage === "zh" ? content : contentEn;
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent z-10" />
      <img
        src={product.images[0]}
        alt={getLocalizedContent(product.name, product.nameEn)}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 z-20 flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl font-bold mb-4">
              {getLocalizedContent(product.name, product.nameEn)}
            </h1>
            <p className="text-lg mb-6">
              {getLocalizedContent(product.description, product.descriptionEn)}
            </p>
            <div className="space-x-4">
              <Button size="lg" variant="default">
                {t("common.shopNow")}
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10">
                {t("common.learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeaturedProduct;
