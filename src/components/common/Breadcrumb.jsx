import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";
import { useTheme } from "../../context/ThemeContext";

function Breadcrumb({ items }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.id} className="flex items-center">
            {index > 0 && (
              <ChevronRight
                className={cn(
                  "mx-2 h-4 w-4",
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                )}
              />
            )}
            <Link
              to={item.href}
              className={cn(
                "text-sm hover:text-primary transition-colors",
                theme === "dark" ? "text-gray-300" : "text-gray-600",
                index === items.length - 1 && "font-medium"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
