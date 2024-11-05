import { useTranslation } from "react-i18next";

function ReturnPolicy() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {t("footer.returnPolicyContent.title")}
      </h1>
      <h2 className="text-xl mb-6 text-muted-foreground">
        {t("footer.returnPolicyContent.subtitle")}
      </h2>

      {/* Main Notice */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-2">
          {t("footer.returnPolicyContent.mainNotice.title")}
        </h3>
        <p className="text-muted-foreground mb-4">
          {t("footer.returnPolicyContent.mainNotice.desc")}
        </p>
        <div className="bg-card rounded-lg p-4 mb-4">
          <p>{t("footer.returnPolicyContent.instructions.step1")}</p>
          <p className="text-sm text-muted-foreground mt-2">
            {t("footer.returnPolicyContent.instructions.note")}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Service Hours */}
        <div className="bg-card rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            {t("footer.returnPolicyContent.serviceHours.title")}
          </h3>
          <p>{t("footer.returnPolicyContent.serviceHours.hours")}</p>
        </div>

        {/* Phone */}
        <div className="bg-card rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            {t("footer.returnPolicyContent.contact.phone.title")}
          </h3>
          <p>{t("footer.returnPolicyContent.contact.phone.numbers")}</p>
        </div>

        {/* LINE */}
        <div className="bg-card rounded-lg p-4">
          <h3 className="font-semibold mb-2">
            {t("footer.returnPolicyContent.contact.line.title")}
          </h3>
          <p>{t("footer.returnPolicyContent.contact.line.id")}</p>
        </div>
      </section>

      {/* Email */}
      <section className="mb-8">
        <h3 className="font-semibold mb-2">
          {t("footer.returnPolicyContent.contact.email.title")}
        </h3>
        <div className="bg-card rounded-lg p-4">
          {t("footer.returnPolicyContent.contact.email.addresses", {
            returnObjects: true,
          }).map((email, index) => (
            <p key={index}>{email}</p>
          ))}
          <p className="text-sm text-muted-foreground mt-2">
            {t("footer.returnPolicyContent.contact.email.note")}
          </p>
        </div>
      </section>

      {/* Warning */}
      <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-lg mb-8">
        <p className="font-medium">{t("footer.returnPolicyContent.warning")}</p>
      </div>

      {/* Exchange Rules */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("footer.returnPolicyContent.exchange.title")}
        </h3>
        <div className="space-y-4">
          {t("footer.returnPolicyContent.exchange.rules", {
            returnObjects: true,
          }).map((rule, index) => (
            <div key={index} className="bg-card rounded-lg p-4">
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Return Rules */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4">
          {t("footer.returnPolicyContent.return.title")}
        </h3>
        <div className="space-y-4">
          {t("footer.returnPolicyContent.return.rules", {
            returnObjects: true,
          }).map((rule, index) => (
            <div key={index} className="bg-card rounded-lg p-4">
              <p>{rule}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ReturnPolicy;
