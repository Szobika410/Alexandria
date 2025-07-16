
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchHeaderProps {
  onFilterClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

const SearchHeader = ({ onFilterClick, onSearchChange, searchQuery }: SearchHeaderProps) => {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input 
              placeholder="Keress könyveket, szerzőket..." 
              className="pl-10 border-orange-200 focus:border-orange-400"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            onClick={onFilterClick}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchHeader;
