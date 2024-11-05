import { useTranslation } from "react-i18next";

function PaymentDelivery() {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {t("footer.paymentContent.title")}
      </h1>
      <div className="space-y-4">
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.paymentContent.method1")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.paymentContent.method2")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg">
          <p className="font-medium">{t("footer.paymentContent.method3")}</p>
        </div>
        <div className="p-4 bg-card rounded-lg border-t mt-4 pt-4">
          <p className="font-medium">
            {t("footer.paymentContent.deliveryTime")}
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentDelivery;
