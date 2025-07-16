
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import FilterPanel from "./FilterPanel";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSortChange: (sort: string) => void;
  currentSort: string;
  onFiltersApply?: (filters: any) => void;
}

const FilterModal = ({ isOpen, onClose, onSortChange, currentSort, onFiltersApply }: FilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-sm h-full overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Szűrők</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        <div className="p-4">
          <FilterPanel onSortChange={onSortChange} currentSort={currentSort} onFiltersApply={onFiltersApply} />
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
