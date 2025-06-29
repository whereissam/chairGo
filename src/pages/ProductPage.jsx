import { useParams, Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useProducts } from "../context/ProductContext";
import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatCurrency } from "../utils/currency";
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CartSidebar from '../components/cart/CartSidebar';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Product detail page component that displays detailed information about a specific product
 * @returns {JSX.Element} Product detail page
 */
const ProductPage = () => {
  const { id } = useParams();
  const { products } = useProducts();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const productRef = useRef(null);
  const imageRef = useRef(null);
  const detailsRef = useRef(null);

  const isEnglish = i18n.language === "en";

  useEffect(() => {
    const foundProduct = products.find(
      (p) => p.id === parseInt(id) || p.id === id
    );
    setProduct(foundProduct);
    setLoading(false);
  }, [id, products]);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // Product image animation
      gsap.fromTo('.product-image', 
        {
          scale: 0.7,
          opacity: 0,
          rotation: -10
        },
        {
          duration: 1.5,
          scale: 1,
          opacity: 1,
          rotation: 0,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: imageRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Product details animation
      gsap.fromTo('.product-details', 
        {
          x: 100,
          opacity: 0
        },
        {
          duration: 1.2,
          x: 0,
          opacity: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: detailsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Breadcrumb animation
      gsap.from('.breadcrumb-item', {
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.1,
        ease: 'power2.out'
      });

      // Specifications cards animation
      gsap.fromTo('.spec-card', 
        {
          y: 50,
          opacity: 0,
          scale: 0.9
        },
        {
          duration: 1,
          y: 0,
          opacity: 1,
          scale: 1,
          stagger: 0.2,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: '.specifications-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Add to cart button animation
      gsap.fromTo('.add-to-cart-btn', 
        {
          scale: 0.8,
          opacity: 0
        },
        {
          duration: 1,
          scale: 1,
          opacity: 1,
          ease: 'elastic.out(1, 0.5)',
          scrollTrigger: {
            trigger: '.add-to-cart-section',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Floating animation for product image
      gsap.to('.product-image img', {
        duration: 3,
        y: -10,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1
      });

    }, [productRef, imageRef, detailsRef]);

    return () => ctx.revert();
  }, [product]);

  if (loading) return <div className="p-4">Loading...</div>;
  if (!product) return <div className="p-4">Product not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-all duration-500">
      <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-8 text-sm">
        <Link
          to="/"
          className="breadcrumb-item text-blue-600 dark:text-blue-400 hover:opacity-80"
        >
          {t("nav.home")}
        </Link>
        <ChevronRight className="breadcrumb-item mx-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        <Link
          to={`/category/${product.category}`}
          className="breadcrumb-item text-blue-600 dark:text-blue-400 hover:opacity-80"
        >
          {t(
            `categories.${product.category === "all" ? "all" : product.category}`
          )}
        </Link>
        <ChevronRight className="breadcrumb-item mx-2 w-4 h-4 text-gray-500 dark:text-gray-400" />
        <span className="breadcrumb-item text-gray-900 dark:text-gray-100 font-medium">
          {isEnglish ? product.nameEn : product.name}
        </span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Section */}
        <div ref={imageRef} className="space-y-4">
          <div className="product-image aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <img
              src={product.images[0]}
              alt={isEnglish ? product.nameEn : product.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          {product.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-md"
                >
                  <img
                    src={img}
                    alt={`${isEnglish ? product.nameEn : product.name} view ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-md cursor-pointer hover:opacity-80"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Details Section */}
        <div ref={detailsRef} className="product-details space-y-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-gray-100">
              {isEnglish ? product.nameEn : product.name}
            </h1>
          </div>

          <div className="border-t border-b border-gray-200 dark:border-gray-700 py-4">
            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(product.price, i18n.language)}
            </p>
            {product.oldPrice && (
              <p className="text-gray-500 dark:text-gray-400 line-through">
                {formatCurrency(product.oldPrice, i18n.language)}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              {t("product.aboutItem")}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
              {isEnglish ? product.descriptionEn : product.description}
            </p>
          </div>

          {/* Specifications */}
          <div className="specifications-section bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
              {t("product.specifications")}
            </h2>
            <div className="space-y-3">
              <div className="spec-card grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.material")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.materialEn
                    : product.specifications.material}
                </span>
              </div>
              <div className="spec-card grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.dimensions")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.dimensionsEn
                    : product.specifications.dimensions}
                </span>
              </div>
              <div className="spec-card grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.weight")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.weightEn
                    : product.specifications.weight}
                </span>
              </div>
              <div className="spec-card grid grid-cols-2 gap-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  {t("product.color")}:
                </span>
                <span className="text-gray-900 dark:text-gray-100">
                  {isEnglish
                    ? product.specifications.colorEn.join(", ")
                    : product.specifications.color.join(", ")}
                </span>
              </div>
            </div>
          </div>

          {/* Add to Cart Section */}
          <div className="add-to-cart-section space-y-4">
            <div className="flex items-center gap-4">
              <button
                className="add-to-cart-btn bg-blue-600 dark:bg-blue-500 text-white px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors w-full text-base sm:text-lg font-semibold"
                onClick={() => addToCart(product)}
              >
                {t("common.addToCart")}
              </button>
            </div>

            {/* Stock Status */}
            <p
              className={`text-lg font-medium ${
                product.inStock
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {product.inStock ? t("common.inStock") : t("common.outOfStock")}
            </p>
          </div>
        </div>
      </div>
      </div>
      
      {/* Cart Sidebar */}
      <CartSidebar />
    </div>
  );
};

export default ProductPage;
