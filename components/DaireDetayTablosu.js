// components/DaireDetayTablosu.js
import { useState, useEffect } from "react";

export default function DaireDetayTablosu({ blokHarfi, period }) {
  const [daireVerileri, setDaireVerileri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [secilenKat, setSecilenKat] = useState("tumkatlarda");

  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const hesaplaDaireAidatlari = async () => {
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
          period: period || getCurrentPeriod(),
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDaireVerileri(result.data);
      } else {
        setError(result.message || "Daire aidatları hesaplanamadı");
      }
    } catch (err) {
      console.error("Daire aidat hesaplama hatası:", err);
      setError("Henüz gider verisi girilmemiş veya daire yapısı kurulmamış");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    hesaplaDaireAidatlari();
  }, [blokHarfi, period]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded mb-4 w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center py-8">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Veri Bulunamadı
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </div>
      </div>
    );
  }

  if (!daireVerileri) return null;

  // Kat filtreleme
  const katlar = [
    ...new Set(daireVerileri.daireAidatlari.map((d) => d.daireBilgileri.kat)),
  ].sort((a, b) => a - b);
  const filtrelenmisVeriler =
    secilenKat === "tumkatlarda"
      ? daireVerileri.daireAidatlari
      : daireVerileri.daireAidatlari.filter(
          (d) => d.daireBilgileri.kat === parseInt(secilenKat)
        );

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              🏠 {blokHarfi} Blok - Daire Detayları
            </h2>
            <p className="text-gray-600">
              {daireVerileri.blokOzeti.toplamDaireSayisi} Daire • Toplam Aidat:
              ₺{daireVerileri.blokOzeti.toplamAidat.toLocaleString("tr-TR")}
            </p>
          </div>

          {/* Kat Filtresi */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-gray-700">Kat:</label>
            <select
              value={secilenKat}
              onChange={(e) => setSecilenKat(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="tumkatlarda">Tüm Katlar</option>
              {katlar.map((kat) => (
                <option key={kat} value={kat}>
                  {kat === 0 ? "Zemin Kat" : `${kat}. Kat`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Özet Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-blue-50 rounded-lg p-3 text-center">
            <div className="text-sm text-blue-600">Toplam Daire</div>
            <div className="text-lg font-bold text-blue-900">
              {daireVerileri.blokOzeti.toplamDaireSayisi}
            </div>
          </div>
          <div className="bg-green-50 rounded-lg p-3 text-center">
            <div className="text-sm text-green-600">Ortalama Aidat</div>
            <div className="text-lg font-bold text-green-900">
              ₺{daireVerileri.blokOzeti.ortalamaDaireAidati.toFixed(0)}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 text-center">
            <div className="text-sm text-purple-600">Zemin Kat</div>
            <div className="text-lg font-bold text-purple-900">
              {daireVerileri.blokOzeti.zeminKatDaireSayisi}
            </div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 text-center">
            <div className="text-sm text-orange-600">Üst Katlar</div>
            <div className="text-lg font-bold text-orange-900">
              {daireVerileri.blokOzeti.ustKatDaireSayisi}
            </div>
          </div>
        </div>
      </div>

      {/* Tablo */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daire
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Asansör
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doğalgaz
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personel Maaşı
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Yönetim
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Diğer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <strong>Toplam</strong>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtrelenmisVeriler.map((daireData, index) => {
              const { daireBilgileri, aidatDetayi } = daireData;
              const digerGiderler =
                aidatDetayi.elektrikPayi +
                aidatDetayi.suPayi +
                aidatDetayi.ekGiderPayi;
              const personelGiderleri =
                aidatDetayi.guvenlikPayi + aidatDetayi.gorevliPayi;
              return (
                <tr
                  key={daireBilgileri.globalDaireId}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center justify-center h-8 w-12 rounded-full text-sm font-medium
                          ${
                            daireBilgileri.kat === 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {daireBilgileri.daireTamAdi}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">
                          {daireBilgileri.daireTamAdi}
                        </div>
                        <div className="text-sm text-gray-500">
                          {daireBilgileri.daireTipi} •{" "}
                          {daireBilgileri.metrekare}m²
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${
                        daireBilgileri.kat === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {daireBilgileri.katAdi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {daireBilgileri.asansorKullanimi ? (
                      <span className="text-green-600 font-medium">
                        ₺{aidatDetayi.asansorPayi.toLocaleString("tr-TR")}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₺{aidatDetayi.dogazPayi.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{personelGiderleri.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{aidatDetayi.yonetimPayi.toLocaleString("tr-TR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₺{digerGiderler.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    <span className="text-lg text-blue-600">
                      ₺{aidatDetayi.toplamAidat.toLocaleString("tr-TR")}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer - Toplam Özeti */}
      <div className="p-6 bg-gray-50 border-t">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="text-sm text-gray-600">
            Gösterilen: {filtrelenmisVeriler.length} daire
            {secilenKat !== "tumkatlarda" &&
              ` (${secilenKat === "0" ? "Zemin Kat" : `${secilenKat}. Kat`})`}
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">
              Seçilen Dairelerin Toplam Aidatı:
            </div>
            <div className="text-xl font-bold text-blue-600">
              ₺
              {filtrelenmisVeriler
                .reduce((toplam, d) => toplam + d.aidatDetayi.toplamAidat, 0)
                .toLocaleString("tr-TR")}
            </div>
          </div>
        </div>

        {/* Yenileme butonu */}
        <div className="mt-4 text-center">
          <button
            onClick={hesaplaDaireAidatlari}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
          >
            🔄 Verileri Yenile
          </button>
        </div>
      </div>
    </div>
  );
}
