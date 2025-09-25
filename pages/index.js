// pages/index.js
import { useState, useEffect } from "react";
import Link from "next/link";
import BlokSelector from "../components/BlokSelector";
import BlokOzetKarti from "../components/BlokOzetKarti";
import GenelAciklamalarContainer from "@/components/GenelAciklamaContainer";

export default function Dashboard() {
  const [selectedBlok, setSelectedBlok] = useState("A");
  const [kompleksData, setKompleksData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Kompleks yapısını yükle
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
                🏢 Zanamilanocity Apartman Yönetim Sistemi
              </h1>
              <p className="text-gray-600">
                178 Daire • 6 Blok • 2 Kazan Sistemi
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/daire-detay"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 transition-colors text-sm font-medium"
              >
                🏠 Daire Detayları
              </Link>
              <div className="text-right">
                <p className="text-sm text-gray-500">Aktif Blok</p>
                <p className="text-lg font-semibold text-blue-600">
                  {selectedBlok} Blok
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Blok Seçici */}
        <div className="mb-8">
          <BlokSelector
            selectedBlok={selectedBlok}
            onBlokChange={setSelectedBlok}
            kompleksData={kompleksData}
          />
        </div>

        {/* Dashboard Cards */}
        <div className=" gap-6 mb-8 ">
          <BlokOzetKarti blokHarfi={selectedBlok} kompleksData={kompleksData} />
        </div>

        <GenelAciklamalarContainer />
      </div>
    </div>
  );
}
