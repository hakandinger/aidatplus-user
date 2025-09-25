import { useState, useEffect } from "react";
import GenelAciklamalarKarti from "./GenelAciklamalarKarti";

export default function GenelAciklamalarContainer() {
  const [genelAciklamalar, setGenelAciklamalar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/aciklama/genel-aciklama");
        const json = await res.json();

        if (json.success) {
          setGenelAciklamalar(json.data);
        } else {
          setError(data.message || "Açıklama yüklenemedi");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>⏳ Yükleniyor...</p>;
  if (error) return <p className="text-red-500">Hata: {error}</p>;

  return <GenelAciklamalarKarti genelAciklamalar={genelAciklamalar} />;
}
