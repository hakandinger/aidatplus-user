import {
  formatCurrency,
  getExpenseIcon,
  getPayTypeClass,
} from "../common/formatters";

export default function ExpenseRow({ gider }) {
  const toplam = Number(gider?.toplam || 0);

  const dairePayi = Number(
    gider?.dairePayi || 0
  );

  return (
    <div className="px-4 py-3 transition hover:bg-gray-50">

      <div className="flex items-start gap-3">

        {/* İkon */}

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
          {getExpenseIcon(gider.giderTuru)}
        </div>

        {/* İçerik */}

        <div className="min-w-0 flex-1">

          <div className="flex items-start justify-between gap-3">

            <div className="min-w-0">

              <p className="font-medium text-gray-800">
                {gider.giderTuru}
              </p>

              {gider.aciklama && (
                <p
                  className="mt-0.5 truncate text-xs text-gray-500"
                  title={gider.aciklama}
                >
                  {gider.aciklama}
                </p>
              )}

            </div>

            {/* Tutar */}

            <div className="shrink-0 text-right">

              <p className="font-semibold text-gray-900">
                {formatCurrency(dairePayi)}
              </p>

              <p className="text-xs text-gray-400">
                Toplam {formatCurrency(toplam)}
              </p>

            </div>

          </div>

          {/* Pay tipi */}

          {gider.payTipi && (
            <span
              className={`
                mt-2 inline-block
                rounded-full border
                px-2 py-0.5
                text-[11px] font-medium
                ${getPayTypeClass(gider.payTipi)}
              `}
            >
              {gider.payTipi}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}