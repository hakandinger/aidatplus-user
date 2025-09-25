// components/ExcelExportButton.js
import { useState } from "react";

export default function ExcelExportButton({
  raporTuru,
  blokHarfi = null,
  period = null,
  buttonText = "📊 Excel'e Aktar",
  className = "",
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getCurrentPeriod = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
  };

  const handleExport = async () => {
    setLoading(true);
    setError("");

    try {
      const requestData = {
        raporTuru,
        period: period || getCurrentPeriod(),
      };

      if (blokHarfi) {
        requestData.blokHarfi = blokHarfi;
      }

      const response = await fetch("/api/rapor/excel-export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();

      if (result.success) {
        // CSV içeriğini dosya olarak indir
        downloadCSV(result.data.csvContent, result.data.raporBaslik);
      } else {
        setError(result.message || "Excel raporu oluşturulamadı");
      }
    } catch (err) {
      console.error("Excel export hatası:", err);
      setError("Excel raporu oluşturulurken hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = (csvContent, filename) => {
    // BOM (Byte Order Mark) ekle - Türkçe karakterler için
    const BOM = "\uFEFF";
    const csvWithBOM = BOM + csvContent;

    const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={loading}
        className={`
          inline-flex items-center px-4 py-2 border border-green-300 rounded-lg text-sm font-medium
          transition-colors duration-200
          ${
            loading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-green-50 text-green-700 hover:bg-green-100 hover:text-green-800 focus:ring-2 focus:ring-green-500"
          }
          ${className}
        `}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Hazırlanıyor...
          </>
        ) : (
          buttonText
        )}
      </button>

      {error && (
        <div className="absolute top-full left-0 mt-2 w-64 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 z-10">
          {error}
        </div>
      )}
    </div>
  );
}

// Önceden tanımlanmış export butonları
export function DaireDetayExportButton({ blokHarfi, period }) {
  return (
    <ExcelExportButton
      raporTuru="daire_detay"
      blokHarfi={blokHarfi}
      period={period}
      buttonText={`📊 ${blokHarfi} Bloku Excel`}
    />
  );
}

export function BlokOzetiExportButton({ period }) {
  return (
    <ExcelExportButton
      raporTuru="blok_ozeti"
      period={period}
      buttonText="📊 Blok Özeti Excel"
    />
  );
}

export function GiderDetayExportButton({ blokHarfi, period }) {
  return (
    <ExcelExportButton
      raporTuru="gider_detay"
      blokHarfi={blokHarfi}
      period={period}
      buttonText={`📊 ${blokHarfi} Blok  Gider Detayı Excel`}
    />
  );
}
