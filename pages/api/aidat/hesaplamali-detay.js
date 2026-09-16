import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Sadece POST metodu kabul edilir",
    });
  }

  try {
    const { blokHarfi, period } = req.body;

    if (!blokHarfi || !period) {
      return res.status(400).json({
        success: false,
        message: "Blok harfi ve period gereklidir",
      });
    }

    const db = await getDb();

    const collection = db.collection("aidat_hesaplari");

    // ------------------------------------------------
    // Bloktaki 5. daireyi bul
    // daireNo küçükten büyüğe sıralanır
    // ------------------------------------------------

    const kayitlar = await collection
      .find({
        period,
        blokHarfi: blokHarfi.toUpperCase(),
      })
      .sort({ daireNo: 1 })
      .skip(4)
      .limit(1)
      .toArray();

    if (kayitlar.length === 0) {
      return res.status(404).json({
        success: false,
        message: `${period} - ${blokHarfi} blok için 5. daire kaydı bulunamadı`,
      });
    }

    const kayit = kayitlar[0];

    // ------------------------------------------------
    // API cevabı
    // ------------------------------------------------

    const data = {
      id: kayit._id.toString(),

      period: kayit.period,

      blokHarfi: kayit.blokHarfi,

      daireNo: kayit.daireNo,

      globalDaireId: kayit.globalDaireId,

      metrekare: kayit.metrekare,

      hesaplananAidat: kayit.hesaplananAidat,

      hesaplamaDetay: kayit.hesaplamaDetay || {},
      
      createdAt: kayit.createdAt,
    };

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    console.error("Aidat detay API hatası:", error);

    return res.status(500).json({
      success: false,
      message: "Aidat bilgileri alınırken hata oluştu",
    });
  }
}