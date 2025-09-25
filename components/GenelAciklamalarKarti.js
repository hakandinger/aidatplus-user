export default function GenelAciklamalarKarti({ genelAciklamalar }) {
  const getPriorityColor = (oncelik) => {
    switch (oncelik) {
      case "yuksek":
        return "bg-red-50 border-red-200 text-red-800";
      case "orta":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "dusuk":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getPriorityIcon = (oncelik) => {
    switch (oncelik) {
      case "yuksek":
        return "🚨";
      case "orta":
        return "⚠️";
      case "dusuk":
        return "📝";
      default:
        return "💬";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 ">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        📋 Genel Açıklamalar
      </h3>

      {genelAciklamalar && genelAciklamalar.length > 0 ? (
        <div className="space-y-3">
          {genelAciklamalar.map((item, index) => (
            <div
              key={index}
              className={`rounded-lg border p-3 ${getPriorityColor(
                item.oncelik
              )}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getPriorityIcon(item.oncelik)}</span>
                    <h4 className="font-medium">{item.baslik}</h4>
                  </div>
                  <p className="text-sm">{item.aciklama}</p>
                </div>
                <span className="text-xs opacity-75 ml-3">
                  {new Date(item.tarih).toLocaleDateString("tr-TR")}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">
          Bu ay için genel açıklama bulunmamaktadır.
        </p>
      )}
    </div>
  );
}
