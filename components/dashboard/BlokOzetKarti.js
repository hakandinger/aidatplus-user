import { useEffect } from "react";

import { useBlokGiderleri } from "../../hooks/useBlokGiderleri";

import BlokBilgiKartlari from "./BlokBilgiKartlari";
import BlokGiderOzeti from "./BlokGiderOzeti";
import LoadingState from "./LoadingState";
import ErrorState from "./ErrorState";

export default function BlokOzetKarti({
  blokHarfi,
  kompleksData,
}) {
  const {
    blokVerisi,
    loading,
    error,
    getirBlokGiderleri,
  } = useBlokGiderleri(blokHarfi);

  useEffect(() => {
    getirBlokGiderleri();
  }, [getirBlokGiderleri]);

  const blok =
    blokVerisi?.blok ||
    kompleksData?.bloklar?.find(
      (item) =>
        item.blokHarfi === blokHarfi
    );

  return (
    <div className="space-y-5">

      {/* =====================================================
          BLOK BAŞLIĞI
      ===================================================== */}

      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 text-xl font-bold text-white">
              {blokHarfi}
            </div>

            <div>

              <h2 className="text-xl font-bold text-gray-900">
                {blokHarfi} Blok
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Blok genel bilgileri ve gider özeti
              </p>

            </div>

          </div>


          {blok?.kazanGrubu && (
            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
              Kazan {blok.kazanGrubu}
            </span>
          )}

        </div>

      </div>      


      {/* =====================================================
          YÜKLENİYOR
      ===================================================== */}

      {loading && (
        <LoadingState />
      )}


      {/* =====================================================
          HATA
      ===================================================== */}

      {!loading && error && (
        <ErrorState
          message={error}
        />
      )}


      {/* =====================================================
          GİDER ÖZETİ
      ===================================================== */}

      {!loading &&
        !error &&
        blokVerisi && (
          <BlokGiderOzeti
            giderler={blokVerisi?.giderler || []}
            toplamGider={blokVerisi?.toplamGider || 0}
            toplamOrtalamaDairePayi={
              blokVerisi?.toplamOrtalamaDairePayi || 0
            }
            period={blokVerisi?.period}
          />
        )}

    </div>
  );
}