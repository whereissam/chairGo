import { useTranslation } from "react-i18next";

function Terms() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("footer.termsContent.title")}
      </h1>
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.termsContent.term1")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.termsContent.term2")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.termsContent.term3")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.termsContent.term4")}</p>
        </div>
      </div>
    </div>
  );
}

export default Terms;
