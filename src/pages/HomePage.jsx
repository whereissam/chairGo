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
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Hero Section */}
      <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] -mt-4 sm:-mt-6 lg:-mt-8">
        <FeaturedProduct product={featuredProduct} />
      </div>

      {/* Breadcrumb */}
      <div className="px-4 sm:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />
      </div>

      {/* Product Listing */}
      <div className="px-4 sm:px-6 lg:px-8">
        <ProductListingLayout
          products={products}
          categories={categories}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    </div>
  );
}

export default HomePage;
