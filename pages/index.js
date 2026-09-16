import { useEffect, useState } from "react";

import AppLayout from "../components/layout/AppLayout";
import BlokOzetKarti from "../components/dashboard/BlokOzetKarti";

export default function Home() {
  const [kompleksData, setKompleksData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [seciliBlok, setSeciliBlok] = useState("A");

  const bloklar = ["A", "B", "C", "D", "E", "F"];

  useEffect(() => {
    const bloklariGetir = async () => {
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
              "Kompleks bilgileri alınamadı"
          );
        }

        setKompleksData(result);
      } catch (error) {
        console.error(
          "Kompleks bilgileri alınamadı:",
          error
        );

        setError(
          error.message ||
            "Kompleks bilgileri alınırken hata oluştu"
        );
      } finally {
        setLoading(false);
      }
    };

    bloklariGetir();
  }, []);

  return (
    <AppLayout>
      <div className="mx-auto max-w-7xl">

        {/* =====================================================
            SAYFA BAŞLIĞI
        ===================================================== */}

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Apartman yönetim ve aidat özeti
          </p>
        </div>


        {/* =====================================================
            YÜKLENİYOR
        ===================================================== */}

        {loading && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="animate-pulse space-y-4">

              <div className="h-5 w-32 rounded bg-gray-200" />

              <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                {bloklar.map((blok) => (
                  <div
                    key={blok}
                    className="h-16 rounded-xl bg-gray-100"
                  />
                ))}

              </div>

              <div className="h-64 rounded-2xl bg-gray-100" />

            </div>

          </div>
        )}


        {/* =====================================================
            HATA
        ===================================================== */}

        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5">

            <div className="flex gap-3">

              <span className="text-xl">
                ⚠️
              </span>

              <div>

                <h2 className="font-semibold text-red-800">
                  Bilgiler alınamadı
                </h2>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>

              </div>

            </div>

          </div>
        )}


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {!loading &&
          !error &&
          kompleksData && (
            <>

              {/* =================================================
                  KOMPLEKS ÖZETİ
              ================================================= */}

              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <p className="text-xs font-medium text-gray-500">
                    Toplam Blok
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      kompleksData.istatistikler
                        ?.toplamBlokSayisi ?? "-"
                    }
                  </p>

                </div>


                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <p className="text-xs font-medium text-gray-500">
                    Toplam Daire
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      kompleksData.istatistikler
                        ?.toplamDaireSayisi ?? "-"
                    }
                  </p>

                </div>


                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <p className="text-xs font-medium text-gray-500">
                    Asansör Kullanan
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">
                    {
                      kompleksData.istatistikler
                        ?.toplamAsansorKullanan ?? "-"
                    }
                  </p>

                </div>


                <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

                  <p className="text-xs font-medium text-gray-500">
                    Toplam Alan
                  </p>

                  <p className="mt-2 text-2xl font-bold text-gray-900">

                    {
                      kompleksData.istatistikler
                        ?.toplamMetrekare
                        ? `${Number(
                            kompleksData.istatistikler
                              .toplamMetrekare
                          ).toLocaleString("tr-TR")} m²`
                        : "-"
                    }

                  </p>

                </div>

              </div>


              {/* =================================================
                  BLOK SEÇİMİ
              ================================================= */}

              <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">

                <div className="mb-3">

                  <h2 className="text-sm font-semibold text-gray-800">
                    Blok Seç
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    Görüntülemek istediğiniz bloğu seçin.
                  </p>

                </div>


                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">

                  {bloklar.map((blok) => {

                    const aktif =
                      seciliBlok === blok;

                    const blokInfo =
                      kompleksData.bloklar?.find(
                        (item) =>
                          item.blokHarfi === blok
                      );

                    return (
                      <button
                        key={blok}
                        type="button"
                        onClick={() =>
                          setSeciliBlok(blok)
                        }
                        className={`
                          rounded-xl
                          border
                          px-3
                          py-3
                          text-center
                          transition-all
                          duration-200

                          ${
                            aktif
                              ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50"
                          }
                        `}
                      >

                        <div className="text-lg font-bold">
                          {blok}
                        </div>

                        <div
                          className={`
                            mt-1 text-[11px]

                            ${
                              aktif
                                ? "text-gray-300"
                                : "text-gray-400"
                            }
                          `}
                        >
                          {
                            blokInfo?.toplamDaireSayisi ??
                            "-"
                          }{" "}
                          daire
                        </div>

                      </button>
                    );
                  })}

                </div>

              </div>


              {/* =================================================
                  SEÇİLEN BLOK
              ================================================= */}

              <BlokOzetKarti
                blokHarfi={seciliBlok}
                kompleksData={kompleksData}
              />

            </>
          )}

      </div>
    </AppLayout>
  );
}