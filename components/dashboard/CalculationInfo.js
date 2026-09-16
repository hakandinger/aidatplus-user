function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-1 font-medium text-gray-800">
        {value}
      </p>
    </div>
  );
}

export default function CalculationInfo({ notes }) {
  if (!notes) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">

      <h4 className="mb-3 font-semibold text-gray-800">
        ℹ️ Hesaplama Bilgileri
      </h4>

      <div className="grid grid-cols-2 gap-4 text-sm">

        <InfoItem
          label="Asansör"
          value={
            notes.asansorKullanimi
              ? "Kullanıyor"
              : "Kullanmıyor"
          }
        />

        <InfoItem
          label="Kazan"
          value={
            notes.kazanGrubu
              ? `Kazan ${notes.kazanGrubu}`
              : "-"
          }
        />

        <InfoItem
          label="Petek"
          value={notes.petekOlcusu || "-"}
        />

        <InfoItem
          label="Metrekare Payı"
          value={notes.metrekarePay || "-"}
        />

      </div>

    </div>
  );
}