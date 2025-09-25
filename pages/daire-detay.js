// pages/daire-detay.js
import { useState } from "react";
import Link from "next/link";
import DaireDetayTablosu from "../components/DaireDetayTablosu";
import { GiderDetayExportButton } from "@/components/ExcelExportButton";

export default function DaireDetaySayfasi() {
  const [selectedBlok, setSelectedBlok] = useState("A");
  const [period, setPeriod] = useState(getCurrentPeriod());

  function getCurrentPeriod() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  }

  const bloklar = [
    {
      harf: "A",
      ad: "A Bloku",
      tip: "3+1",
      kazan: 1,
      renk: "bg-blue-100 text-blue-800",
    },
    {
      harf: "B",
      ad: "B Bloku",
      tip: "3+1",
      kazan: 1,
      renk: "bg-blue-100 text-blue-800",
    },
    {
      harf: "C",
      ad: "C Bloku",
      tip: "2+1 Büyük",
      kazan: 1,
      renk: "bg-blue-100 text-blue-800",
    },
    {
      harf: "D",
      ad: "D Bloku",
      tip: "2+1",
      kazan: 2,
      renk: "bg-green-100 text-green-800",
    },
    {
      harf: "E",
      ad: "E Bloku",
      tip: "2+1",
      kazan: 2,
      renk: "bg-green-100 text-green-800",
    },
    {
      harf: "F",
      ad: "F Bloku",
      tip: "2+1",
      kazan: 2,
      renk: "bg-green-100 text-green-800",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🏠 Daire Bazlı Aidat Detayları
              </h1>
              <p className="text-gray-600">
                Her dairenin ayrı ayrı aidat hesaplamalarını görüntüleyin
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Dashboard
              </Link>
              <Link
                href="/gider"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                💰 Gider Girişi
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kontrol Paneli */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blok Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                🏗️ Blok Seçimi
              </label>
              <div className="grid grid-cols-2 gap-2">
                {bloklar.map((blok) => (
                  <button
                    key={blok.harf}
                    onClick={() => setSelectedBlok(blok.harf)}
                    className={`
                      p-3 rounded-lg border-2 text-left transition-all
                      ${
                        selectedBlok === blok.harf
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }
                    `}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-gray-900">
                        {blok.harf}
                      </span>
                      {selectedBlok === blok.harf && (
                        <span className="text-blue-500">✓</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{blok.tip}</div>
                    <div
                      className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${blok.renk}`}
                    >
                      Kazan {blok.kazan}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Period Seçimi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                📅 Period Seçimi
              </label>
              <input
                type="month"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />

              {/* Hızlı Period Seçenekleri */}
              <div className="mt-3 flex flex-wrap gap-2">
                {["2024-01", "2024-02", "2024-03"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`
                      px-3 py-1 text-xs rounded-lg border
                      ${
                        period === p
                          ? "bg-blue-600 text-white border-blue-600"
                          : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
              <GiderDetayExportButton
                blokHarfi={selectedBlok}
                period={period}
              />
            </div>
          </div>

          {/* Seçim Özeti */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Seçilen:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {selectedBlok} Bloku • {period}
                </span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Hesaplama Detayı</div>
                <div className="text-sm font-medium text-gray-700">
                  Daire bazlı aidat dağılımı
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Daire Detay Tablosu */}
        <DaireDetayTablosu blokHarfi={selectedBlok} period={period} />

        {/* Bilgilendirme */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-medium text-blue-900 mb-3">
            💡 Önemli Bilgiler:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
            <div>
              <h4 className="font-medium mb-2">Asansör Payı:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Zemin kat daireleri asansör payı ödemez</li>
                <li>• Üst kat daireleri blok asansör giderini paylaşır</li>
                <li>• Her blokun asansör gideri ayrı hesaplanır</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Doğalgaz Payı:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Kazan 1: A, B, C blokları (petek ölçüsüne göre)</li>
                <li>• Kazan 2: D, E, F blokları (eşit pay)</li>
                <li>• A, B blokları: 450cm petek</li>
                <li>• C, D, E, F blokları: 260cm petek</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
