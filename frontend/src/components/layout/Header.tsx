import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="bg-green-600 text-white shadow-md">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          EIMI
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-green-200 transition-colors">
            栄養素検索
          </Link>
          <Link to="/recipe-search" className="hover:text-green-200 transition-colors">
            レシピ検索
          </Link>
        </nav>
      </div>
    </header>
  );
}
