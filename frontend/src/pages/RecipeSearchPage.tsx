import { useSearchParams } from 'react-router-dom';
import { IngredientSearchForm } from '../components/recipe-search/IngredientSearchForm';
import { RecipeList } from '../components/recipe-search/RecipeList';
import { useRecipeSearch } from '../hooks/useRecipeSearch';

export function RecipeSearchPage() {
  const [searchParams] = useSearchParams();
  const initialIngredient = searchParams.get('ingredient') ?? '';
  const { ingredient, setIngredient, recipes, loading, error, search } =
    useRecipeSearch(initialIngredient);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">食材からレシピを探す</h1>
      <p className="text-gray-600 mb-4">
        食材名を入力して、レシピを検索できます。
      </p>
      <IngredientSearchForm
        ingredient={ingredient}
        onIngredientChange={setIngredient}
        onSearch={search}
        loading={loading}
      />
      {error && (
        <p className="text-red-600 mb-4" role="alert">
          {error}
        </p>
      )}
      {loading && <p className="text-gray-500">検索中...</p>}
      <RecipeList recipes={recipes} />
    </div>
  );
}
