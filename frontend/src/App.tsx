import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { NutrientSearchPage } from './pages/NutrientSearchPage';
import { RecipeSearchPage } from './pages/RecipeSearchPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<NutrientSearchPage />} />
          <Route path="/recipe-search" element={<RecipeSearchPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
