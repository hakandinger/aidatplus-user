// pages/api/register-user.js
import { getDb } from "../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const { phone, apartmentNumber, buildingNumber } = req.body;

    if (!phone || !apartmentNumber || !buildingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tüm alanlar zorunludur (telefon, blok ve daire numarası)",
      });
    }

    const cleanPhone = phone.replace(/\s+/g, "").replace(/\D/g, "");

    const phoneRegex = /^(5\d{9}|0?5\d{9})$/;

    if (!phoneRegex.test(cleanPhone)) {
      return res.status(400).json({
        success: false,
        message:
          "Geçerli bir cep telefonu numarası giriniz (örn: 0555 123 45 67)",
      });
    }

    const standardPhone = cleanPhone.startsWith("0")
      ? cleanPhone.slice(1)
      : cleanPhone;

    const ipAddress =
      req.headers["x-forwarded-for"] ||
      req.headers["x-real-ip"] ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      (req.connection.socket ? req.connection.socket.remoteAddress : null);

    const userAgent = req.headers["user-agent"] || "Unknown";

    const userData = {
      phone: standardPhone,
      apartmentNumber: apartmentNumber.toString().trim(),
      buildingNumber: buildingNumber.toString().toUpperCase().trim(),
      registrationSource: "website_modal",
      ipAddress: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
      userAgent,
      registeredAt: new Date(),
    };

    const db = await getDb();
    const collection = db.collection("users");

    const result = await collection.insertOne(userData);

    if (result.acknowledged && result.insertedId) {
      return res.status(201).json({
        success: true,
        message: "Kayıt başarıyla tamamlandı!",
        userId: result.insertedId,
      });
    } else {
      throw new Error("Insert işlemi başarısız");
    }
  } catch (error) {
    console.error("❌ Registration API error:", error);

    return res.status(500).json({
      success: false,
      message: "Sunucu hatası. Lütfen bir kaç dakika sonra tekrar deneyin.",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
}
