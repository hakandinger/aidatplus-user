export const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString("tr-TR", {
    style: "currency",
    currency: "TRY",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const getExpenseIcon = (giderTuru = "") => {
  const value = giderTuru.toLocaleLowerCase("tr-TR");

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

export const getPayTypeClass = (payTipi = "") => {
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