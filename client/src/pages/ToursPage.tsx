// File: src/pages/ToursPage.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  getToursList,
  createTour,
  deleteTour,
  updateTourNaam,
  addSection
} from "../api/tours"
import type { TourListDto } from "../api/tours/types"

const ToursPage: React.FC = () => {
  const [tours, setTours] = useState<TourListDto[]>([])
  const [newNaam, setNewNaam] = useState("")
  const [loading, setLoading] = useState(false)
  const fases = ["voor", "aankomst", "terwijl", "vertrek", "na"] as const

  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await getToursList()
      setTours(data.reverse()) // Laatste bovenaan
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  const handleCreate = async () => {
    if (!newNaam.trim()) return
    setLoading(true)
    try {
      const created = await createTour(newNaam.trim())
      await Promise.all(
        fases.map((fase) => addSection(created.id, fase, "Nieuwe sectie"))
      )
      setNewNaam("")
      fetchTours()
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Weet je zeker dat je deze tour wilt verwijderen?")) return
    setLoading(true)
    try {
      await deleteTour(id)
      fetchTours()
    } finally {
      setLoading(false)
    }
  }

  const handleRename = async (id: string, currentNaam: string) => {
    const nieuweNaam = prompt("Nieuwe naam locatie:", currentNaam) ?? ""
    if (!nieuweNaam.trim() || nieuweNaam.trim() === currentNaam) return
    setLoading(true)
    try {
      await updateTourNaam(id, nieuweNaam.trim())
      fetchTours()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Rondleidingen beheren</h2>

      {/* Nieuwe tour maken */}
      <div className="flex items-center gap-2 mb-6">
        <input
          className="flex-1 border px-3 py-2 rounded text-sm"
          value={newNaam}
          onChange={(e) => setNewNaam(e.target.value)}
          placeholder="Naam locatie"
        />
        <button
          onClick={handleCreate}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          + Nieuwe tour
        </button>
      </div>

      {loading && tours.length === 0 ? (
        <div>Laden…</div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="bg-white border rounded-xl shadow p-4 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <h3 className="text-lg font-semibold text-blue-600 truncate mb-1">
                  {tour.naamLocatie}
                </h3>
                <p className="text-xs text-gray-400 break-all mb-2">ID: {tour.id}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                <Link
                  to={`/tours/${tour.id}/builder`}
                  className="flex-1 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 text-center"
                >
                  Bewerken
                </Link>
                <button
                  onClick={() => handleRename(tour.id, tour.naamLocatie)}
                  className="text-yellow-600 hover:underline text-sm"
                  disabled={loading}
                >
                  Naam
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  className="text-red-600 hover:underline text-sm"
                  disabled={loading}
                >
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ToursPage
