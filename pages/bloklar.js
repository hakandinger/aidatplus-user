import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import LoadingState from "../components/dashboard/LoadingState";
import ErrorState from "../components/dashboard/ErrorState";

export default function Bloklar() {
    const [kompleksData, setKompleksData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getirBloklar = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "/api/kompleks/blok-listesi"
                );

                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message ||
                        "Blok bilgileri alınamadı"
                    );
                }

                setKompleksData(result);
            } catch (err) {
                console.error("Blok listesi hatası:", err);

                setError(
                    err.message ||
                    "Blok bilgileri alınırken hata oluştu"
                );
            } finally {
                setLoading(false);
            }
        };

        getirBloklar();
    }, []);

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

    const bloklar = kompleksData?.bloklar || [];

    return (
        <AppLayout>
            <div className="space-y-6">

                {/* Sayfa Başlığı */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Bloklar
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Kompleksimizde bulunan blokların genel bilgileri
                    </p>
                </div>

                {/* Genel Özet */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                    <OzetKart
                        baslik="Toplam Blok"
                        deger={
                            kompleksData?.istatistikler
                                ?.toplamBlokSayisi || 0
                        }
                        birim="Blok"
                    />

                    <OzetKart
                        baslik="Toplam Daire"
                        deger={
                            kompleksData?.istatistikler
                                ?.toplamDaireSayisi || 0
                        }
                        birim="Daire"
                    />

                    <OzetKart
                        baslik="Asansör Kullanan"
                        deger={
                            kompleksData?.istatistikler
                                ?.toplamAsansorKullanan || 0
                        }
                        birim="Daire"
                    />

                    <OzetKart
                        baslik="Toplam Alan"
                        deger={
                            kompleksData?.istatistikler
                                ?.toplamMetrekare || 0
                        }
                        birim="m²"
                    />

                </div>

                {/* Bloklar */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {bloklar.map((blok) => (
                        <BlokKarti
                            key={blok._id}
                            blok={blok}
                        />
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}

function OzetKart({ baslik, deger, birim }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500">
                {baslik}
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
                {Number(deger).toLocaleString("tr-TR")}
            </p>

            <p className="mt-1 text-xs text-gray-500">
                {birim}
            </p>
        </div>
    );
}

function BlokKarti({ blok }) {
    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">

            {/* Kart Başlığı */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Blok
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                        {blok.blokHarfi}
                    </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-xl font-bold text-gray-700">
                    {blok.blokHarfi}
                </div>
            </div>

            {/* Bilgiler */}
            <div className="grid grid-cols-2 gap-3 p-5">

                <Bilgi
                    label="Daire"
                    value={`${blok.toplamDaireSayisi || 0}`}
                />

                <Bilgi
                    label="Metrekare"
                    value={`${blok.metrekare || 0} m²`}
                />

                <Bilgi
                    label="Zemin Kat"
                    value={`${blok.zeminKatDaireSayisi || 0}`}
                />

                <Bilgi
                    label="Normal Kat"
                    value={`${blok.normalKatDaireSayisi || 0}`}
                />

                <Bilgi
                    label="Asansör"
                    value={`${blok.asansorKullananDaireSayisi || 0}`}
                />

                <Bilgi
                    label="Petek"
                    value={`${blok.petekOlcusu || 0} cm`}
                />

            </div>

            {/* Kazan */}
            <div className="border-t border-gray-100 px-5 py-4">
                <div className="flex items-center justify-between">

                    <span className="text-sm text-gray-500">
                        Isıtma Sistemi
                    </span>

                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
                        🔥 Kazan {blok.kazanGrubu}
                    </span>

                </div>
            </div>

        </div>
    );
}

function Bilgi({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-3">
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-1 font-semibold text-gray-900">
                {value}
            </p>
        </div>
    );
}