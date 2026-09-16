export default function ErrorState({ message }) {
  return (
    <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">

      <div className="flex gap-3">

        <span className="text-xl">
          ⚠️
        </span>

        <div>

          <h4 className="font-semibold text-yellow-800">
            Aidat bilgisi alınamadı
          </h4>

          <p className="mt-1 text-sm text-yellow-700">
            {message}
          </p>

        </div>

      </div>

    </div>
  );
}