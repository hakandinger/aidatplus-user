// pages/api/kompleks/blok-listesi.js
import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Sadece GET metodu kabul edilir" });
  }

  try {
    const db = await getDb();
    const collection = db.collection("kompleks_yapisi");

    // Tüm blokları al
    const bloklar = await collection.find({}).sort({ blokNo: 1 }).toArray();

    if (bloklar.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Kompleks yapısı bulunamadı. Önce setup yapın.",
      });
    }

    // Özet istatistikleri hesapla
    const toplamDaire = bloklar.reduce(
      (sum, blok) => sum + blok.toplamDaireSayisi,
      0
    );
    const toplamAsansorKullanan = bloklar.reduce(
      (sum, blok) => sum + blok.asansorKullananDaireSayisi,
      0
    );
    const toplamMetrekare = bloklar.reduce(
      (sum, blok) => sum + blok.metrekare * blok.toplamDaireSayisi,
      0
    );

    // Kazan grupları
    const kazan1Bloklar = bloklar.filter((b) => b.kazanGrubu === 1);
    const kazan2Bloklar = bloklar.filter((b) => b.kazanGrubu === 2);

    res.status(200).json({
      success: true,
      message: "Kompleks yapısı başarıyla alındı",
      bloklar: bloklar,
      istatistikler: {
        toplamBlokSayisi: bloklar.length,
        toplamDaireSayisi: toplamDaire,
        toplamAsansorKullanan: toplamAsansorKullanan,
        zeminKatDaireSayisi: toplamDaire - toplamAsansorKullanan,
        toplamMetrekare: toplamMetrekare,
        ortalamaDaireMetrekaresi: Math.round(toplamMetrekare / toplamDaire),
        kazanSistemi: {
          kazan1: {
            blokSayisi: kazan1Bloklar.length,
            bloklar: kazan1Bloklar.map((b) => b.blokHarfi),
            toplamDaire: kazan1Bloklar.reduce(
              (sum, b) => sum + b.toplamDaireSayisi,
              0
            ),
          },
          kazan2: {
            blokSayisi: kazan2Bloklar.length,
            bloklar: kazan2Bloklar.map((b) => b.blokHarfi),
            toplamDaire: kazan2Bloklar.reduce(
              (sum, b) => sum + b.toplamDaireSayisi,
              0
            ),
          },
        },
      },
    });
  } catch (error) {
    console.error("Blok listesi alma hatası:", error);
    res.status(500).json({
      success: false,
      message: "Blok listesi alınırken hata oluştu",
      error: error.message,
    });
  }
}
