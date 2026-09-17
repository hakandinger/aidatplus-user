import { useState } from "react";
import {
  formatCurrency,
  getExpenseIcon,
} from "../common/formatters";

export default function BlokGiderOzeti({
  giderler = [],
  toplamGider = 0,
  period,
}) {
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

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div>
        <h2 className="text-lg font-bold text-gray-900">
          Aylık Giderler
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          {period
            ? `${period} dönemi gider dağılımı`
            : "Aylık gider dağılımı"}
        </p>
      </div>

      {/* Ortak Giderler */}
      {ortakGiderler.length > 0 && (
        <GiderGrubu
          baslik="Ortak Bina Giderleri"
          aciklama="Tüm Binalar için yapılan ve tüm dairelere dağıtılan giderler"
          icon="🏢"
          giderler={ortakGiderler}
        />
      )}

      {ekGiderler.length > 0 && (
        <EkGiderlerGrubu giderler={ekGiderler} />
      )}

      {/* Blok / Kazan Giderleri */}
      {blokGiderler.length > 0 && (
        <GiderGrubu
          baslik="Blok / Kazan Giderleri"
          aciklama="Seçili bloğun bağlı olduğu kazan grubuna ait giderler"
          icon="🔥"
          giderler={blokGiderler}
        />
      )}

      {/* Asansör */}
      {asansorGiderler.length > 0 && (
        <GiderGrubu
          baslik="Asansör Giderleri"
          aciklama="Asansörü kullanan daireler arasında eşit olarak dağıtılır"
          icon="🛗"
          giderler={asansorGiderler}
        />
      )}

      {/* Genel Toplam */}
      <div className="rounded-2xl bg-gray-900 p-5 text-white shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

          {/* Toplam Gider */}
          <div>
            <p className="text-sm text-gray-300">
              Toplam Gider
            </p>

            <p className="mt-1 text-2xl font-bold">
              {formatCurrency(toplamGider)}
            </p>
          </div>

          {/* Daire Başı Toplam Pay */}
          <div className="rounded-xl bg-emerald-500/20 p-4 sm:text-right">
            <p className="text-sm font-medium text-emerald-200">
              Daire Başı Toplam Pay
            </p>

            <p className="mt-1 text-2xl font-bold text-emerald-300">
              {formatCurrency(
                giderler.reduce(
                  (toplam, gider) =>
                    toplam + Number(gider.daireBasiPay || 0),
                  0
                )
              )}
            </p>

            <p className="mt-1 text-xs text-emerald-200/80">
              Bu dönem giderlerinin daire payı toplamı
            </p>
          </div>

        </div>
      </div>
      {/* Bilgilendirme */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-sm leading-6 text-blue-800">
          <strong>Bilgi:</strong> Bu ekran genel gider
          bilgilerini gösterir. Gösterilen tutarlar kişiye
          özel aidat tutarı değildir. Aidat hesabı, dairenin
          özelliklerine ve ilgili giderin dağıtım yöntemine
          göre ayrıca hesaplanır.
        </p>
      </div>
    </div>
  );
}

function GiderGrubu({
  baslik,
  aciklama,
  icon,
  giderler,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {/* Grup Başlığı */}
      <div className="border-b border-gray-200 bg-gray-50 px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
            {icon}
          </div>

          <div>
            <h3 className="font-semibold text-gray-900">
              {baslik}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {aciklama}
            </p>
          </div>
        </div>
      </div>

      {/* Giderler */}
      <div className="divide-y divide-gray-100">
        {giderler.map((gider, index) => (
          <GiderSatiri
            key={`${gider.giderTuru}-${index}`}
            gider={gider}
          />
        ))}
      </div>
    </section>
  );
}

function GiderSatiri({ gider }) {
  return (
    <div className="p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        {/* Gider Bilgisi */}
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-lg">
            {getExpenseIcon(gider.giderTuru)}
          </div>

          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900">
              {gider.giderTuru}
            </h4>

            {gider.aciklama && (
              <p className="mt-1 text-sm text-gray-500">
                {gider.aciklama}
              </p>
            )}

            <p className="mt-2 text-xs text-gray-500">
              Dağıtım:{" "}
              <span className="font-medium text-gray-700">
                {gider.paylamaYontemi || "Eşit Pay"}
              </span>
            </p>
          </div>
        </div>

        {/* Tutar Bilgileri */}
        <div className="shrink-0 sm:text-right">

          <p className="text-xs font-medium text-gray-500">
            Toplam Tutar
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {formatCurrency(gider.tutar)}
          </p>

          {/* DAİRE PAYI */}
          <p className="mt-1 text-xs text-gray-500">
            {gider.dairePayiLabel || "Daire başı pay"}:{" "}
            <span className="font-semibold text-gray-700">
              {formatCurrency(gider.daireBasiPay)}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}

function EkGiderlerGrubu({ giderler }) {
  const [acik, setAcik] = useState(false);

  const toplam = giderler.reduce(
    (sum, gider) => sum + Number(gider.tutar || 0),
    0
  );

  const toplamDairePayi = giderler.reduce(
    (sum, gider) =>
      sum + Number(gider.daireBasiPay || 0),
    0
  );

  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Accordion Başlık */}
      <button
        type="button"
        onClick={() => setAcik(!acik)}
        className="w-full px-5 py-4 text-left transition hover:bg-gray-50"
      >
        <div className="flex items-center justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-xl">
              🧾
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-gray-900">
                Ek Giderler
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                {giderler.length} gider kalemi ·{" "}
                {formatCurrency(toplam)}
              </p>
            </div>
          </div>

          {/* Ok */}
          <div
            className={`shrink-0 text-gray-500 transition-transform ${acik ? "rotate-180" : ""
              }`}
          >
            ▼
          </div>
        </div>

        {/* Özet */}
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-500">
          <span>
            Toplam:{" "}
            <strong className="text-gray-700">
              {formatCurrency(toplam)}
            </strong>
          </span>

          <span>
            Daire başı:{" "}
            <strong className="text-gray-700">
              {formatCurrency(toplamDairePayi)}
            </strong>
          </span>
        </div>
      </button>

      {/* Açılır İçerik */}
      {acik && (
        <div className="border-t border-gray-200">
          <div className="divide-y divide-gray-100">
            {giderler.map((gider, index) => (
              <GiderSatiri
                key={`${gider.key}-${index}`}
                gider={gider}
              />
            ))}
          </div>

          {/* Alt Toplam */}
          <div className="border-t border-gray-200 bg-gray-50 px-5 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-700">
                Ek giderlerin daire başı toplamı
              </span>

              <span className="font-bold text-gray-900">
                {formatCurrency(toplamDairePayi)}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}