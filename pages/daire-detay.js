// pages/daire-detay.js
import { useState, useEffect } from "react";
import Link from "next/link";
import DaireDetayTablosu from "../components/DaireDetayTablosu";
import { GiderDetayExportButton } from "@/components/ExcelExportButton";
import { getCurrentPeriod } from "../utils/dateUtils";
import BlokSelector from "../components/BlokSelector";

export default function DaireDetaySayfasi() {
  const [selectedBlok, setSelectedBlok] = useState("A");
  const [kompleksData, setKompleksData] = useState(null);
  const [period, setPeriod] = useState(getCurrentPeriod());
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("/api/kompleks/blok-listesi")
      .then((res) => res.json())
      .then((data) => {
        setKompleksData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Veri yükleme hatası:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Apartman verileri yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Kontrol Paneli */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="grid  gap-6">
            {/* Blok Seçimi */}
            <div className="mb-8">
              <BlokSelector
                selectedBlok={selectedBlok}
                onBlokChange={setSelectedBlok}
                kompleksData={kompleksData}
              />
            </div>

            {/* Period Seçimi */}
            <div className="space-y-3">
              {/* Period Seçim Başlığı ve Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 Period Seçimi
                </label>
                <div className="space-y-2">
                  <input
                    type="month"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="block w-full px-3 py-2 text-black border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />

                  {/* Hızlı Seçim Butonları */}
                  <div className="flex flex-wrap gap-2 justify-end">
                    {["2025-09", "2025-08", "2025-07"].map((p) => (
                      <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        className={`
              px-2 py-1 text-xs rounded border transition-colors
              ${
                period === p
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-600 border-gray-300 hover:bg-gray-100"
              }
            `}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <GiderDetayExportButton
                  blokHarfi={selectedBlok}
                  period={period}
                  className="w-auto"
                />
              </div>
            </div>
          </div>

          {/* Seçim Özeti */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-sm text-gray-600">Seçilen:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {selectedBlok} Blok • {period}
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
                <li>• Her bloğun asansör gideri ayrı hesaplanır</li>
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
