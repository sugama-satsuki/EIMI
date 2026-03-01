import { useNutrientSearch } from '../hooks/useNutrientSearch';
import { NutrientSearchForm } from '../components/nutrient-search/NutrientSearchForm';
import { FoodResultList } from '../components/nutrient-search/FoodResultList';
import { Loading } from '../components/common/Loading';
import { ErrorMessage } from '../components/common/ErrorMessage';

export function NutrientSearchPage() {
  const {
    nutrients,
    selectedNutrient,
    setSelectedNutrient,
    foods,
    unit,
    loading,
    nutrientsLoading,
    error,
    search,
  } = useNutrientSearch();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">栄養素で食材を探す</h1>
      <p className="text-gray-600 mb-6">栄養素を選択して、含有量の多い食材を検索できます。</p>

      {nutrientsLoading ? (
        <Loading />
      ) : (
        <NutrientSearchForm
          nutrients={nutrients}
          selectedNutrient={selectedNutrient}
          onNutrientChange={setSelectedNutrient}
          onSearch={search}
          disabled={loading}
        />
      )}

      {error && <div className="mt-4"><ErrorMessage message={error} /></div>}

      {loading && <Loading />}

      {!loading && foods.length > 0 && (
        <div className="mt-6">
          <FoodResultList foods={foods} unit={unit} />
        </div>
      )}
    </div>
  );
}
