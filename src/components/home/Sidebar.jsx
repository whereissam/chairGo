import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { convertPrice, formatCurrency } from "../../utils/currency";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown";
import { cn } from "../../lib/utils";

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

const PRICE_RANGES = [
  { min: 0, max: 3000, key: "underHundred" },
  { min: 3000, max: 6000, key: "hundredToTwoHundred" },
  { min: 6000, max: 10000, key: "twoHundredToFiveHundred" },
  { min: 10000, max: Infinity, key: "overFiveHundred" },
];

function Sidebar({
  categories = AVAILABLE_CATEGORIES,
  selectedCategory,
  onSelectCategory,
  onPriceRangeChange,
  selectedPriceRange = null,
  isMobile = false,
}) {
  const { t, i18n } = useTranslation();

  const getPriceRangeLabel = (range) => {
    if (!range) return t("filters.price");
    const matchingRange = PRICE_RANGES.find(
      (r) => r.min === range.min && r.max === range.max
    );
    if (matchingRange) {
      return t(`filters.priceRanges.${matchingRange.key}`);
    }
    return t("filters.price");
  };

  // Mobile version with dropdowns
  if (isMobile) {
    return (
      <div className="space-y-4">
        {/* Categories Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-2 hover:border-primary"
            >
              {selectedCategory === "all"
                ? t("filters.departments")
                : t(`categories.${selectedCategory}`)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[calc(100%-2rem)] min-w-[200px] border-2"
            align="center"
          >
            {categories.map((category) => (
              <DropdownMenuItem
                key={category}
                onClick={() => onSelectCategory(category)}
                className={cn(
                  "cursor-pointer hover:bg-accent",
                  selectedCategory === category && "bg-accent/50 font-medium"
                )}
              >
                {t(`categories.${category}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Range Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between border-2 hover:border-primary"
            >
              {getPriceRangeLabel(selectedPriceRange)}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[calc(100%-2rem)] min-w-[200px] border-2"
            align="center"
          >
            <DropdownMenuItem
              onClick={() => onPriceRangeChange(null)}
              className={cn(
                "cursor-pointer hover:bg-accent",
                !selectedPriceRange && "bg-accent/50 font-medium"
              )}
            >
              {t("filters.priceRanges.all")}
            </DropdownMenuItem>
            {PRICE_RANGES.map((range) => (
              <DropdownMenuItem
                key={range.key}
                onClick={() =>
                  onPriceRangeChange({ min: range.min, max: range.max })
                }
                className={cn(
                  "cursor-pointer hover:bg-accent",
                  selectedPriceRange?.min === range.min &&
                    selectedPriceRange?.max === range.max &&
                    "bg-accent/50 font-medium"
                )}
              >
                {t(`filters.priceRanges.${range.key}`)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // Desktop version with expanded filters
  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div>
        <h3 className="font-medium mb-3 text-foreground">
          {t("filters.departments")}
        </h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => onSelectCategory(category)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selectedCategory === category
                  ? "bg-accent/50 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/30"
              )}
            >
              {t(`categories.${category}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h3 className="font-medium mb-3 text-foreground">
          {t("filters.price")}
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => onPriceRangeChange(null)}
            className={cn(
              "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
              !selectedPriceRange
                ? "bg-accent/50 font-medium text-foreground"
                : "text-muted-foreground hover:bg-accent/30"
            )}
          >
            {t("filters.priceRanges.all")}
          </button>
          {PRICE_RANGES.map((range) => (
            <button
              key={range.key}
              onClick={() =>
                onPriceRangeChange({ min: range.min, max: range.max })
              }
              className={cn(
                "w-full text-left px-3 py-2 rounded-md text-sm transition-colors",
                selectedPriceRange?.min === range.min &&
                  selectedPriceRange?.max === range.max
                  ? "bg-accent/50 font-medium text-foreground"
                  : "text-muted-foreground hover:bg-accent/30"
              )}
            >
              {t(`filters.priceRanges.${range.key}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
