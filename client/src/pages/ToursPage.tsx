// File: src/pages/ToursPage.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getTours,
  createTour,
  deleteTour,
  updateTourNaam,
  addSection,
  type TourListDto,
} from "../api/tours";

const ToursPage = () => {
  const [tours, setTours] = useState<TourListDto[]>([]);
  const [newNaam, setNewNaam] = useState("");
  const [loading, setLoading] = useState(false);
  const fases = ["voor", "aankomst", "terwijl", "vertrek", "na"] as const;

  // Haal tours vanaf API
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

  // Maak nieuwe tour aan met per fase één sectie
  const handleCreate = async () => {
    if (!newNaam.trim()) return;
    setLoading(true);
    try {
      const created = await createTour(newNaam.trim());
      // Voeg in elke fase één section toe
      await Promise.all(
        fases.map((fase) =>
          addSection(created.id, fase, "Nieuwe sectie")
        )
      );
      setNewNaam("");
      fetchTours();
    } finally {
      setLoading(false);
    }
  };

  // Verwijder tour na bevestiging
  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze tour wilt verwijderen?")) return;
    setLoading(true);
    try {
      await deleteTour(id);
      fetchTours();
    } finally {
      setLoading(false);
    }
  };

  // Hernoem tour via prompt
  const handleRename = async (id: string, currentNaam: string) => {
    const nieuweNaam = prompt("Nieuwe naam locatie:", currentNaam) ?? "";
    if (!nieuweNaam.trim() || nieuweNaam.trim() === currentNaam) return;
    setLoading(true);
    try {
      await updateTourNaam(id, nieuweNaam.trim());
      fetchTours();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Tours beheren</h2>

      {/* Input + knop om tour aan te maken */}
      <div className="mb-4 flex gap-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={newNaam}
          onChange={(e) => setNewNaam(e.target.value)}
          placeholder="Naam locatie"
        />
        <button
          className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
          disabled={loading}
          onClick={handleCreate}
        >
          Toevoegen
        </button>
      </div>

      {loading && tours.length === 0 ? (
        <div>Laden…</div>
      ) : (
        <ul className="space-y-2">
          {tours.map((tour) => (
            <li
              key={tour.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div className="flex flex-col">
                <Link
                  to={`/tours/${tour.id}`}
                  className="text-blue-600 hover:underline text-lg"
                >
                  {tour.naamLocatie}
                </Link>
                <span className="text-xs text-gray-500">ID: {tour.id}</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                  onClick={() => handleRename(tour.id, tour.naamLocatie)}
                  disabled={loading}
                >
                  Hernoemen
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => handleDelete(tour.id)}
                  disabled={loading}
                >
                  Verwijderen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ToursPage;
