import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

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
  const { t } = useTranslation();

  const priceRanges = [
    { label: t("filters.priceRanges.all"), min: 0, max: Infinity },
    { label: t("filters.priceRanges.underHundred"), min: 0, max: 100 },
    {
      label: t("filters.priceRanges.hundredToTwoHundred"),
      min: 100,
      max: 200,
    },
    {
      label: t("filters.priceRanges.twoHundredToFiveHundred"),
      min: 200,
      max: 500,
    },
    {
      label: t("filters.priceRanges.overFiveHundred"),
      min: 500,
      max: Infinity,
    },
  ];

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
