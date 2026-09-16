export default function EmptyState() {
  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">

      <div className="text-3xl">
        💰
      </div>

      <h4 className="mt-2 font-semibold text-blue-900">
        Aidat Verisi Yok
      </h4>

      <p className="mt-1 text-sm text-blue-700">
        Bu dönem için aidat hesaplama verisi bulunamadı.
      </p>

    </div>
  );
}