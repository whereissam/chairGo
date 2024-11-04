import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, Filter } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Sidebar from "../home/Sidebar";
import ProductGrid from "../home/ProductGrid";
import SearchBar from "../common/SearchBar";
import { fuzzySearch } from "../../lib/fuzzySearch";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { convertPrice } from "../../utils/currency";

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
  const { t, i18n } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sortOptions = [
    { key: "featured", label: t("common.featured") },
    { key: "priceLowToHigh", label: t("common.priceLowToHigh") },
    { key: "priceHighToLow", label: t("common.priceHighToLow") },
    { key: "newest", label: t("common.newestArrivals") },
  ];

  const [selectedSort, setSelectedSort] = useState(sortOptions[0]);

  const { addToCart } = useCart();

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  useEffect(() => {
    let result = products;

    if (searchQuery) {
      result = result
        .filter((product) => {
          const nameScore = fuzzySearch(searchQuery, product.name);
          const descScore = product.description
            ? fuzzySearch(searchQuery, product.description)
            : 0;
          const categoryScore = fuzzySearch(searchQuery, product.category);
          return nameScore > 0 || descScore > 0 || categoryScore > 0;
        })
        .sort((a, b) => {
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

    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (priceRange) {
      result = result.filter((product) => {
        const convertedPrice = convertPrice(product.price, i18n.language);
        const convertedMin = convertPrice(priceRange.min, i18n.language);
        const convertedMax = convertPrice(priceRange.max, i18n.language);
        return convertedPrice >= convertedMin && convertedPrice <= convertedMax;
      });
    }

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
          return 0;
      }
    });

    setFilteredProducts(result);
  }, [products, searchQuery, selectedCategory, priceRange, selectedSort]);

  return (
    <div className="relative">
      {/* Mobile Filter Button */}
      <div className="lg:hidden flex justify-between items-center mb-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              {t("filters.departments")}
              <ChevronDown className="h-4 w-4 ml-2" />
            </Button>
          </SheetTrigger>
          <SheetContent side="center" className="w-[90%] max-w-[400px] p-0">
            <SheetHeader className="px-6 py-4 border-b border-border">
              <SheetTitle>{t("filters.departments")}</SheetTitle>
            </SheetHeader>
            <div className="px-6 py-4">
              <Sidebar
                categories={AVAILABLE_CATEGORIES}
                selectedCategory={selectedCategory}
                onSelectCategory={(category) => {
                  handleCategoryChange(category);
                  setIsSidebarOpen(false);
                }}
                onPriceRangeChange={setPriceRange}
                selectedPriceRange={priceRange}
                isMobile={true}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:w-64">
          <Sidebar
            categories={AVAILABLE_CATEGORIES}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategoryChange}
            onPriceRangeChange={setPriceRange}
            selectedPriceRange={priceRange}
            isMobile={false}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="text-sm text-muted-foreground">
              {filteredProducts.length} {t("common.results")}
              {selectedCategory !== "all" &&
                ` ${t("common.resultsIn")} ${t(`categories.${selectedCategory}`)}`}
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                className="w-full sm:w-auto"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full sm:w-[200px] justify-between"
                  >
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
    </div>
  );
}

export default ProductListingLayout;
