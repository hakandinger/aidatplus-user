import { useState, useCallback } from "react";
import { getCurrentPeriod } from "../utils/dateUtils";

export const useAidat = (blokHarfi) => {
  const [aidatVerisi, setAidatVerisi] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const hesaplaAidat = useCallback(async () => {
    if (!blokHarfi) return;

    setLoading(true);
    setError("");

    try {
      const period = getCurrentPeriod();

      const response = await fetch(
        "/api/aidat/hesaplamali-detay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blokHarfi,
            period,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Aidat bilgisi alınamadı"
        );
      }

      setAidatVerisi(result.data);

    } catch (err) {
      console.error("Aidat hesaplama hatası:", err);

      setAidatVerisi(null);

      setError(
        err.message ||
        "Bu ay için henüz gider verisi girilmemiş"
      );

    } finally {
      setLoading(false);
    }
  }, [blokHarfi]);

  return {
    aidatVerisi,
    loading,
    error,
    hesaplaAidat,
  };
};