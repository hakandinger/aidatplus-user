// utils/dateUtils.js

/**
 * Mevcut dönemi döner.
 * Örnek format: "2025-09" (YYYY-MM)
 */
export function getCurrentPeriod() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // 0-11 olduğu için +1
  return `${year}-${month}`;
}

/**
 * Opsiyonel: Belirli bir tarih için dönemi döner
 * @param {Date|string} date
 * @returns string YYYY-MM
 */
export function getPeriodFromDate(date) {
  const d = date instanceof Date ? date : new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}
