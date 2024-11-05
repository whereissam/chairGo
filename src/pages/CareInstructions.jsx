import { useTranslation } from "react-i18next";

function CareInstructions() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-8">
        {t("footer.careInstructionsContent.title")}
      </h1>

      {/* Wood Furniture Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("footer.careInstructionsContent.woodFurniture.title")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((num) => (
            <p key={num} className="text-muted-foreground">
              {t(`footer.careInstructionsContent.woodFurniture.desc${num}`)}
            </p>
          ))}
        </div>
      </section>

      {/* Wood Types Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("footer.careInstructionsContent.woodTypes.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {["solid", "plywood", "particleBoard", "sugarCane"].map((type) => (
            <div key={type} className="p-4 bg-card rounded-lg">
              <h3 className="font-medium mb-2">
                {t(`footer.careInstructionsContent.woodTypes.${type}.title`)}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(`footer.careInstructionsContent.woodTypes.${type}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Adjustable Furniture Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("footer.careInstructionsContent.adjustableFurniture.title")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3].map((num) => (
            <p key={num} className="text-muted-foreground">
              {t(
                `footer.careInstructionsContent.adjustableFurniture.desc${num}`
              )}
            </p>
          ))}
          <p className="text-red-500 font-medium">
            {t("footer.careInstructionsContent.adjustableFurniture.warning")}
          </p>
          <p className="font-medium">
            {t("footer.careInstructionsContent.adjustableFurniture.note")}
          </p>
        </div>
      </section>

      {/* Sofa Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("footer.careInstructionsContent.sofa.title")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((num) => (
            <p key={num} className="text-muted-foreground">
              {t(`footer.careInstructionsContent.sofa.desc${num}`)}
            </p>
          ))}
        </div>
      </section>

      {/* Mattress Section */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {t("footer.careInstructionsContent.mattress.title")}
        </h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((num) => (
            <p key={num} className="text-muted-foreground">
              {t(`footer.careInstructionsContent.mattress.desc${num}`)}
            </p>
          ))}
        </div>
      </section>
    </div>
  );
}

export default CareInstructions;
