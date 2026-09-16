// components/BlokSelector.js
export default function BlokSelector({
  selectedBlok,
  onBlokChange,
  kompleksData,
}) {
  const bloklar = ["A", "B", "C", "D", "E", "F"];

  const getBlokInfo = (blokHarfi) => {
    if (!kompleksData?.bloklar) return {};
    return kompleksData.bloklar.find((b) => b.blokHarfi === blokHarfi) || {};
  };

  const getKazanInfo = (kazanGrubu) => {
    return kazanGrubu === 1 ? "Kazan 1" : "Kazan 2";
  };

  const getKazanColor = (kazanGrubu) => {
    return kazanGrubu === 1
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">🏗️ Blok Seçimi</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {bloklar.map((blokHarfi) => {
          const blokInfo = getBlokInfo(blokHarfi);
          const isSelected = selectedBlok === blokHarfi;

          return (
            <button
              key={blokHarfi}
              onClick={() => onBlokChange(blokHarfi)}
              className={`
                relative p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 shadow-md transform scale-105"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                }
              `}
            >
              {/* Blok Harfi */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-xl font-bold ${
                    isSelected ? "text-blue-700" : "text-gray-700"
                  }`}
                >
                  {blokHarfi}
                </span>
                {isSelected && <span className="text-blue-500">✓</span>}
              </div>             


             
            </button>
          );
        })}
      </div>
     
      
    </div>
  );
}
