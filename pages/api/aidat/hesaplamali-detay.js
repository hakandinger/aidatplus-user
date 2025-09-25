import { getDb } from "../../../lib/mongodb";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Sadece POST metodu kabul edilir" });
  }
  try {
    const { blokHarfi, period, daireNo = null } = req.body;

    if (!blokHarfi || !period) {
      return res.status(400).json({
        success: false,
        message: "Blok harfi ve period gereklidir",
      });
    }

    const db = await getDb();

    // 1. Gider bilgilerini al
    const giderCollection = db.collection("aylik_giderler");
    const giderInfo = await giderCollection.findOne({ period });
    if (!giderInfo) {
      return res.status(404).json({
        success: false,
        message: `${period} periyodu için gider bilgisi bulunamadı`,
      });
    }

    // 2. Daire listesini al
    const daireCollection = db.collection("daire_listesi");
    const filter = { blokHarfi, aktifMi: true };
    if (daireNo) filter.daireNo = parseInt(daireNo);

    const daireler = await daireCollection
      .find(filter)
      .sort({ kat: 1, daireNo: 1 })
      .toArray();

    if (daireler.length === 0) {
      return res.status(404).json({
        success: false,
        message: `${blokHarfi} blok${
          daireNo ? ` ${daireNo} numaralı daire` : ""
        } bulunamadı`,
      });
    }

    // 3. Tüm dairelerin toplam metrekare hesabı
    const tumDaireCollection = db.collection("daire_listesi");
    const tumDaireler = await tumDaireCollection
      .find({ aktifMi: true })
      .toArray();
    const toplamKompleksMetrekaresi = tumDaireler.reduce(
      (toplam, daire) => toplam + daire.metrekare,
      0
    );

    // 4. Her daire için aidat hesapla
    const daireAidatlari = [];

    for (const daire of daireler) {
      const aidatDetayi = await hesaplaDaireAidati(
        daire,
        giderInfo,
        toplamKompleksMetrekaresi,
        tumDaireler
      );

      daireAidatlari.push({
        daireBilgileri: {
          globalDaireId: daire.globalDaireId,
          daireTamAdi: daire.daireTamAdi,
          blokHarfi: daire.blokHarfi,
          kat: daire.kat,
          katAdi: daire.katAdi,
          daireNo: daire.daireNo,
          daireTipi: daire.daireTipi,
          metrekare: daire.metrekare,
          asansorKullanimi: daire.asansorKullanimi,
          kazanGrubu: daire.kazanGrubu,
        },
        aidatDetayi,
        period,
      });
    }

    const blokOzeti = {
      blokHarfi,
      toplamDaireSayisi: daireler.length,
      toplamAidat: daireAidatlari.reduce(
        (toplam, da) => toplam + da.aidatDetayi.toplamAidat,
        0
      ),
      ortalamaDaireAidati:
        daireAidatlari.reduce(
          (toplam, da) => toplam + da.aidatDetayi.toplamAidat,
          0
        ) / daireler.length,
      zeminKatDaireSayisi: daireler.filter((d) => d.kat === 0).length,
      ustKatDaireSayisi: daireler.filter((d) => d.kat > 0).length,
    };

    const giderDetayTablosu = await olusturGiderDetayTablosu(
      giderInfo,
      blokHarfi,
      toplamKompleksMetrekaresi,
      tumDaireler
    );

    // 6. Cache'e kaydet
    const cacheCollection = db.collection("daire_detay_aidat_cache");
    const cacheKey = `${blokHarfi}_${period}_daire_detay`;

    await cacheCollection.replaceOne(
      { cacheKey },
      {
        cacheKey,
        blokHarfi,
        period,
        hesaplamaTarihi: new Date(),
        daireAidatlari,
        blokOzeti,
        giderDetayTablosu,
      },
      { upsert: true }
    );

    res.status(200).json({
      success: true,
      message: "Daire bazlı aidat hesaplaması tamamlandı",
      data: {
        blokOzeti,
        daireAidatlari,
        giderDetayTablosu,
        toplam: {
          daireSayisi: daireAidatlari.length,
          toplamAidat: blokOzeti.toplamAidat,
          ortalamaDaireAidati: blokOzeti.ortalamaDaireAidati.toFixed(2),
        },
      },
    });
  } catch (error) {
    console.error("Daire aidat hesaplama hatası:", error);
    res.status(500).json({
      success: false,
      message: "Daire aidat hesaplanırken hata oluştu",
      error: error.message,
    });
  }
}
async function olusturGiderDetayTablosu(
  giderInfo,
  blokHarfi,
  toplamMetrekare,
  tumDaireler
) {
  const giderDetayTablosu = [];

  // Örnek bir daire al (hesaplama için)
  const ornekDaire = tumDaireler.find(
    (d) => d.blokHarfi === blokHarfi && d.daireNo === 201
  );

  // 1. Kazan 1 - Doğalgaz
  giderDetayTablosu.push({
    giderTuru: "Kazan 1 Doğalgaz",
    aciklama:
      giderInfo.giderAciklamalari?.kazan1 || "A, B, C blokları doğalgaz gideri",
    toplamTutar: giderInfo.kazan1DogazFaturasi || 0,
    dairePayi:
      ornekDaire?.kazanGrubu === 1
        ? hesaplaDogazPayi(
            giderInfo.kazan1DogazFaturasi,
            ornekDaire,
            tumDaireler,
            1
          )
        : 0,
    payTipi: "Petek Ölçüsü",
    giderTipi: "dogalgaz",
  });

  // 2. Kazan 2 - Doğalgaz
  giderDetayTablosu.push({
    giderTuru: "Kazan 2 Doğalgaz",
    aciklama:
      giderInfo.giderAciklamalari?.kazan2 || "D, E, F blokları doğalgaz gideri",
    toplamTutar: giderInfo.kazan2DogazFaturasi || 0,
    dairePayi:
      ornekDaire?.kazanGrubu === 2
        ? giderInfo.kazan2DogazFaturasi /
          tumDaireler.filter((d) => d.kazanGrubu === 2).length
        : 0,
    payTipi: "Eşit Pay",
    giderTipi: "dogalgaz",
  });

  // 3. Asansör
  const asansorToplam = giderInfo.asansorToplam || 0;

  giderDetayTablosu.push({
    giderTuru: "Asansör",
    aciklama:
      giderInfo.giderAciklamalari?.asansor ||
      "Asansör bakım ve elektrik giderleri",
    toplamTutar: asansorToplam,
    dairePayi: ornekDaire?.asansorKullanimi ? asansorToplam / 168 : 0,
    payTipi: "Kullanan Daire",
    giderTipi: "asansor",
  });

  // 4. Güvenlik
  giderDetayTablosu.push({
    giderTuru: "Güvenlik",
    aciklama:
      giderInfo.giderAciklamalari?.guvenlikPersonelGideri ||
      "Güvenlik personeli ve ekipman giderleri",
    toplamTutar: giderInfo.guvenlikPersonelGideri || 0,
    dairePayi: (giderInfo.guvenlikPersonelGideri || 0) / 178,
    payTipi: "Eşit Pay",
    giderTipi: "sabit",
  });

  // 5. Bina Görevlileri
  giderDetayTablosu.push({
    giderTuru: "Bina Görevlileri",
    aciklama:
      giderInfo.giderAciklamalari?.binagorevliGideri ||
      "Bina Görevlileri Maaşı",
    toplamTutar: giderInfo.binagorevliGideri || 0,
    dairePayi: (giderInfo.binagorevliGideri || 0) / 178,
    payTipi: "Eşit Pay",
    giderTipi: "sabit",
  });

  // 6. Elektrik
  const daireMetrekarePay = ornekDaire
    ? ornekDaire.metrekare / toplamMetrekare
    : 0;
  giderDetayTablosu.push({
    giderTuru: "Elektrik",
    aciklama:
      giderInfo.giderAciklamalari?.elektrik || "Ortak alan elektrik giderleri",
    toplamTutar: giderInfo.elektrikGideri || 0,
    dairePayi: (giderInfo.elektrikGideri || 0) / 178,
    payTipi: "Eşit Pay",
    giderTipi: "sabit",
  });

  // 7. Su
  giderDetayTablosu.push({
    giderTuru: "Su",
    aciklama: giderInfo.giderAciklamalari?.su || "Ortak alan su giderleri",
    toplamTutar: giderInfo.suGideri || 0,
    dairePayi: (giderInfo.suGideri || 0) / 178,
    payTipi: "Eşit Pay",
    giderTipi: "sabit",
  });

  // 8. Yönetim
  giderDetayTablosu.push({
    giderTuru: "Yönetim",
    aciklama:
      giderInfo.giderAciklamalari?.yonetimGideri || "Yönetim Hizmet Bedeli",
    toplamTutar: giderInfo.yonetimGideri || 0,
    dairePayi: (giderInfo.yonetimGideri || 0) / 178,
    payTipi: "Eşit Pay",
    giderTipi: "sabit",
  });

  // 9. Ek Giderler
  if (giderInfo.ekGiderler && giderInfo.ekGiderler.length > 0) {
    giderInfo.ekGiderler.forEach((ekGider) => {
      giderDetayTablosu.push({
        giderTuru: ekGider.ad,
        aciklama: ekGider.aciklama || "",
        toplamTutar: ekGider.tutar || 0,
        dairePayi: (ekGider.tutar || 0) / 178,
        payTipi: "Eşit Pay",
        giderTipi: "ek",
      });
    });
  }

  return giderDetayTablosu;
}

// Yardımcı fonksiyon - Doğalgaz payı hesaplama
function hesaplaDogazPayi(toplamTutar, daire, tumDaireler, kazanGrubu) {
  if (kazanGrubu === 1) {
    const kazan1Daireleri = tumDaireler.filter((d) => d.kazanGrubu === 1);
    const toplamPetekCm = kazan1Daireleri.reduce(
      (toplam, d) => toplam + d.petekOlcusu,
      0
    );
    const daireOrani = daire.petekOlcusu / toplamPetekCm;
    return toplamTutar * daireOrani;
  }
  return 0;
}

async function hesaplaDaireAidati(
  daire,
  giderInfo,
  toplamKompleksMetrekaresi,
  tumDaireler
) {
  const { metrekare, asansorKullanimi, kazanGrubu, petekOlcusu } = daire;
  const toplamDaireSayisi = tumDaireler.length;

  // 1. ASANSÖR PAYI (sadece asansör kullanan daireler)
  const asansorToplam = giderInfo.asansorToplam || 0;
  const kullananDaireSayisi =
    tumDaireler.filter((d) => d.asansorKullanimi).length || 1;
  const asansorPayi = asansorKullanimi
    ? asansorToplam / kullananDaireSayisi
    : 0;

  // 2. DOĞALGAZ PAYI
  let dogazPayi = 0;
  if (kazanGrubu === 1) {
    const kazan1Daireleri = tumDaireler.filter((d) => d.kazanGrubu === 1);
    const toplamPetekCm = kazan1Daireleri.reduce(
      (toplam, d) => toplam + (d.petekOlcusu || 0),
      0
    );
    const daireOrani = toplamPetekCm > 0 ? petekOlcusu / toplamPetekCm : 0;
    dogazPayi = (giderInfo.kazan1DogazFaturasi || 0) * daireOrani;
  } else if (kazanGrubu === 2) {
    const kazan2DaireSayisi =
      tumDaireler.filter((d) => d.kazanGrubu === 2).length || 1;
    dogazPayi = (giderInfo.kazan2DogazFaturasi || 0) / kazan2DaireSayisi;
  }

  // 3. SABİT PAYLAR (aktif daire sayısına eşit)
  const guvenlikPayi =
    (giderInfo.guvenlikPersonelGideri || 0) / toplamDaireSayisi;
  const yonetimPayi = (giderInfo.yonetimGideri || 0) / toplamDaireSayisi;

  const gorevliPayi = (giderInfo.binagorevliGideri || 0) / toplamDaireSayisi;
  const elektrikPayi = (giderInfo.elektrikGideri || 0) / toplamDaireSayisi;
  const suPayi = (giderInfo.suGideri || 0) / toplamDaireSayisi;

  // 4. METREKARE BAZLI HESAP
  const daireMetrekarePay =
    toplamKompleksMetrekaresi > 0 ? metrekare / toplamKompleksMetrekaresi : 0;

  // 5. EK GİDERLER (aktif daire sayısına eşit)
  const ekGiderlerToplam = (giderInfo.ekGiderler || []).reduce((t, g) => {
    const tutar = parseFloat(g.tutar) || 0; // string veya null güvenliği
    return t + tutar;
  }, 0);
  const ekGiderPayi = ekGiderlerToplam / toplamDaireSayisi;

  // 6. TOPLAM AIDAT
  const toplamAidat =
    asansorPayi +
    dogazPayi +
    guvenlikPayi +
    gorevliPayi +
    elektrikPayi +
    suPayi +
    yonetimPayi +
    ekGiderPayi;

  return {
    asansorPayi: parseFloat(asansorPayi.toFixed(2)),
    dogazPayi: parseFloat(dogazPayi.toFixed(2)),
    guvenlikPayi: parseFloat(guvenlikPayi.toFixed(2)),
    gorevliPayi: parseFloat(gorevliPayi.toFixed(2)),
    elektrikPayi: parseFloat(elektrikPayi.toFixed(2)),
    suPayi: parseFloat(suPayi.toFixed(2)),
    yonetimPayi: parseFloat(yonetimPayi.toFixed(2)),
    ekGiderPayi: parseFloat(ekGiderPayi.toFixed(2)),
    toplamAidat: parseFloat(toplamAidat.toFixed(2)),

    // Hesaplama detayları
    hesaplamaNotlari: {
      asansorKullanimi,
      kazanGrubu,
      petekOlcusu: (petekOlcusu || 0) + " cm",
      metrekarePay: parseFloat((daireMetrekarePay * 100).toFixed(4)) + "%",
    },
  };
}
