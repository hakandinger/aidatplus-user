import { useEffect, useMemo, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import LoadingState from "../components/dashboard/LoadingState";
import ErrorState from "../components/dashboard/ErrorState";
import { formatCurrency, getExpenseIcon } from "../components/common/formatters";

export default function Giderler() {
    const [veri, setVeri] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getirGiderler = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/giderler/ozet");
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Gider bilgileri alınamadı"
                    );
                }

                setVeri(result.data);
            } catch (err) {
                console.error("Giderler alınamadı:", err);

                setError(
                    err.message || "Gider bilgileri alınırken hata oluştu"
                );
            } finally {
                setLoading(false);
            }
        };

        getirGiderler();
    }, []);

    const giderKalemleri = useMemo(() => {
        if (!veri?.toplamlar) return [];

        return [
            {
                key: "dogalgaz",
                ad: "Doğalgaz",
                tutar: veri.toplamlar.dogalgaz,
            },
            {
                key: "asansor",
                ad: "Asansör",
                tutar: veri.toplamlar.asansor,
            },
            {
                key: "guvenlik",
                ad: "Güvenlik",
                tutar: veri.toplamlar.guvenlik,
            },
            {
                key: "binaGorevli",
                ad: "Bina Görevlileri",
                tutar: veri.toplamlar.binaGorevli,
            },
            {
                key: "elektrik",
                ad: "Elektrik",
                tutar: veri.toplamlar.elektrik,
            },
            {
                key: "su",
                ad: "Su",
                tutar: veri.toplamlar.su,
            },
            {
                key: "yonetim",
                ad: "Yönetim",
                tutar: veri.toplamlar.yonetim,
            },
            {
                key: "ekGiderler",
                ad: "Ek Giderler",
                tutar: veri.toplamlar.ekGiderler,
            },
        ];
    }, [veri]);

    if (loading) {
        return (
            <AppLayout>
                <LoadingState />
            </AppLayout>
        );
    }

    if (error) {
        return (
            <AppLayout>
                <ErrorState message={error} />
            </AppLayout>
        );
    }

    const toplamGider = Number(veri?.toplamGider || 0);
    const aylikGiderler = veri?.aylikGiderler || [];
    const ekGiderler = veri?.ekGiderler || [];

    const sonDonem =
        aylikGiderler.length > 0
            ? aylikGiderler[aylikGiderler.length - 1]
            : null;

    const sonDonemGideri = Number(
        sonDonem?.toplamGider || 0
    );

    const sonDonemAdi = sonDonem?.period || "-";

    const buYil = new Date().getFullYear().toString();

    const buYilToplam = aylikGiderler
        .filter((gider) => gider.period?.startsWith(buYil))
        .reduce(
            (toplam, gider) =>
                toplam + Number(gider.toplamGider || 0),
            0
        );

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Başlık */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Giderler
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kompleksin geçmiş ve güncel giderlerinin genel görünümü
                    </p>
                </div>

                {/* Genel Özet */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <OzetKart
                        baslik="Tüm Zamanlar Toplam Gider"
                        deger={formatCurrency(toplamGider)}
                        aciklama={`${aylikGiderler.length} dönem kayıtlı`}
                        buyuk
                    />

                    <OzetKart
                        baslik={`${buYil} Toplam Gider`}
                        deger={formatCurrency(buYilToplam)}
                        aciklama={`${buYil} yılı`}
                    />

                    <OzetKart
                        baslik="Son Dönem Gideri"
                        deger={formatCurrency(sonDonemGideri)}
                        aciklama={sonDonemAdi}
                    />
                </div>

                {/* Gider Türleri */}
                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            Gider Türlerine Göre Toplamlar
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Kayıtlı tüm dönemlerin toplam giderleri
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {giderKalemleri.map((gider) => (
                            <GiderKarti
                                key={gider.key}
                                gider={gider}
                            />
                        ))}
                    </div>
                </section>

                {/* Aylık Giderler */}
                <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-100 px-5 py-4">
                        <h2 className="font-semibold text-gray-900">
                            Aylık Gider Geçmişi
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            Dönemlere göre toplam giderler
                        </p>
                    </div>

                    {aylikGiderler.length === 0 ? (
                        <div className="p-8 text-center text-sm text-gray-500">
                            Henüz gider dönemi bulunmuyor.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {aylikGiderler.map((gider) => (
                                <AylikGiderSatiri
                                    key={gider.period}
                                    gider={gider}
                                />
                            ))}
                        </div>
                    )}
                </section>

                {/* Ek Giderler */}
                <EkGiderler ekGiderler={ekGiderler} />
            </div>
        </AppLayout>
    );
}

function OzetKart({
    baslik,
    deger,
    aciklama,
    buyuk = false,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
                {baslik}
            </p>

            <p
                className={`mt-2 font-bold text-gray-900 ${buyuk ? "text-3xl" : "text-2xl"
                    }`}
            >
                {deger}
            </p>

            <p className="mt-2 text-xs text-gray-500">
                {aciklama}
            </p>
        </div>
    );
}

function GiderKarti({ gider }) {
    const oran =
        gider.tutar > 0
            ? Math.round(
                (gider.tutar / 1) * 100
            )
            : 0;

    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100 text-xl">
                    {getExpenseIcon(gider.ad)}
                </div>

                <span className="text-xs text-gray-400">
                    Toplam
                </span>
            </div>

            <p className="mt-4 text-sm font-medium text-gray-500">
                {gider.ad}
            </p>

            <p className="mt-1 text-xl font-bold text-gray-900">
                {formatCurrency(gider.tutar)}
            </p>
        </div>
    );
}

function AylikGiderSatiri({ gider }) {
    return (
        <div className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="font-semibold text-gray-900">
                    {gider.period}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                    Doğalgaz: {formatCurrency(gider.dogalgaz)} ·{" "}
                    Su: {formatCurrency(gider.su)} ·{" "}
                    Elektrik: {formatCurrency(gider.elektrik)}
                </p>
            </div>

            <div className="sm:text-right">
                <p className="text-xs text-gray-500">
                    Toplam Gider
                </p>

                <p className="font-bold text-gray-900">
                    {formatCurrency(gider.toplamGider)}
                </p>
            </div>
        </div>
    );
}

function EkGiderler({ ekGiderler }) {
    const [acik, setAcik] = useState(false);

    const toplam = ekGiderler.reduce(
        (sum, gider) =>
            sum + Number(gider.tutar || 0),
        0
    );

    return (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={() => setAcik(!acik)}
                className="w-full px-5 py-4 text-left transition hover:bg-gray-50"
            >
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="font-semibold text-gray-900">
                            Ek Giderler
                        </h2>

                        <p className="mt-1 text-sm text-gray-500">
                            {ekGiderler.length} gider kalemi ·{" "}
                            {formatCurrency(toplam)}
                        </p>
                    </div>

                    <span
                        className={`text-gray-500 transition-transform ${acik ? "rotate-180" : ""
                            }`}
                    >
                        ▼
                    </span>
                </div>
            </button>

            {acik && (
                <div className="border-t border-gray-200">
                    {ekGiderler.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">
                            Ek gider bulunmuyor.
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {ekGiderler.map((gider, index) => (
                                <div
                                    key={`${gider.period}-${index}`}
                                    className="px-5 py-4"
                                >
                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                {gider.ad}
                                            </p>

                                            {gider.aciklama && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    {gider.aciklama}
                                                </p>
                                            )}

                                            <p className="mt-1 text-xs text-gray-400">
                                                {gider.period}
                                            </p>
                                        </div>

                                        <p className="font-bold text-gray-900">
                                            {formatCurrency(gider.tutar)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
}