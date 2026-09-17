// pages/api/kompleks/blok-gider-ozeti.js

import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Sadece GET metodu kabul edilir",
    });
  }

  try {
    const { blokHarfi, period } = req.query;

    if (!blokHarfi || !period) {
      return res.status(400).json({
        success: false,
        message: "blokHarfi ve period parametreleri zorunludur",
      });
    }

    const blokKodu = blokHarfi.toUpperCase();

    const db = await getDb();

    // --------------------------------------------------
    // 1. BLOK BİLGİSİ
    // --------------------------------------------------

    const blok = await db.collection("kompleks_yapisi").findOne({
      blokHarfi: blokKodu,
    });

    if (!blok) {
      return res.status(404).json({
        success: false,
        message: `${blokKodu} bloğu bulunamadı`,
      });
    }

    // --------------------------------------------------
    // 2. BLOKTAKİ HESAPLAMA KAYITLARI
    // --------------------------------------------------
    // aidat_hesaplari içerisinde aynı blok + period
    // için birden fazla daire kaydı bulunur.
    //
    // Her dairenin hesaplamaDetay alanı aynı giderlerin
    // dağıtım sonuçlarını içerir.
    //
    // İlk kaydı referans olarak kullanıyoruz.
    // --------------------------------------------------

    const aidatKaydi = await db
      .collection("aidat_hesaplari")
      .findOne({
        blokHarfi: blokKodu,
        period,
      });

    if (!aidatKaydi) {
      return res.status(404).json({
        success: false,
        message: `${blokKodu} bloğu için ${period} dönemine ait aidat hesaplama kaydı bulunamadı`,
      });
    }

    const detay = aidatKaydi.hesaplamaDetay || {};

    const giderler = [];

    // --------------------------------------------------
    // YARDIMCI FONKSİYON
    // --------------------------------------------------

    const ekleGider = ({
      key,
      detayData,
      kategori,
      paylamaYontemi,
      dairePayiLabel,
    }) => {
      if (!detayData) return;

      const toplam = Number(detayData.toplam || 0);
      const dairePayi = Number(detayData.dairePayi || 0);

      // Gider 0 ise public listede göstermiyoruz.
      if (toplam <= 0) return;

      giderler.push({
        key,
        giderTuru: detayData.giderTuru || key,
        tutar: toplam,
        daireBasiPay: dairePayi,
        paylamaYontemi:
          detayData.payTipi || paylamaYontemi || "Eşit Pay",
        dairePayiLabel:
          dairePayiLabel || "Daire başı pay",
        kategori,
        aciklama: detayData.aciklama || "",
      });
    };

    // --------------------------------------------------
    // 3. ORTAK KOMPLEKS GİDERLERİ
    // --------------------------------------------------

    ekleGider({
      key: "guvenlik",
      detayData: detay.guvenlikPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    ekleGider({
      key: "gorevli",
      detayData: detay.gorevliPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    ekleGider({
      key: "elektrik",
      detayData: detay.elektrikPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    ekleGider({
      key: "su",
      detayData: detay.suPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    ekleGider({
      key: "yonetim",
      detayData: detay.yonetimPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    // --------------------------------------------------
    // 4. BLOK / KAZAN GİDERİ
    // --------------------------------------------------

    ekleGider({
      key: "dogalgaz",
      detayData: detay.dogazPayi,
      kategori: "blok",
      dairePayiLabel:
        detay.dogazPayi?.payTipi === "Petek Ölçüsü"
          ? "Bu daire için hesaplanan pay"
          : "Daire başı pay",
    });

    // --------------------------------------------------
    // 5. KAPICI DAİRELERİ DOĞALGAZ
    // --------------------------------------------------
    // Bu gider tüm dairelere eşit dağıtılıyor.
    // Bu nedenle ortak giderler altında gösteriyoruz.
    // --------------------------------------------------

    ekleGider({
      key: "kapiciDogaz",
      detayData: detay.kapiciDogazPayi,
      kategori: "ortak",
      paylamaYontemi: "Eşit Pay",
      dairePayiLabel: "Daire başı pay",
    });

    // --------------------------------------------------
    // 6. ASANSÖR
    // --------------------------------------------------

    ekleGider({
      key: "asansor",
      detayData: detay.asansorPayi,
      kategori: "asansor",
      paylamaYontemi: "Kullanan Daire",
      dairePayiLabel: "Kullanan daire başı",
    });

    // --------------------------------------------------
    // 7. EK GİDERLER
    // --------------------------------------------------

    if (Array.isArray(detay.ekGiderler)) {
      detay.ekGiderler.forEach((ekGider, index) => {
        const toplam = Number(ekGider.toplam || 0);
        const dairePayi = Number(ekGider.dairePayi || 0);

        if (toplam <= 0) return;

        giderler.push({
          key: `ek-gider-${index}`,
          giderTuru: ekGider.giderTuru || "Ek Gider",
          tutar: toplam,
          daireBasiPay: dairePayi,
          paylamaYontemi:
            ekGider.payTipi || "Eşit Pay",
          dairePayiLabel: "Daire başı pay",
          kategori: "ek-gider",
          aciklama: ekGider.aciklama || "",
        });
      });
    }

    // --------------------------------------------------
    // 8. KATEGORİLERE AYIR
    // --------------------------------------------------

    const ortakGiderler = giderler.filter(
      (gider) => gider.kategori === "ortak"
    );

    const blokGiderler = giderler.filter(
      (gider) => gider.kategori === "blok"
    );

    const asansorGiderler = giderler.filter(
      (gider) => gider.kategori === "asansor"
    );

    const ekGiderler = giderler.filter(
      (gider) => gider.kategori === "ek-gider"
    );

    // --------------------------------------------------
    // 9. TOPLAM GİDER
    // --------------------------------------------------

    const toplamGider = giderler.reduce(
      (toplam, gider) => toplam + gider.tutar,
      0
    );

    // --------------------------------------------------
    // 10. RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message: "Blok gider bilgileri başarıyla alındı",

      data: {
        period,

        blok: {
          blokHarfi: blok.blokHarfi,
          blokNo: blok.blokNo,
          daireTipi: blok.daireTipi,
          metrekare: blok.metrekare,
          zeminKatDaireSayisi:
            blok.zeminKatDaireSayisi,
          normalKatDaireSayisi:
            blok.normalKatDaireSayisi,
          toplamDaireSayisi:
            blok.toplamDaireSayisi,
          asansorKullananDaireSayisi:
            blok.asansorKullananDaireSayisi,
          petekOlcusu: blok.petekOlcusu,
          kazanGrubu: blok.kazanGrubu,
        },

        giderler,

        kategoriler: {
          ortak: ortakGiderler,
          blok: blokGiderler,
          asansor: asansorGiderler,
          ekGiderler: ekGiderler,
        },

        toplamGider,

        hesaplamaBilgisi: {
          kaynak: "aidat_hesaplari.hesaplamaDetay",
          aciklama:
            "Gider tutarları ve daire payları mevcut aidat hesaplama sonuçlarından alınmıştır.",
        },
      },
    });
  } catch (error) {
    console.error(
      "Blok gider özeti hatası:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Blok gider bilgileri alınırken hata oluştu",
      error: error.message,
    });
  }
}