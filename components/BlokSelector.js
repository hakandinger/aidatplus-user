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

              {/* Daire Tipi */}
              <div className="text-sm text-gray-600 mb-1">
                {blokInfo.daireTipi || "Bilinmiyor"}
              </div>

              {/* Daire Sayısı */}
              <div className="text-sm font-medium text-gray-700 mb-2">
                {blokInfo.toplamDaireSayisi || 0} Daire
              </div>

              {/* Kazan Grubu */}
              <div className="flex items-center justify-between">
                <span
                  className={`
                  px-2 py-1 rounded-full text-xs font-medium
                  ${getKazanColor(blokInfo.kazanGrubu)}
                `}
                >
                  {getKazanInfo(blokInfo.kazanGrubu)}
                </span>

                {/* Metrekare */}
                <span className="text-xs text-gray-500">
                  {blokInfo.metrekare}m²
                </span>
              </div>

              {/* Petek Bilgisi */}
              <div className="mt-2 text-xs text-gray-400">
                Petek: {blokInfo.petekOlcusu}cm
              </div>
            </button>
          );
        })}
      </div>

      {/* Seçili Blok Özeti */}
      {selectedBlok && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">
            {selectedBlok} Bloku Detayları
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Daire Tipi:</span>
              <p className="text-black font-medium">
                {getBlokInfo(selectedBlok).daireTipi}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Toplam Daire:</span>
              <p className="text-black font-medium">
                {getBlokInfo(selectedBlok).toplamDaireSayisi}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Asansör Kullanan:</span>
              <p className=" text-black font-medium">
                {getBlokInfo(selectedBlok).asansorKullananDaireSayisi}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Zemin Kat Daire:</span>
              <p className=" text-black font-medium">
                {getBlokInfo(selectedBlok).zeminKatDaireSayisi}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
