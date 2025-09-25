import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Sadece GET metodu kabul edilir" });
  }

  try {
    const db = await getDb();

    // koleksiyon alınıyor
    const aciklamaCollection = db.collection("aciklama_yapisi");

    // veriler çekiliyor
    const aciklamaInfo = await aciklamaCollection.find({}).toArray();

    if (!aciklamaInfo || aciklamaInfo.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Açıklama bilgisi bulunamadı",
      });
    }

    // başarılı yanıt
    return res.status(200).json({
      success: true,
      message: "Açıklama hazırlandı",
      data: aciklamaInfo,
    });
  } catch (error) {
    console.error("Açıklama hazırlama hatası:", error);
    return res.status(500).json({
      success: false,
      message: "Açıklama hazırlanırken hata oluştu",
      error: error.message,
    });
  }
}
