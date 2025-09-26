// components/BlokOzetKarti.js
import { useState, useEffect } from "react";
import { useAidat } from "../hooks/useAidat";

export default function BlokOzetKarti({ blokHarfi, kompleksData }) {
  const { aidatVerisi, loading, error, hesaplaAidat } = useAidat(blokHarfi);

  // Aidat hesapla
  useEffect(() => {
    hesaplaAidat();
  }, [hesaplaAidat]);

  const getBlokInfo = () => {
    if (!kompleksData?.bloklar) return {};
    return kompleksData.bloklar.find((b) => b.blokHarfi === blokHarfi) || {};
  };

  const blokInfo = getBlokInfo();

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
          </div>
        ) : aidatVerisi ? (
          <>
            {/* Gider Detay Tablosu */}
            {aidatVerisi.giderDetayTablosu &&
              aidatVerisi.giderDetayTablosu.length > 0 && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-700 mb-3">
                    📊 Gider Detay Tablosu
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="min-w-full  rounded-lg bg-white text-sm">
                      <thead className="bg-gray-50 hidden md:table-header-group">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gider Türü
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Toplam Tutar
                          </th>
                          <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Daire Payı
                          </th>
                          <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Pay Tipi
                          </th>
                        </tr>
                      </thead>

                      {/* Mobil başlık */}
                      <thead className="bg-gray-50 md:hidden">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Gider Detayları
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {aidatVerisi.giderDetayTablosu
                          .filter((gider) => (gider.toplamTutar || 0) > 0)
                          .map((gider, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {/* Mobil görünüm */}
                              <td className="px-3 py-2 block md:hidden">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="font-medium text-gray-900">
                                      {gider.giderTuru}
                                    </div>
                                    {gider.aciklama && (
                                      <div className="text-xs text-gray-500 mt-1">
                                        {gider.aciklama}
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-right ml-4">
                                    <div className="font-medium text-gray-900">
                                      ₺{(gider.dairePayi || 0).toFixed(2)}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Toplam: ₺
                                      {(gider.toplamTutar || 0).toLocaleString(
                                        "tr-TR"
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Desktop görünüm */}
                              <td className="px-3 py-2 hidden md:table-cell">
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
                              <td className="px-3 py-2 text-right font-medium text-gray-900 hidden md:table-cell">
                                ₺
                                {(gider.toplamTutar || 0).toLocaleString(
                                  "tr-TR"
                                )}
                              </td>
                              <td className="px-3 py-2 text-right font-medium text-gray-900 hidden md:table-cell">
                                ₺{(gider.dairePayi || 0).toFixed(2)}
                              </td>
                              <td className="px-3 py-2 text-center hidden md:table-cell">
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
                    {aidatVerisi.blokOzeti?.ortalamaDaireAidati.toFixed(2) || 0}
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
          </div>
        )}
      </div>
    </div>
  );
}
