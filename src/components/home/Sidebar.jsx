import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { convertPrice, formatCurrency } from "../../utils/currency";

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

const Sidebar = ({
  categories = AVAILABLE_CATEGORIES,
  selectedCategory,
  onSelectCategory,
  onPriceRangeChange,
}) => {
  const { t, i18n } = useTranslation();

  const getPriceRanges = () => {
    const ranges = [
      { min: 0, max: Infinity },
      { min: 0, max: 3000 },
      { min: 3000, max: 6000 },
      { min: 6000, max: 15000 },
      { min: 15000, max: Infinity },
    ];

    return ranges.map((range, index) => ({
      ...range,
      label:
        index === 0
          ? t("filters.priceRanges.all")
          : range.max === Infinity
            ? `${formatCurrency(range.min, i18n.language)} ${t("filters.priceRanges.andUp")}`
            : `${formatCurrency(range.min, i18n.language)} - ${formatCurrency(range.max, i18n.language)}`,
    }));
  };

  const priceRanges = getPriceRanges();

  return (
    <aside className="w-64 space-y-6">
      {/* Departments Section */}
      <div>
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {t("filters.departments")}
        </h2>
        <div className="space-y-1">
          {AVAILABLE_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSelectCategory(category)}
            >
              {t(`categories.${category}`)}
            </Button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div>
        <h2 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {t("filters.price")}
        </h2>
        <div className="space-y-1">
          {priceRanges.map((range, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full justify-start"
              onClick={() => onPriceRangeChange(range)}
            >
              {range.label}
            </Button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
