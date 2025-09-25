// components/BlokOzetKarti.js
import { useState, useEffect } from "react";

export default function BlokOzetKarti({ blokHarfi, kompleksData }) {
  const [aidatVerisi, setAidatVerisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Mevcut period (örneğin 2024-01)
  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  // Aidat hesapla
  const hesaplaAidat = async () => {
    if (!blokHarfi) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/aidat/hesaplamali-detay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          blokHarfi,
          period: getCurrentPeriod(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setAidatVerisi(result.data);
      } else {
        setError(result.message || "Aidat hesaplanamadı");
      }
    } catch (err) {
      console.error("Aidat hesaplama hatası:", err);
      setError("Bu ay için henüz gider verisi girilmemiş");
    } finally {
      setLoading(false);
    }
  };

  // Blok değiştiğinde aidat hesapla
  useEffect(() => {
    hesaplaAidat();
  }, [blokHarfi]);

  const getBlokInfo = () => {
    if (!kompleksData?.bloklar) return {};
    return kompleksData.bloklar.find((b) => b.blokHarfi === blokHarfi) || {};
  };

  const blokInfo = getBlokInfo();

  // Örnek bir daire seç (örneğin ilk daire)
  const ornekDaire = aidatVerisi?.daireAidatlari?.[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">
          {blokHarfi} Blok Özeti
        </h3>
        <div className="text-2xl">
          {blokInfo.kazanGrubu === 1 ? "🔵" : "🟢"}
        </div>
      </div>

      {/* Ana Bilgiler */}
      <div className="space-y-4">
        {/* Daire Bilgileri */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">📊 Daire Bilgileri</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Toplam Daire:</span>
              <p className="font-semibold text-lg text-gray-900">
                {blokInfo.toplamDaireSayisi || 0}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Daire Tipi:</span>
              <p className="font-medium text-gray-900">{blokInfo.daireTipi}</p>
            </div>
            <div>
              <span className="text-gray-600">Metrekare:</span>
              <p className="font-medium text-gray-900">
                {blokInfo.metrekare}m²
              </p>
            </div>
            <div>
              <span className="text-gray-600">Asansör:</span>
              <p className="font-medium text-gray-900">
                {blokInfo.asansorKullananDaireSayisi} daire
              </p>
            </div>
          </div>
        </div>

        {/* Kazan Bilgileri */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">🔥 Isıtma Sistemi</h4>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">Kazan Grubu:</span>
              <p
                className={`font-medium px-2 py-1 rounded-full text-xs inline-block ${
                  blokInfo.kazanGrubu === 1
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                Kazan {blokInfo.kazanGrubu}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Petek Ölçüsü:</span>
              <p className="font-medium text-gray-900">
                {blokInfo.petekOlcusu}cm
              </p>
            </div>
          </div>
        </div>

        {/* Gerçek Aidat Verileri */}
        {loading ? (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded"></div>
                <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-medium text-yellow-700 mb-3">
              ⚠️ Henüz Gider Verisi Yok
            </h4>
            <p className="text-sm text-yellow-600 mb-3">{error}</p>
          </div>
        ) : aidatVerisi ? (
          <table className="min-w-full border border-gray-300 rounded-lg mt-4">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Gider Türü</th>
                <th className="px-4 py-2 border">Açıklama</th>
                <th className="px-4 py-2 border">Toplam Tutar</th>
                <th className="px-4 py-2 border">Daire Payı</th>
                <th className="px-4 py-2 border">Pay Tipi</th>
                <th className="px-4 py-2 border">Gider Tipi</th>
              </tr>
            </thead>
            <tbody>
              {aidatVerisi.giderDetayTablosu.map((gider, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{gider.giderTuru}</td>
                  <td className="px-4 py-2 border">{gider.aciklama}</td>
                  <td className="px-4 py-2 border">
                    ₺{gider.toplamTutar?.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-2 border">
                    ₺{gider.dairePayi?.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-4 py-2 border">{gider.payTipi}</td>
                  <td className="px-4 py-2 border">{gider.giderTipi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          // Gider verisi yok
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-3">
              💰 Aidat Hesaplaması
            </h4>
            <p className="text-sm text-blue-600 mb-3">
              Gerçek aidat hesaplaması için önce gider verilerini girin.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
