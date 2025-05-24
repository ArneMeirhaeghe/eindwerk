// src/pages/ToursPage.tsx

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTours,
  createTour,
  deleteTour,
  type TourListDto,
  
} from "../api/tours";

const ToursPage = () => {
  const [tours, setTours] = useState<TourListDto[]>([]);
  const [newNaam, setNewNaam] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await getTours();
      setTours(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTours();
  }, []);

  const handleCreate = async () => {
    if (!newNaam.trim()) return;
    await createTour(newNaam);
    setNewNaam("");
    fetchTours();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker?")) return;
    await deleteTour(id);
    fetchTours();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tours beheren</h2>

      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={newNaam}
          onChange={(e) => setNewNaam(e.target.value)}
          placeholder="Naam locatie"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded"
          disabled={loading}
          onClick={handleCreate}
        >
          Toevoegen
        </button>
      </div>

      {loading && tours.length === 0 ? (
        <div>Loading…</div>
      ) : (
        <ul className="space-y-2">
          {tours.map((tour) => (
            <li key={tour.id} className="border p-3 rounded">
              <div className="flex justify-between items-center">
                {/* Navigeer naar detail */}
                <Link
                  to={`/tours/${tour.id}`}
                  className="text-blue-600 hover:underline text-lg"
                >
                  {tour.naamLocatie}
                </Link>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(tour.id)}
                >
                  Verwijderen
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-1">ID: {tour.id}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToursPage;
