// pages/api/rapor/excel-export.js
import { getDb } from "../../../lib/mongodb";
import { baseUrl } from "@/lib/config";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Sadece POST metodu kabul edilir" });
  }

  try {
    const { raporTuru, blokHarfi, period } = req.body;

    if (!raporTuru || !period) {
      return res.status(400).json({
        success: false,
        message: "Rapor türü ve period gereklidir",
      });
    }

    const db = await getDb();

    let excelData = [];
    let raporBaslik = "";
    let genelAciklamalar = [];

    switch (raporTuru) {
      case "daire_detay":
        const result = await generateDaireDetayExcel(db, blokHarfi, period);
        excelData = result.data;
        raporBaslik = result.baslik;
        break;

      case "blok_ozeti":
        const blokResult = await generateBlokOzetiExcel(db, period);
        excelData = blokResult.data;
        raporBaslik = blokResult.baslik;
        break;

      case "gider_detay":
        const giderResult = await generateGiderDetayExcel(
          db,
          period,
          blokHarfi
        );
        excelData = giderResult.data;
        raporBaslik = giderResult.baslik;
        genelAciklamalar = giderResult.genelAciklamalar;
        break;

      default:
        return res.status(400).json({
          success: false,
          message: "Geçersiz rapor türü",
        });
    }

    const csvContent = convertToCSV(excelData, genelAciklamalar);

    res.status(200).json({
      success: true,
      message: "Excel raporu hazırlandı",
      data: {
        raporTuru,
        blokHarfi: blokHarfi || "Tüm Bloklar",
        period,
        raporBaslik,
        csvContent,
        kayitSayisi: excelData.length,
        olusturmaTarihi: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Excel export hatası:", error);
    res.status(500).json({
      success: false,
      message: "Excel raporu oluşturulurken hata oluştu",
      error: error.message,
    });
  }
}

async function generateDaireDetayExcel(db, blokHarfi, period) {
  const response = await fetch(`${baseUrl}/api/aidat/daire-hesapla`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ blokHarfi, period }),
  });

  if (!response.ok) {
    throw new Error("Daire aidatları hesaplanamadı");
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message);
  }

  const excelData = result.data.daireAidatlari.map((daire) => ({
    Daire: daire.daireBilgileri.daireTamAdi,
    Blok: daire.daireBilgileri.blokHarfi,
    Kat: daire.daireBilgileri.katAdi,
    "Daire Tipi": daire.daireBilgileri.daireTipi,
    Metrekare: daire.daireBilgileri.metrekare,
    "Asansör Payı (₺)": daire.aidatDetayi.asansorPayi,
    "Doğalgaz Payı (₺)": daire.aidatDetayi.dogazPayi,
    "Güvenlik Payı (₺)": daire.aidatDetayi.guvenlikPayi,
    "Temizlik Payı (₺)": daire.aidatDetayi.temizlikPayi,
    "Elektrik Payı (₺)": daire.aidatDetayi.elektrikPayi,
    "Su Payı (₺)": daire.aidatDetayi.suPayi,
    "Masraf Payı (₺)": daire.aidatDetayi.masrafPayi,
    "TOPLAM AİDAT (₺)": daire.aidatDetayi.toplamAidat,
    "Kazan Grubu": daire.daireBilgileri.kazanGrubu,
    Period: period,
  }));

  return {
    data: excelData,
    baslik: `${blokHarfi} Bloğu Daire Detay Raporu - ${period}`,
  };
}

async function generateBlokOzetiExcel(db, period) {
  const kompleksCollection = db.collection("kompleks_yapisi");
  const bloklar = await kompleksCollection
    .find({})
    .sort({ blokNo: 1 })
    .toArray();

  const excelData = [];

  for (const blok of bloklar) {
    const response = await fetch(`${baseUrl}/api/aidat/hesapla`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ blokHarfi: blok.blokHarfi, period }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.success) {
        const blokToplamAidat =
          result.data.aidatDetayi.toplamAidat * blok.toplamDaireSayisi;

        excelData.push({
          Blok: blok.blokHarfi,
          "Daire Tipi": blok.daireTipi,
          "Toplam Daire": blok.toplamDaireSayisi,
          "Asansör Kullanan": blok.asansorKullananDaireSayisi,
          "Zemin Kat Daire": blok.zeminKatDaireSayisi,
          Metrekare: blok.metrekare,
          "Kazan Grubu": blok.kazanGrubu,
          "Daire Başı Aidat (₺)": result.data.aidatDetayi.toplamAidat,
          "Blok Toplam Aidat (₺)": blokToplamAidat,
          Period: period,
        });
      }
    }
  }

  return {
    data: excelData,
    baslik: `Tüm Bloklar Özet Raporu - ${period}`,
  };
}

async function generateGiderDetayExcel(db, period, blokHarfi) {
  const giderCollection = db.collection("daire_detay_aidat_cache");
  const filter = {};
  if (blokHarfi) filter.blokHarfi = blokHarfi;
  if (period) filter.period = period;

  const giderInfo = await giderCollection.findOne(filter);

  if (!giderInfo) {
    throw new Error(
      `${period} Dönemi ${
        blokHarfi || "Tüm Bloklar"
      } için gider bilgisi bulunamadı`
    );
  }

  const excelData = giderInfo.giderDetayTablosu.map((gider) => ({
    "Gider Türü": gider.giderTuru,
    Açıklama: gider.aciklama || "",
    "Tutar (₺)": gider.toplamTutar || 0,
    "Daire Payı (₺)": (gider.dairePayi || 0).toFixed(2),
    "Aidat Dönemi": period,
  }));

  let aciklamaRows = [];
  try {
    const response = await fetch(`${baseUrl}/api/aciklama/genel-aciklama`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();

      if (result.success && Array.isArray(result.data)) {
        aciklamaRows = result.data.map((item) => ({
          baslik: item.baslik || "",
          aciklama: item.aciklama || "",
          oncelik: item.oncelik || "",
          tarih: item.tarih
            ? new Date(item.tarih).toLocaleDateString("tr-TR")
            : "",
        }));
      }
    } else {
      console.warn("Genel açıklama API hatası:", response.status);
    }
  } catch (error) {
    console.error("Genel açıklama fetch hatası:", error);
  }

  return {
    data: excelData,
    baslik: `${period} Dönemi ${blokHarfi || "Tüm Bloklar"} Gider Detay Raporu`,
    genelAciklamalar: aciklamaRows,
  };
}

function convertToCSV(data, genelAciklamalar) {
  if (!data || data.length === 0) {
    return "";
  }

  const headers = Object.keys(data[0]);
  const csvHeaders = headers.join(",");

  const csvRows = data.map((row) =>
    headers
      .map((header) => {
        const value = row[header];
        if (
          typeof value === "string" &&
          (value.includes(",") || value.includes("\n") || value.includes('"'))
        ) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      })
      .join(",")
  );

  let csvContent = [csvHeaders, ...csvRows].join("\n");

  if (genelAciklamalar && genelAciklamalar.length > 0) {
    csvContent += "\n\n";
    csvContent += "\n\n";
    csvContent += `"",Açıklama,""\n`; // tek kolon

    const aciklamaCsvRows = genelAciklamalar.map((row) => {
      let text = row.aciklama || "";
      // Eğer metin içinde virgül, yeni satır veya tırnak varsa güvenli şekilde ekle
      if (text.includes(",") || text.includes('"') || text.includes("\n")) {
        text = `"${text.replace(/"/g, '""')}"`;
      }
      return ["", text, "", ""].join(",");
    });

    csvContent += aciklamaCsvRows.join("\n");
  }

  return csvContent;
}
