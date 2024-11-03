import { useProducts } from "../context/ProductContext";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import FeaturedProduct from "../components/home/FeaturedProduct";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductListingLayout from "../components/layout/ProductListingLayout";

function HomePage() {
  const { products, categories } = useProducts();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const featuredProduct = products[0];

  const handleCategoryChange = (category) => {
    if (category === "all") {
      navigate("/category");
    } else {
      navigate(`/category/${category}`);
    }
  };

  const breadcrumbItems = [{ id: "home", label: t("nav.home"), href: "/" }];

  return (
    <div className="space-y-6">
      <div className="relative h-[400px] -mt-8 mb-8">
        <FeaturedProduct product={featuredProduct} />
      </div>

      <Breadcrumb items={breadcrumbItems} />

      <ProductListingLayout
        products={products}
        categories={categories}
        onCategoryChange={handleCategoryChange}
      />
    </div>
  );
}

export default HomePage;
