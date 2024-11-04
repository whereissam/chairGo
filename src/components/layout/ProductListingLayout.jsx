import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown";
import Sidebar from "../home/Sidebar";
import ProductGrid from "../home/ProductGrid";
import SearchBar from "../common/SearchBar";
import { fuzzySearch } from "../../lib/fuzzySearch";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";

// Keep the categories constant
const AVAILABLE_CATEGORIES = [
  "all",
  "office",
  "living",
  "dining",
  "bedroom",
  "outdoor",
  "kids",
  "storage",
  "accent",
];

function ProductListingLayout({
  products,
  initialCategory = "all",
  onCategoryChange,
}) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);

  const sortOptions = [
    { key: "featured", label: t("common.featured") },
    { key: "priceLowToHigh", label: t("common.priceLowToHigh") },
    { key: "priceHighToLow", label: t("common.priceHighToLow") },
    { key: "newest", label: t("common.newestArrivals") },
  ];

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  const { addToCart } = useCart();

  // Handle category change
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  // Update filtered products whenever any filter changes
  useEffect(() => {
    let result = products;

    // Apply fuzzy search filter
    if (searchQuery) {
      result = result
        .filter((product) => {
          // Search in product name
          const nameScore = fuzzySearch(searchQuery, product.name);
          // Search in product description if it exists
          const descScore = product.description
            ? fuzzySearch(searchQuery, product.description)
            : 0;
          // Search in category
          const categoryScore = fuzzySearch(searchQuery, product.category);

          // Return true if any score is above 0 (meaning there was some match)
          return nameScore > 0 || descScore > 0 || categoryScore > 0;
        })
        .sort((a, b) => {
          // Sort by relevance (higher score first)
          const scoreA = Math.max(
            fuzzySearch(searchQuery, a.name),
            a.description ? fuzzySearch(searchQuery, a.description) : 0,
            fuzzySearch(searchQuery, a.category)
          );
          const scoreB = Math.max(
            fuzzySearch(searchQuery, b.name),
            b.description ? fuzzySearch(searchQuery, b.description) : 0,
            fuzzySearch(searchQuery, b.category)
          );
          return scoreB - scoreA;
        });
    }

    // Apply category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    // Apply price range filter
    if (priceRange) {
      result = result.filter(
        (product) =>
          product.price >= priceRange.min && product.price <= priceRange.max
      );
    }

    // Comment out rating filter
    /*
    if (selectedRating) {
      result = result.filter((product) => product.rating >= selectedRating);
    }
    */

    // Modify the featured sort to not use rating
    result = [...result].sort((a, b) => {
      switch (selectedSort.key) {
        case "priceLowToHigh":
          return a.price - b.price;
        case "priceHighToLow":
          return b.price - a.price;
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "featured":
        default:
          // return b.rating - a.rating; // Comment out rating-based sorting
          return 0; // Default to no specific sorting for featured
      }
    });

    setFilteredProducts(result);
  }, [
    products,
    searchQuery,
    selectedCategory,
    priceRange,
    // selectedRating, // Remove from dependencies
    selectedSort,
  ]);

  return (
    <div className="flex gap-6">
      <Sidebar
        categories={AVAILABLE_CATEGORIES}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
        onPriceRangeChange={setPriceRange}
      />

      <div className="flex-1">
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {filteredProducts.length} {t("common.results")}
            {selectedCategory !== "all" &&
              ` ${t("common.resultsIn")} ${t(`categories.${selectedCategory}`)}`}
          </p>
          <div className="flex items-center space-x-4">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-between">
                  {t("common.sortBy")}: {selectedSort.label}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.key}
                    onClick={() => setSelectedSort(option)}
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  );
}

export default ProductListingLayout;
