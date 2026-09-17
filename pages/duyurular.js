import { useEffect, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import LoadingState from "../components/dashboard/LoadingState";
import ErrorState from "../components/dashboard/ErrorState";

export default function Duyurular() {
    const [duyurular, setDuyurular] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getirDuyurular = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch("/api/duyurular");
                const result = await response.json();

                if (!response.ok || !result.success) {
                    throw new Error(
                        result.message || "Duyurular alınamadı"
                    );
                }

                setDuyurular(result.data || []);
            } catch (err) {
                console.error("Duyurular alınamadı:", err);

                setError(
                    err.message || "Duyurular alınırken hata oluştu"
                );
            } finally {
                setLoading(false);
            }
        };

        getirDuyurular();
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

    return (
        <AppLayout>
            <div className="space-y-6">
                {/* Başlık */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Duyurular
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Site yönetimi tarafından yayınlanan güncel duyurular
                    </p>
                </div>

                {/* Duyurular */}
                {duyurular.length === 0 ? (
                    <BosDuyuru />
                ) : (
                    <div className="space-y-4">
                        {duyurular.map((duyuru) => (
                            <DuyuruKarti
                                key={duyuru._id}
                                duyuru={duyuru}
                            />
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function DuyuruKarti({ duyuru }) {
    const onemli = duyuru.oncelik === "onemli";

    const yayinTarihi = duyuru.yayinTarihi
        ? new Date(duyuru.yayinTarihi)
        : null;

    const tarih =
        yayinTarihi && !Number.isNaN(yayinTarihi.getTime())
            ? yayinTarihi.toLocaleDateString("tr-TR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "";

    return (
        <article
            className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${onemli
                    ? "border-red-200"
                    : "border-gray-200"
                }`}
        >
            <div className="p-5">
                <div className="flex items-start gap-4">
                    {/* İkon */}
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl ${onemli
                                ? "bg-red-50"
                                : "bg-gray-100"
                            }`}
                    >
                        {onemli ? "⚠️" : "📢"}
                    </div>

                    <div className="min-w-0 flex-1">
                        {/* Etiketler */}
                        <div className="flex flex-wrap items-center gap-2">
                            {onemli && (
                                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                                    Önemli
                                </span>
                            )}

                            {duyuru.kategori && (
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                    {duyuru.kategori}
                                </span>
                            )}

                            {duyuru.hedef &&
                                duyuru.hedef !== "tum-kompleks" && (
                                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                                        {duyuru.hedef} Blok
                                    </span>
                                )}
                        </div>

                        {/* Başlık */}
                        <h2 className="mt-3 text-lg font-bold text-gray-900">
                            {duyuru.baslik}
                        </h2>

                        {/* İçerik */}
                        <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">
                            {duyuru.icerik}
                        </p>

                        {/* Tarih */}
                        {tarih && (
                            <p className="mt-4 text-xs text-gray-400">
                                Yayınlanma tarihi: {tarih}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}

function BosDuyuru() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
            <div className="text-4xl">📢</div>

            <h2 className="mt-4 text-lg font-semibold text-gray-900">
                Güncel duyuru bulunmuyor
            </h2>

            <p className="mt-2 text-sm text-gray-500">
                Yayınlanmış yeni bir duyuru olduğunda burada
                görüntülenecektir.
            </p>
        </div>
    );
}