import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { useTranslation } from "react-i18next";

function SearchBar({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <div className="relative w-64">
      <Input
        type="text"
        placeholder={t("common.search")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
      <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
    </div>
  );
}

export default SearchBar;
