export default function BlokBilgiKartlari({
  blok,
}) {
  if (!blok) return null;

  const bilgiler = [
    {
      label: "Toplam Daire",
      value: blok.toplamDaireSayisi
        ? `${blok.toplamDaireSayisi} Daire`
        : "-",
    },
    {
      label: "Zemin Kat",
      value:
        blok.zeminKatDaireSayisi !== undefined
          ? `${blok.zeminKatDaireSayisi} Daire`
          : "-",
    },
    {
      label: "Normal Kat",
      value:
        blok.normalKatDaireSayisi !== undefined
          ? `${blok.normalKatDaireSayisi} Daire`
          : "-",
    },
    {
      label: "Asansör Kullanan",
      value:
        blok.asansorKullananDaireSayisi !==
        undefined
          ? `${blok.asansorKullananDaireSayisi} Daire`
          : "-",
    },
    {
      label: "Metrekare",
      value: blok.metrekare
        ? `${blok.metrekare} m²`
        : "-",
    },
    {
      label: "Petek Ölçüsü",
      value: blok.petekOlcusu
        ? `${blok.petekOlcusu} cm`
        : "-",
    },
    {
      label: "Kazan Grubu",
      value: blok.kazanGrubu
        ? `Kazan ${blok.kazanGrubu}`
        : "-",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {bilgiler.map((bilgi) => (
        <div
          key={bilgi.label}
          className="rounded-xl bg-gray-50 p-4"
        >
          <p className="text-xs font-medium text-gray-500">
            {bilgi.label}
          </p>

          <p className="mt-1 text-lg font-bold text-gray-900">
            {bilgi.value}
          </p>
        </div>
      ))}
    </div>
  );
}