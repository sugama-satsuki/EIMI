import type { NutrientInfo } from '../../types/nutrient';

interface NutrientSelectorProps {
  nutrients: NutrientInfo[];
  value: string;
  onChange: (value: string) => void;
}

export function NutrientSelector({ nutrients, value, onChange }: NutrientSelectorProps) {
  return (
    <select
      data-testid="nutrient-select"
      className="border border-gray-300 rounded px-3 py-2 w-full"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">栄養素を選択してください</option>
      {nutrients.map((n) => (
        <option key={n.key} value={n.key}>
          {n.label}（{n.unit}）
        </option>
      ))}
    </select>
  );
}
