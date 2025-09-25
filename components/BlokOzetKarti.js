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
  const ornekDaire = aidatVerisi?.daireAidatlari?.[5];

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
            <button
              onClick={() => (window.location.href = "/gider")}
              className="text-sm bg-yellow-600 text-white px-3 py-1 rounded-lg hover:bg-yellow-700"
            >
              Gider Girişi Yap
            </button>
          </div>
        ) : aidatVerisi ? (
          <>
            {/* Örnek Daire Aidat Detayı */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-green-700">
                  💰 Örnek Daire Aidatı (
                  {ornekDaire?.daireBilgileri?.daireTamAdi})
                </h4>
                <button
                  onClick={hesaplaAidat}
                  className="text-xs text-green-600 hover:text-green-800"
                  title="Yenile"
                >
                  🔄
                </button>
              </div>

              {ornekDaire && (
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Asansör Payı:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(ornekDaire.aidatDetayi.asansorPayi || 0).toLocaleString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doğalgaz Payı:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(ornekDaire.aidatDetayi.dogazPayi || 0).toLocaleString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Güvenlik:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(
                        ornekDaire.aidatDetayi.guvenlikPayi || 0
                      ).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Temizlik:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(
                        ornekDaire.aidatDetayi.temizlikPayi || 0
                      ).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Elektrik:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(
                        ornekDaire.aidatDetayi.elektrikPayi || 0
                      ).toLocaleString("tr-TR")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Su:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(ornekDaire.aidatDetayi.suPayi || 0).toLocaleString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Masraflar:</span>
                    <span className="font-medium text-gray-900">
                      ₺
                      {(ornekDaire.aidatDetayi.masrafPayi || 0).toLocaleString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                  {ornekDaire.aidatDetayi.ekGiderPayi > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ek Giderler:</span>
                      <span className="font-medium text-gray-900">
                        ₺
                        {(
                          ornekDaire.aidatDetayi.ekGiderPayi || 0
                        ).toLocaleString("tr-TR")}
                      </span>
                    </div>
                  )}
                  <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                    <span className="text-gray-600">TOPLAM:</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₺
                      {(ornekDaire.aidatDetayi.toplamAidat || 0).toLocaleString(
                        "tr-TR"
                      )}
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Period: {getCurrentPeriod()} • Kazan {blokInfo.kazanGrubu} •
                {ornekDaire?.daireBilgileri?.asansorKullanimi
                  ? " Asansör+"
                  : " Zemin Kat"}
              </p>
            </div>

            {/* Gider Detay Tablosu */}
            {aidatVerisi.giderDetayTablosu &&
              aidatVerisi.giderDetayTablosu.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 mb-3">
                    📊 Gider Detay Tablosu
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 rounded-lg bg-white text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 border text-left font-medium text-gray-700">
                            Gider
                          </th>
                          <th className="px-3 py-2 border text-right font-medium text-gray-700">
                            Toplam
                          </th>
                          <th className="px-3 py-2 border text-right font-medium text-gray-700">
                            Daire Payı
                          </th>
                          <th className="px-3 py-2 border text-center font-medium text-gray-700">
                            Pay Tipi
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {aidatVerisi.giderDetayTablosu.map((gider, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-3 py-2 border">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {gider.giderTuru}
                                </div>
                                {gider.aciklama && (
                                  <div
                                    className="text-xs text-gray-500 truncate"
                                    title={gider.aciklama}
                                  >
                                    {gider.aciklama}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-3 py-2 border text-right font-medium text-gray-900">
                              ₺
                              {(gider.toplamTutar || 0).toLocaleString("tr-TR")}
                            </td>
                            <td className="px-3 py-2 border text-right font-medium text-gray-900">
                              ₺{(gider.dairePayi || 0).toFixed(2)}
                            </td>
                            <td className="px-3 py-2 border text-center">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  gider.payTipi === "Eşit Pay"
                                    ? "bg-green-100 text-green-800"
                                    : gider.payTipi === "Metrekare"
                                    ? "bg-blue-100 text-blue-800"
                                    : gider.payTipi === "Petek Ölçüsü"
                                    ? "bg-orange-100 text-orange-800"
                                    : gider.payTipi === "Kullanan Daire"
                                    ? "bg-purple-100 text-purple-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {gider.payTipi}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Toplam */}
                  <div className="mt-3 pt-3 border-t flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      Toplam Daire Aidatı:
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      ₺
                      {aidatVerisi.giderDetayTablosu
                        .reduce(
                          (toplam, gider) => toplam + (gider.dairePayi || 0),
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

            {/* Blok Özeti */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-medium text-purple-700 mb-3">
                🏢 {blokHarfi} Blok Toplam Özeti
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Toplam Daire:</span>
                  <p className="font-bold text-gray-900">
                    {aidatVerisi.blokOzeti?.toplamDaireSayisi || 0}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Ortalama Aidat:</span>
                  <p className="font-bold text-gray-900">
                    ₺
                    {(aidatVerisi.blokOzeti?.ortalamaDaireAidati || 0).toFixed(
                      0
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Blok Toplam:</span>
                  <p className="font-bold text-gray-900">
                    ₺
                    {(aidatVerisi.blokOzeti?.toplamAidat || 0).toLocaleString(
                      "tr-TR"
                    )}
                  </p>
                </div>
                <div>
                  <span className="text-gray-600">Zemin Kat:</span>
                  <p className="font-bold text-gray-900">
                    {aidatVerisi.blokOzeti?.zeminKatDaireSayisi || 0} daire
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          // Gider verisi yok
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-700 mb-3">
              💰 Aidat Hesaplaması
            </h4>
            <p className="text-sm text-blue-600 mb-3">
              Gerçek aidat hesaplaması için önce gider verilerini girin.
            </p>
            <button
              onClick={() => (window.location.href = "/gider")}
              className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
            >
              📝 Gider Girişi Yap
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
