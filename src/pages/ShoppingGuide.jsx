import { useTranslation } from "react-i18next";

function ShoppingGuide() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {t("footer.shoppingGuideContent.title")}
      </h1>
      <h2 className="text-xl mb-6 text-muted-foreground">
        {t("footer.shoppingGuideContent.subtitle")}
      </h2>

      {/* Main Notice */}
      <div className="mb-8">
        <p className="text-lg font-semibold mb-4">
          {t("footer.shoppingGuideContent.notice")}
        </p>
        <div className="bg-yellow-50 dark:bg-yellow-900/10 text-yellow-800 dark:text-yellow-200 p-4 rounded-lg">
          <p>{t("footer.shoppingGuideContent.mainWarning")}</p>
        </div>
      </div>

      {/* Delivery Notes */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">配送注意事項</h3>
        <div className="space-y-4">
          {t("footer.shoppingGuideContent.deliveryNotes", {
            returnObjects: true,
          }).map((note, index) => (
            <div key={index} className="bg-card rounded-lg p-4">
              <p>{note}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Notes */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("footer.shoppingGuideContent.importantNotes.title")}
        </h3>
        <div className="space-y-4">
          {t("footer.shoppingGuideContent.importantNotes.items", {
            returnObjects: true,
          }).map((item, index) => (
            <div key={index} className="bg-card rounded-lg p-4">
              <p>{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ShoppingGuide;
