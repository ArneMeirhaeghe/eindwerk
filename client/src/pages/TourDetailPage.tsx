// File: src/pages/TourDetailPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Tour } from "../api/tours/types";
import { getTour } from "../api/tours";

export default function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Geen valide tour-ID");
      setLoading(false);
      return;
    }
    setLoading(true);
    getTour(id)
      .then((data) => {
        setTour(data);
        setError(null);
      })
      .catch((err) => {
        console.error("Fout bij ophalen tour:", err);
        setError(
          err.response?.status === 404
            ? "Tour niet gevonden"
            : "Er is iets misgegaan bij het laden"
        );
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">Laden…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!tour) return <div className="p-6">Geen tour data</div>;

  return (
    <div className="p-6 space-y-4">
      <button
        onClick={() => navigate('/tours')}
        className="text-sm text-gray-600 hover:underline"
      >
        &larr; Terug naar overzicht
      </button>

      <h1 className="text-2xl font-bold">{tour.naamLocatie}</h1>
      <div className="text-xs text-gray-500">ID: {tour.id}</div>

      <section>
        <h2 className="text-xl font-semibold mb-2">Raw JSON-data</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(tour, null, 2)}
        </pre>
      </section>
    </div>
  );
}
