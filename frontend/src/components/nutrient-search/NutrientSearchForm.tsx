import type { NutrientInfo } from '../../types/nutrient';
import { NutrientSelector } from './NutrientSelector';

interface NutrientSearchFormProps {
  nutrients: NutrientInfo[];
  selectedNutrient: string;
  onNutrientChange: (value: string) => void;
  onSearch: () => void;
  disabled?: boolean;
}

export function NutrientSearchForm({
  nutrients,
  selectedNutrient,
  onNutrientChange,
  onSearch,
  disabled,
}: NutrientSearchFormProps) {
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <NutrientSelector
          nutrients={nutrients}
          value={selectedNutrient}
          onChange={onNutrientChange}
        />
      </div>
      <button
        data-testid="search-button"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onSearch}
        disabled={disabled || !selectedNutrient}
      >
        検索
      </button>
    </div>
  );
}
