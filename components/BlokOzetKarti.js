import { useEffect, useMemo } from "react";
import { useAidat } from "../hooks/useAidat";
/** * Para formatı */ const formatCurrency = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
/** * Gider türüne göre ikon */ const getExpenseIcon = (giderTuru = "") => {
  const value = giderTuru.toLowerCase();
  if (value.includes("asansör")) return "🛗";
  if (value.includes("doğalgaz")) return "🔥";
  if (value.includes("güvenlik")) return "🛡️";
  if (value.includes("görevli")) return "👷";
  if (value.includes("elektrik")) return "⚡";
  if (value.includes("su")) return "💧";
  if (value.includes("yönetim")) return "📋";
  if (value.includes("demirbaş")) return "🏢";
  return "💰";
};
/** * Pay tipine göre badge sınıfı */ const getPayTypeClass = (
  payTipi = "",
) => {
  switch (payTipi) {
    case "Eşit Pay":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Metrekare":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Petek Ölçüsü":
      return "bg-orange-50 text-orange-700 border-orange-200";
    case "Kullanan Daire":
      return "bg-purple-50 text-purple-700 border-purple-200";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};
/** * Blok bilgilerini güvenli şekilde al */ const getBlokInfo = (
  kompleksData,
  blokHarfi,
) => {
  if (!kompleksData?.bloklar) {
    return {};
  }
  return (
    kompleksData.bloklar.find((blok) => blok.blokHarfi === blokHarfi) || {}
  );
};
/** * Hesaplama detaylarından gider listesini oluştur */ const buildExpenseList =
  (hesaplamaDetay) => {
    if (!hesaplamaDetay) {
      return [];
    }
    const fixedExpenses = [
      hesaplamaDetay.asansorPayi,
      hesaplamaDetay.dogazPayi,
      hesaplamaDetay.kapiciDogazPayi,
      hesaplamaDetay.guvenlikPayi,
      hesaplamaDetay.gorevliPayi,
      hesaplamaDetay.elektrikPayi,
      hesaplamaDetay.suPayi,
      hesaplamaDetay.yonetimPayi,
    ].filter(Boolean);
    const additionalExpenses = Array.isArray(hesaplamaDetay.ekGiderler)
      ? hesaplamaDetay.ekGiderler
      : [];
    return [...fixedExpenses, ...additionalExpenses];
  };
/** * Blok Özeti */ export default function BlokOzetKarti({
  blokHarfi,
  kompleksData,
}) {
  const { aidatVerisi, loading, error, hesaplaAidat } = useAidat(blokHarfi);
  /** * Blok bilgileri */ const blokInfo = useMemo(
    () => getBlokInfo(kompleksData, blokHarfi),
    [kompleksData, blokHarfi],
  );
  /** * Gider listesi */ const giderler = useMemo(
    () => buildExpenseList(aidatVerisi?.hesaplamaDetay),
    [aidatVerisi],
  );
  /** * Gider toplamı */ const toplamDairePayi = useMemo(
    () =>
      giderler.reduce(
        (total, gider) => total + Number(gider?.dairePayi || 0),
        0,
      ),
    [giderler],
  );
  /** * Aidat verisini getir */ useEffect(() => {
    hesaplaAidat();
  }, [hesaplaAidat]);
  /** * --------------------------------------- * RENDER * --------------------------------------- */ return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      {" "}
      {/* ================================================= HEADER ================================================= */}{" "}
      <div className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white px-5 py-4">
        {" "}
        <div className="flex items-center justify-between">
          {" "}
          <div className="flex items-center gap-3">
            {" "}
            {/* Blok ikonu */}{" "}
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${blokInfo.kazanGrubu === 1 ? "bg-blue-100" : "bg-emerald-100"}`}
            >
              {" "}
              {blokHarfi}{" "}
            </div>{" "}
            <div>
              {" "}
              <h3 className="text-lg font-semibold text-gray-900">
                {" "}
                {blokHarfi} Blok{" "}
              </h3>{" "}
              <p className="text-xs text-gray-500">
                {" "}
                Blok özeti ve aidat bilgileri{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
          {/* Kazan badge */}{" "}
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${blokInfo.kazanGrubu === 1 ? "bg-blue-50 text-blue-700" : "bg-emerald-50 text-emerald-700"}`}
          >
            {" "}
            Kazan {blokInfo.kazanGrubu || "-"}{" "}
          </span>{" "}
        </div>{" "}
      </div>{" "}
      {/* ================================================= CONTENT ================================================= */}{" "}
      <div className="space-y-4 p-5">
        {" "}
        {/* ================================================= BLOK İSTATİSTİKLERİ ================================================= */}{" "}
        <div className="grid grid-cols-2 gap-3">
          {" "}
          {/* Daire */}{" "}
          <div className="rounded-xl bg-gray-50 p-4">
            {" "}
            <p className="text-xs font-medium text-gray-500">
              {" "}
              Toplam Daire{" "}
            </p>{" "}
            <p className="mt-1 text-xl font-bold text-gray-900">
              {" "}
              {blokInfo.toplamDaireSayisi || "-"}{" "}
            </p>{" "}
          </div>{" "}
          {/* Asansör */}{" "}
          <div className="rounded-xl bg-gray-50 p-4">
            {" "}
            <p className="text-xs font-medium text-gray-500">
              {" "}
              Asansör Kullanan{" "}
            </p>{" "}
            <p className="mt-1 text-xl font-bold text-gray-900">
              {" "}
              {blokInfo.asansorKullananDaireSayisi || "-"}{" "}
            </p>{" "}
          </div>{" "}
          {/* Metrekare */}{" "}
          <div className="rounded-xl bg-gray-50 p-4">
            {" "}
            <p className="text-xs font-medium text-gray-500">
              {" "}
              Daire Alanı{" "}
            </p>{" "}
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {" "}
              {blokInfo.metrekare ? `${blokInfo.metrekare} m²` : "-"}{" "}
            </p>{" "}
          </div>{" "}
          {/* Petek */}{" "}
          <div className="rounded-xl bg-gray-50 p-4">
            {" "}
            <p className="text-xs font-medium text-gray-500">
              {" "}
              Petek Ölçüsü{" "}
            </p>{" "}
            <p className="mt-1 text-lg font-semibold text-gray-900">
              {" "}
              {blokInfo.petekOlcusu ? `${blokInfo.petekOlcusu} cm` : "-"}{" "}
            </p>{" "}
          </div>{" "}
        </div>{" "}
        {/* ================================================= ISITMA SİSTEMİ ================================================= */}{" "}
        <div className="rounded-xl border border-orange-100 bg-orange-50/50 p-4">
          {" "}
          <div className="mb-3 flex items-center justify-between">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <span className="text-lg">🔥</span>{" "}
              <h4 className="font-semibold text-gray-800">
                {" "}
                Isıtma Sistemi{" "}
              </h4>{" "}
            </div>{" "}
            <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-orange-700 shadow-sm">
              {" "}
              Kazan {blokInfo.kazanGrubu || "-"}{" "}
            </span>{" "}
          </div>{" "}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {" "}
            <div>
              {" "}
              <p className="text-xs text-gray-500"> Kazan Grubu </p>{" "}
              <p className="mt-1 font-semibold text-gray-800">
                {" "}
                {blokInfo.kazanGrubu
                  ? `Kazan ${blokInfo.kazanGrubu}`
                  : "-"}{" "}
              </p>{" "}
            </div>{" "}
            <div>
              {" "}
              <p className="text-xs text-gray-500"> Petek Ölçüsü </p>{" "}
              <p className="mt-1 font-semibold text-gray-800">
                {" "}
                {blokInfo.petekOlcusu ? `${blokInfo.petekOlcusu} cm` : "-"}{" "}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        {/* ================================================= LOADING ================================================= */}{" "}
        {loading && (
          <div className="space-y-3">
            {" "}
            <div className="h-28 animate-pulse rounded-xl bg-gray-100" />{" "}
            <div className="h-48 animate-pulse rounded-xl bg-gray-100" />{" "}
          </div>
        )}{" "}
        {/* ================================================= ERROR ================================================= */}{" "}
        {!loading && error && (
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            {" "}
            <div className="flex gap-3">
              {" "}
              <span className="text-xl"> ⚠️ </span>{" "}
              <div>
                {" "}
                <h4 className="font-semibold text-yellow-800">
                  {" "}
                  Aidat bilgisi alınamadı{" "}
                </h4>{" "}
                <p className="mt-1 text-sm text-yellow-700"> {error} </p>{" "}
              </div>{" "}
            </div>{" "}
          </div>
        )}{" "}
        {/* ================================================= AİDAT ÖZETİ ================================================= */}{" "}
        {!loading && !error && aidatVerisi && (
          <>
            {" "}
            <div className="rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-5 text-white">
              {" "}
              <div className="flex items-start justify-between">
                {" "}
                <div>
                  {" "}
                  <p className="text-sm text-gray-300"> Örnek Daire </p>{" "}
                  <p className="mt-1 text-lg font-semibold">
                    {" "}
                    {blokHarfi} {aidatVerisi.daireNo}{" "}
                  </p>{" "}
                </div>{" "}
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                  {" "}
                  {aidatVerisi.period}{" "}
                </span>{" "}
              </div>{" "}
              <div className="mt-5">
                {" "}
                <p className="text-sm text-gray-400"> Aylık Aidat </p>{" "}
                <p className="mt-1 text-3xl font-bold tracking-tight">
                  {" "}
                  {formatCurrency(aidatVerisi.hesaplananAidat)}{" "}
                </p>{" "}
              </div>{" "}
            </div>{" "}
            {/* ================================================= GİDER DETAYLARI ================================================= */}{" "}
            {giderler.length > 0 && (
              <div className="rounded-2xl border border-gray-200 overflow-hidden">
                {" "}
                <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                  {" "}
                  <div className="flex items-center justify-between">
                    {" "}
                    <div>
                      {" "}
                      <h4 className="font-semibold text-gray-800">
                        {" "}
                        Gider Dağılımı{" "}
                      </h4>{" "}
                      <p className="text-xs text-gray-500">
                        {" "}
                        {blokHarfi} {aidatVerisi.daireNo} dairesinin
                        payları{" "}
                      </p>{" "}
                    </div>{" "}
                    <span className="text-sm font-bold text-gray-800">
                      {" "}
                      {formatCurrency(toplamDairePayi)}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="divide-y divide-gray-100">
                  {" "}
                  {giderler.map((gider, index) => {
                    const toplam = Number(gider?.toplam ?? 0);
                    const dairePayi = Number(gider?.dairePayi ?? 0);
                    return (
                      <div
                        key={`${gider.giderTuru}-${index}`}
                        className="px-4 py-3 transition hover:bg-gray-50"
                      >
                        {" "}
                        <div className="flex items-start gap-3">
                          {" "}
                          {/* İkon */}{" "}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100">
                            {" "}
                            {getExpenseIcon(gider.giderTuru)}{" "}
                          </div>{" "}
                          {/* Bilgi */}{" "}
                          <div className="min-w-0 flex-1">
                            {" "}
                            <div className="flex items-start justify-between gap-3">
                              {" "}
                              <div className="min-w-0">
                                {" "}
                                <p className="font-medium text-gray-800">
                                  {" "}
                                  {gider.giderTuru}{" "}
                                </p>{" "}
                                {gider.aciklama && (
                                  <p
                                    className="mt-0.5 truncate text-xs text-gray-500"
                                    title={gider.aciklama}
                                  >
                                    {" "}
                                    {gider.aciklama}{" "}
                                  </p>
                                )}{" "}
                              </div>{" "}
                              <div className="shrink-0 text-right">
                                {" "}
                                <p className="font-semibold text-gray-900">
                                  {" "}
                                  {formatCurrency(dairePayi)}{" "}
                                </p>{" "}
                                {toplam > 0 && (
                                  <p className="text-xs text-gray-400">
                                    {" "}
                                    Toplam {formatCurrency(toplam)}{" "}
                                  </p>
                                )}{" "}
                              </div>{" "}
                            </div>{" "}
                            {/* Pay tipi */}{" "}
                            {gider.payTipi && (
                              <span
                                className={`mt-2 inline-block rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPayTypeClass(gider.payTipi)}`}
                              >
                                {" "}
                                {gider.payTipi}{" "}
                              </span>
                            )}{" "}
                          </div>{" "}
                        </div>{" "}
                      </div>
                    );
                  })}{" "}
                </div>{" "}
                {/* Toplam */}{" "}
                <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
                  {" "}
                  <div className="flex items-center justify-between">
                    {" "}
                    <span className="text-sm font-medium text-gray-600">
                      {" "}
                      Hesaplanan Aidat{" "}
                    </span>{" "}
                    <span className="text-lg font-bold text-gray-900">
                      {" "}
                      {formatCurrency(aidatVerisi.hesaplananAidat)}{" "}
                    </span>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
            {/* ================================================= HESAPLAMA BİLGİLERİ ================================================= */}{" "}
            {aidatVerisi.hesaplamaDetay?.hesaplamaNotlari && (
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                {" "}
                <h4 className="mb-3 font-semibold text-gray-800">
                  {" "}
                  ℹ️ Hesaplama Bilgileri{" "}
                </h4>{" "}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {" "}
                  <div>
                    {" "}
                    <p className="text-xs text-gray-500"> Asansör </p>{" "}
                    <p className="mt-1 font-medium text-gray-800">
                      {" "}
                      {aidatVerisi.hesaplamaDetay.hesaplamaNotlari
                        .asansorKullanimi
                        ? "Kullanıyor"
                        : "Kullanmıyor"}{" "}
                    </p>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs text-gray-500"> Kazan </p>{" "}
                    <p className="mt-1 font-medium text-gray-800">
                      {" "}
                      {aidatVerisi.hesaplamaDetay.hesaplamaNotlari.kazanGrubu
                        ? `Kazan ${aidatVerisi.hesaplamaDetay.hesaplamaNotlari.kazanGrubu}`
                        : "-"}{" "}
                    </p>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs text-gray-500"> Petek </p>{" "}
                    <p className="mt-1 font-medium text-gray-800">
                      {" "}
                      {aidatVerisi.hesaplamaDetay.hesaplamaNotlari
                        .petekOlcusu || "-"}{" "}
                    </p>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <p className="text-xs text-gray-500">
                      {" "}
                      Metrekare Payı{" "}
                    </p>{" "}
                    <p className="mt-1 font-medium text-gray-800">
                      {" "}
                      {aidatVerisi.hesaplamaDetay.hesaplamaNotlari
                        .metrekarePay || "-"}{" "}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
              </div>
            )}{" "}
          </>
        )}{" "}
        {/* ================================================= EMPTY ================================================= */}{" "}
        {!loading && !error && !aidatVerisi && (
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 text-center">
            {" "}
            <div className="text-3xl"> 💰 </div>{" "}
            <h4 className="mt-2 font-semibold text-blue-900">
              {" "}
              Aidat Verisi Yok{" "}
            </h4>{" "}
            <p className="mt-1 text-sm text-blue-700">
              {" "}
              Bu dönem için aidat hesaplama verisi bulunamadı.{" "}
            </p>{" "}
          </div>
        )}{" "}
      </div>{" "}
    </div>
  );
}
