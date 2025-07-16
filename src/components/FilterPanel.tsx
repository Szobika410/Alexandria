
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { getCurrentCountry, getTranslation } from "@/utils/internationalization";

interface FilterPanelProps {
  onSortChange: (sort: string) => void;
  currentSort: string;
  onFiltersApply?: (filters: FilterState) => void;
}

interface FilterState {
  category: string;
  languages: string[];
  conditions: string[];
  priceRange: [number, number];
}

const FilterPanel = ({ onSortChange, currentSort, onFiltersApply }: FilterPanelProps) => {
  const currentCountry = getCurrentCountry();
  const t = (key: string) => getTranslation(key, currentCountry.language);
  
  const [filters, setFilters] = useState<FilterState>({
    category: "",
    languages: [],
    conditions: [],
    priceRange: [0, 10000]
  });

  const handleCategoryChange = (value: string) => {
    setFilters(prev => ({ ...prev, category: value }));
  };

  const handleCheckboxChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => {
      const currentArray = prev[category] as string[];
      return {
        ...prev,
        [category]: currentArray.includes(value)
          ? currentArray.filter(item => item !== value)
          : [...currentArray, value]
      };
    });
  };

  const applyFilters = () => {
    onFiltersApply?.(filters);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      languages: [],
      conditions: [],
      priceRange: [0, 10000]
    });
    onSortChange("relevance");
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4">{t('filters')}</h3>
      
      <div className="space-y-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-2">{t('sortBy')}</h4>
          <Select value={currentSort} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">{t('relevance')}</SelectItem>
              <SelectItem value="price-low">{t('priceAsc')}</SelectItem>
              <SelectItem value="price-high">{t('priceDesc')}</SelectItem>
              <SelectItem value="newest">{t('newest')}</SelectItem>
              <SelectItem value="oldest">{t('oldest')}</SelectItem>
              <SelectItem value="most-liked">{t('mostLiked')}</SelectItem>
              <SelectItem value="least-liked">{t('leastLiked')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">{t('category')}</h4>
          <Select value={filters.category} onValueChange={handleCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fiction">{t('fiction')}</SelectItem>
              <SelectItem value="crime">{t('crime')}</SelectItem>
              <SelectItem value="romance">{t('romance')}</SelectItem>
              <SelectItem value="fantasy">{t('fantasy')}</SelectItem>
              <SelectItem value="scifi">{t('scifi')}</SelectItem>
              <SelectItem value="biography">{t('biography')}</SelectItem>
              <SelectItem value="history">{t('history')}</SelectItem>
              <SelectItem value="novel">{t('novel')}</SelectItem>
              <SelectItem value="professional">{t('professional')}</SelectItem>
              <SelectItem value="children">{t('children')}</SelectItem>
              <SelectItem value="poetry">{t('poetry')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">{t('language')}</h4>
          <Select value={filters.languages[0] || ""} onValueChange={(value) => setFilters(prev => ({ ...prev, languages: value ? [value] : [] }))}>
            <SelectTrigger>
              <SelectValue placeholder={t('selectLanguage')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hungarian">{t('hungarian')}</SelectItem>
              <SelectItem value="romanian">{t('romanian')}</SelectItem>
              <SelectItem value="english">{t('english')}</SelectItem>
              <SelectItem value="german">{t('german')}</SelectItem>
              <SelectItem value="french">{t('french')}</SelectItem>
              <SelectItem value="italian">{t('italian')}</SelectItem>
              <SelectItem value="spanish">{t('spanish')}</SelectItem>
              <SelectItem value="russian">{t('russian')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <h4 className="font-medium text-gray-700 mb-2">{t('condition')}</h4>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="new"
                checked={filters.conditions.includes("new")}
                onCheckedChange={() => handleCheckboxChange("conditions", "new")}
              />
              <label htmlFor="new" className="text-sm text-gray-600">{t('new')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="good"
                checked={filters.conditions.includes("good")}
                onCheckedChange={() => handleCheckboxChange("conditions", "good")}
              />
              <label htmlFor="good" className="text-sm text-gray-600">{t('good')}</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="acceptable"
                checked={filters.conditions.includes("acceptable")}
                onCheckedChange={() => handleCheckboxChange("conditions", "acceptable")}
              />
              <label htmlFor="acceptable" className="text-sm text-gray-600">{t('acceptable')}</label>
            </div>
          </div>
        </div>


        <div>
          <h4 className="font-medium text-gray-700 mb-2">{t('priceRange')}</h4>
          <div className="space-y-3">
            <Slider
              value={filters.priceRange}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
              max={10000}
              min={0}
              step={100}
              className="w-full"
            />
            <div className="flex space-x-2">
              <div className="flex-1">
                <label className="text-xs text-gray-500">{t('min')}</label>
                <Input
                  type="number"
                  value={filters.priceRange[0]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    setFilters(prev => ({ ...prev, priceRange: [value, prev.priceRange[1]] }));
                  }}
                  className="text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500">{t('max')}</label>
                <Input
                  type="number"
                  value={filters.priceRange[1]}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 10000;
                    setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], value] }));
                  }}
                  className="text-sm"
                />
              </div>
            </div>
            <div className="text-xs text-gray-500 text-center">
              {filters.priceRange[0]} - {filters.priceRange[1]} {currentCountry.currency}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700 text-white mb-2"
            onClick={applyFilters}
          >
            {t('applyFilters')}
          </Button>
          <Button 
            variant="outline" 
            className="w-full border-orange-300 text-orange-700"
            onClick={clearFilters}
          >
            {t('clearFilters')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;
