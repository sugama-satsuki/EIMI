export function Loading() {
  return (
    <div className="flex items-center justify-center py-8" data-testid="loading">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      <span className="ml-3 text-gray-600">読み込み中...</span>
    </div>
  );
}
