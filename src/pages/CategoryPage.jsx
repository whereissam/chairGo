import { useProducts } from "../context/ProductContext";
import {
  useParams,
  useLocation,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import Breadcrumb from "../components/common/Breadcrumb";
import ProductListingLayout from "../components/layout/ProductListingLayout";

function CategoryPage() {
  const { categoryId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { products, categories } = useProducts();
  const { t } = useTranslation();

  const handleCategoryChange = (newCategory) => {
    if (newCategory === "all") {
      navigate("/category");
    } else {
      navigate(`/category/${newCategory}`);
    }
  };

  // For /category path (showing all products)
  if (location.pathname === "/category") {
    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { id: "home", label: t("nav.home"), href: "/" },
            { id: "all", label: t("nav.allProducts"), href: "/category" },
          ]}
        />

        <ProductListingLayout
          products={products}
          categories={categories}
          initialCategory="all"
          onCategoryChange={handleCategoryChange}
        />
      </div>
    );
  }

  // For /category/:categoryId path
  if (categoryId) {
    // Check if category exists
    const categoryExists = products.some(
      (product) => product.category === categoryId
    );

    if (!categoryExists) {
      return <Navigate to="/category" replace />;
    }

    return (
      <div className="space-y-6">
        <Breadcrumb
          items={[
            { id: "home", label: t("nav.home"), href: "/" },
            { id: "all", label: t("nav.allProducts"), href: "/category" },
            {
              id: categoryId,
              label: t(`categories.${categoryId}`),
              href: `/category/${categoryId}`,
            },
          ]}
        />

        <ProductListingLayout
          products={products}
          categories={categories}
          initialCategory={categoryId}
          onCategoryChange={handleCategoryChange}
        />
      </div>
    );
  }

  // Fallback to all products if something goes wrong
  return <Navigate to="/category" replace />;
}

export default CategoryPage;
