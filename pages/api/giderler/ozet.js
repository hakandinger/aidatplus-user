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

        const giderler = await db
            .collection("aylik_giderler")
            .find({})
            .sort({ period: 1 })
            .toArray();

        if (giderler.length === 0) {
            return res.status(200).json({
                success: true,
                message: "Henüz gider kaydı bulunmuyor",
                data: {
                    toplamGider: 0,
                    toplamlar: {},
                    donemler: [],
                    aylikGiderler: [],
                    ekGiderler: [],
                },
            });
        }

        const toplamlar = {
            dogalgaz: 0,
            asansor: 0,
            guvenlik: 0,
            binaGorevli: 0,
            elektrik: 0,
            su: 0,
            yonetim: 0,
            ekGiderler: 0,
        };

        const aylikGiderler = [];
        const tumEkGiderler = [];

        for (const kayit of giderler) {
            const dogalgaz =
                Number(kayit.kazan1DogazFaturasi || 0) +
                Number(kayit.kazan2DogazFaturasi || 0);

            const asansor = Number(kayit.asansorGideri || 0);
            const guvenlik = Number(
                kayit.guvenlikPersonelGideri || 0
            );
            const binaGorevli = Number(
                kayit.binagorevliGideri || 0
            );
            const elektrik = Number(
                kayit.elektrikGideri || 0
            );
            const su = Number(kayit.suGideri || 0);
            const yonetim = Number(
                kayit.yonetimGideri || 0
            );

            let ekGiderToplam = 0;

            if (Array.isArray(kayit.ekGiderler)) {
                for (const ekGider of kayit.ekGiderler) {
                    const tutar = Number(ekGider.tutar || 0);

                    ekGiderToplam += tutar;

                    tumEkGiderler.push({
                        period: kayit.period,
                        ad: ekGider.ad || "Ek Gider",
                        aciklama: ekGider.aciklama || "",
                        tutar,
                    });
                }
            }

            const toplam =
                dogalgaz +
                asansor +
                guvenlik +
                binaGorevli +
                elektrik +
                su +
                yonetim +
                ekGiderToplam;

            toplamlar.dogalgaz += dogalgaz;
            toplamlar.asansor += asansor;
            toplamlar.guvenlik += guvenlik;
            toplamlar.binaGorevli += binaGorevli;
            toplamlar.elektrik += elektrik;
            toplamlar.su += su;
            toplamlar.yonetim += yonetim;
            toplamlar.ekGiderler += ekGiderToplam;

            aylikGiderler.push({
                period: kayit.period,
                dogalgaz,
                asansor,
                guvenlik,
                binaGorevli,
                elektrik,
                su,
                yonetim,
                ekGiderler: ekGiderToplam,
                toplamGider: toplam,
            });
        }

        const toplamGider = Object.values(toplamlar).reduce(
            (toplam, tutar) => toplam + tutar,
            0
        );

        const donemler = giderler.map(
            (kayit) => kayit.period
        );

        return res.status(200).json({
            success: true,
            message: "Gider özeti başarıyla oluşturuldu",
            data: {
                toplamGider,
                toplamlar,
                donemler,
                aylikGiderler,
                ekGiderler: tumEkGiderler,
            },
        });
    } catch (error) {
        console.error("Gider özeti hatası:", error);

        return res.status(500).json({
            success: false,
            message: "Gider özeti alınırken hata oluştu",
            error: error.message,
        });
    }
}