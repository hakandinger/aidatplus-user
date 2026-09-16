import { useCallback, useState } from "react";
import { getCurrentPeriod } from "../utils/dateUtils";

export const useBlokGiderleri = (blokHarfi) => {
  const [blokVerisi, setBlokVerisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getirBlokGiderleri = useCallback(async () => {
    if (!blokHarfi) return;

    setLoading(true);
    setError("");

    try {
      const period = getCurrentPeriod();

      const response = await fetch(
        `/api/kompleks/blok-gider-ozeti?blokHarfi=${encodeURIComponent(
          blokHarfi
        )}&period=${encodeURIComponent(period)}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Blok gider bilgileri alınamadı"
        );
      }

      setBlokVerisi(result.data);
    } catch (err) {
      console.error(
        "Blok giderleri alınamadı:",
        err
      );

      setBlokVerisi(null);

      setError(
        err.message ||
          "Blok gider bilgileri alınırken hata oluştu"
      );
    } finally {
      setLoading(false);
    }
  }, [blokHarfi]);

  return {
    blokVerisi,
    loading,
    error,
    getirBlokGiderleri,
  };
};