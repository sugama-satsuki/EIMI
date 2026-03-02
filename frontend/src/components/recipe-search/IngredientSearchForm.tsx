import type { FormEvent } from 'react';

interface IngredientSearchFormProps {
  ingredient: string;
  onIngredientChange: (value: string) => void;
  onSearch: (ingredient: string) => void;
  loading: boolean;
}

export function IngredientSearchForm({
  ingredient,
  onIngredientChange,
  onSearch,
  loading,
}: IngredientSearchFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(ingredient);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
      <input
        type="text"
        data-testid="ingredient-input"
        value={ingredient}
        onChange={(e) => onIngredientChange(e.target.value)}
        placeholder="食材名を入力（例: 鶏肉）"
        className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        data-testid="recipe-search-button"
        disabled={loading || !ingredient.trim()}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '検索中...' : '検索'}
      </button>
    </form>
  );
}
