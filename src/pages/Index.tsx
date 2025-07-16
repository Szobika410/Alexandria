
import { useState } from "react";
import SearchHeader from "@/components/SearchHeader";
import CategoryBar from "@/components/CategoryBar";
import BookGrid from "@/components/BookGrid";
import BottomNavBar from "@/components/BottomNavBar";
import FilterModal from "@/components/FilterModal";

const Index = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [appliedFilters, setAppliedFilters] = useState<any>(null);

  const handleFiltersApply = (filters: any) => {
    setAppliedFilters(filters);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <SearchHeader 
        onFilterClick={() => setIsFilterOpen(true)} 
        onSearchChange={setSearchQuery}
        searchQuery={searchQuery}
      />
      <CategoryBar 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      <BookGrid 
        selectedCategory={selectedCategory} 
        searchQuery={searchQuery}
        sortBy={sortBy}
        appliedFilters={appliedFilters}
      />
      <BottomNavBar />
      <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
        onSortChange={setSortBy}
        currentSort={sortBy}
        onFiltersApply={handleFiltersApply}
      />
    </div>
  );
};

export default Index;
