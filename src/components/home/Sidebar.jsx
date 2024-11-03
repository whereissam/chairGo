import { ChevronRight, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown";
import { Button } from "../ui/button";

function Sidebar({
  categories,
  selectedCategory,
  onSelectCategory,
  onPriceRangeChange,
  onRatingChange,
}) {
  const { t } = useTranslation();
  const [selectedPriceRange, setSelectedPriceRange] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const priceRanges = [
    { key: "all", min: 0, max: Infinity, label: "全部价格" },
    { key: "underHundred", min: 0, max: 100 },
    { key: "hundredToTwoHundred", min: 100, max: 200 },
    { key: "twoHundredToFiveHundred", min: 200, max: 500 },
    { key: "overFiveHundred", min: 500, max: Infinity },
  ];

  const handlePriceRangeClick = (range) => {
    if (selectedPriceRange?.key === range.key) {
      return;
    }
    setSelectedPriceRange(range);
    onPriceRangeChange?.(range);
  };

  const handleRatingClick = (rating) => {
    if (selectedRating === rating) {
      setSelectedRating(null);
      onRatingChange?.(null);
    } else {
      setSelectedRating(rating);
      onRatingChange?.(rating);
    }
  };

  return (
    <div className="w-56 flex-shrink-0 space-y-4">
      {/* Category Dropdown */}
      <div className="bg-card text-card-foreground rounded-lg shadow p-4 border border-border">
        <h2 className="font-bold text-lg mb-4">{t("filters.departments")}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedCategory === "all"
                ? t("categories.all")
                : t(`categories.${selectedCategory}`)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem
              onClick={() => onSelectCategory("all")}
              className={selectedCategory === "all" ? "bg-accent" : ""}
            >
              {t("categories.all")}
            </DropdownMenuItem>
            {Object.entries(categories).map(([key]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => onSelectCategory(key)}
                className={selectedCategory === key ? "bg-accent" : ""}
              >
                {t(`categories.${key}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Price Filter */}
      <div className="bg-card text-card-foreground rounded-lg shadow p-4 border border-border">
        <h2 className="font-bold text-lg mb-4">{t("filters.price")}</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedPriceRange
                ? t(`filters.priceRanges.${selectedPriceRange.key}`)
                : t("filters.priceRanges.all")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            {priceRanges.map((range) => (
              <DropdownMenuItem
                key={range.key}
                onClick={() => handlePriceRangeClick(range)}
                className={
                  selectedPriceRange?.key === range.key ? "bg-accent" : ""
                }
              >
                {t(`filters.priceRanges.${range.key}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Customer Review */}
      <div className="bg-card text-card-foreground rounded-lg shadow p-4 border border-border">
        <h2 className="font-bold text-lg mb-4">
          {t("filters.customerReview")}
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              {selectedRating
                ? `${selectedRating} ${t("common.andUp")}`
                : t("filters.ratingAll")}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuItem
              onClick={() => handleRatingClick(null)}
              className={!selectedRating ? "bg-accent" : ""}
            >
              {t("filters.ratingAll")}
            </DropdownMenuItem>
            {[4, 3, 2, 1].map((rating) => (
              <DropdownMenuItem
                key={rating}
                onClick={() => handleRatingClick(rating)}
                className={selectedRating === rating ? "bg-accent" : ""}
              >
                {"⭐".repeat(rating)} {t("common.andUp")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default Sidebar;
