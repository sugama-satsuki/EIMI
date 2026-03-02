export function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-4 mt-auto">
      <div className="max-w-5xl mx-auto px-4 text-center space-y-1">
        <p>
          食品成分データ出典：
          <a
            href="https://www.mext.go.jp/a_menu/syokuhinseibun/mext_00001.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            日本食品標準成分表
          </a>
          （CC BY 4.0）
        </p>
        <p>
          レシピ提供：
          <a
            href="https://recipe.rakuten.co.jp/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:underline"
          >
            楽天レシピ
          </a>
        </p>
      </div>
    </footer>
  );
}
