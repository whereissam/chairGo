import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-background border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo and Company Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/image/chairGoLogo.webp"
                alt="ChairGo Logo"
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-sm text-muted-foreground mt-4">
              ChairGo - Your trusted source for quality chairs and furniture.
            </p>
          </div>

          {/* Customer Service Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              {t("footer.customerService")}
            </h3>
            <nav className="flex flex-col space-y-2">
              <Link
                to="/shopping-guide"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.shoppingGuide")}
              </Link>
              <Link
                to="/care-instructions"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.careInstructions")}
              </Link>
              <Link
                to="/payment-delivery"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.cashOnDelivery")}
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.terms")}
              </Link>
              <Link
                to="/return-policy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.returnPolicy")}
              </Link>
              <Link
                to="/faq"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {t("footer.faq")}
              </Link>
            </nav>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.contactUs")}</h3>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                {t("footer.email")}: contact@chairgo.com
              </p>
              <p className="text-sm text-muted-foreground">
                {t("footer.phone")}: (02) 1234-5678
              </p>
              <p className="text-sm text-muted-foreground">
                {t("footer.businessHours")}: 9:00-18:00
              </p>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("footer.followUs")}</h3>
            <div className="flex space-x-4">
              {/* Add your social media icons here */}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} ChairGo.{" "}
            {t("footer.allRightsReserved")}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
