
import { Button } from "@/components/ui/button";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

interface CategoryBarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryBar = ({ selectedCategory, onCategoryChange }: CategoryBarProps) => {
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);
  
  const categories = [
    { id: "all", name: t("all") },
    { id: "fiction", name: t("fiction") },
    { id: "crime", name: t("crime") },
    { id: "romance", name: t("romance") },
    { id: "fantasy", name: t("fantasy") },
    { id: "scifi", name: t("scifi") },
    { id: "biography", name: t("biography") },
    { id: "history", name: t("history") },
    { id: "novel", name: t("novel") },
    { id: "professional", name: t("professional") },
    { id: "children", name: t("children") },
    { id: "poetry", name: t("poetry") },
  ];

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex space-x-2 overflow-x-auto scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category.id)}
            className={`whitespace-nowrap flex-shrink-0 ${
              selectedCategory === category.id 
                ? "bg-orange-600 hover:bg-orange-700 text-white" 
                : "text-gray-600 hover:text-orange-600"
            }`}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryBar;
