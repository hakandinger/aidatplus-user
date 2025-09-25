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
      const response = await fetch("/api/aidat/hesaplamali-detay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blokHarfi, period: getCurrentPeriod() }),
      });

      const result = await response.json();

      if (result.success) setAidatVerisi(result.data);
      else setError(result.message || "Aidat hesaplanamadı");
    } catch (err) {
      console.error("Aidat hesaplama hatası:", err);
      setError("Bu ay için henüz gider verisi girilmemiş");
    } finally {
      setLoading(false);
    }
  }, [blokHarfi]);

  return { aidatVerisi, loading, error, hesaplaAidat };
};
