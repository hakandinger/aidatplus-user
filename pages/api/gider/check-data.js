// /api/gider/check-data.js
import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  try {
    const { period, blokHarfi } = req.query;

    if (!period) {
      return res
        .status(400)
        .json({ success: false, message: "Period gerekli" });
    }

    const db = await getDb();
    const giderCollection = db.collection("daire_detay_aidat_cache");

    const filter = {};
    if (blokHarfi) filter.blokHarfi = blokHarfi;
    if (period) filter.period = period;

    const giderInfo = await giderCollection.findOne(filter, {
      projection: { _id: 1, giderDetayTablosu: 1 },
    });

    const hasData = !!(
      giderInfo &&
      giderInfo.giderDetayTablosu &&
      giderInfo.giderDetayTablosu.length > 0
    );

    res.status(200).json({
      success: true,
      hasData,
      message: hasData ? "Veri mevcut" : "Veri bulunamadı",

      debug: {
        filter,
        foundRecord: !!giderInfo,
        recordCount: giderInfo?.giderDetayTablosu?.length || 0,
      },
    });
  } catch (error) {
    console.error("Gider data check error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
