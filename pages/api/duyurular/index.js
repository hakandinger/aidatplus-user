import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Sadece GET metodu kabul edilir",
    });
  }

  try {
    const db = await getDb();

    const bugun = new Date();

    const duyurular = await db
      .collection("duyurular")
      .find({
        yayinDurumu: true,

        $and: [
          {
            $or: [
              { yayinTarihi: { $exists: false } },
              { yayinTarihi: { $lte: bugun } },
            ],
          },
          {
            $or: [
              { bitisTarihi: { $exists: false } },
              { bitisTarihi: null },
              { bitisTarihi: { $gte: bugun } },
            ],
          },
        ],
      })
      .sort({
        oncelik: -1,
        yayinTarihi: -1,
        createdAt: -1,
      })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Duyurular başarıyla alındı",
      data: duyurular,
    });
  } catch (error) {
    console.error("Duyurular API hatası:", error);

    return res.status(500).json({
      success: false,
      message: "Duyurular alınırken hata oluştu",
      error: error.message,
    });
  }
}