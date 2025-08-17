// Componente per il caricamento skeleton
function RecipeSkeleton() {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="bg-gray-200 h-8 w-48 mb-4 rounded"></div>
        <div className="bg-gray-200 h-64 md:h-96 rounded-2xl mb-8"></div>
        <div className="space-y-4">
          <div className="bg-gray-200 h-6 w-3/4 rounded"></div>
          <div className="bg-gray-200 h-4 w-full rounded"></div>
          <div className="bg-gray-200 h-4 w-2/3 rounded"></div>
        </div>
      </div>
    );
  }
export default RecipeSkeleton;