import  { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  getToursList,
  createTour,
  deleteTour,
  updateTourNaam,
  addSection,
} from "../api/tours"
import type { TourListDto } from "../api/tours/types"
import {
  FaMapMarkedAlt,
  FaTag,
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa"

export default function ToursPage() {
  const [tours, setTours] = useState<TourListDto[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [newNaam, setNewNaam] = useState("")
  const fases = ["voor", "aankomst", "terwijl", "vertrek", "na"] as const

  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await getToursList()
      setTours(data.reverse())
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
      await Promise.all(fases.map(f => addSection(created.id, f, "Nieuwe sectie")))
      setNewNaam("")
      setModalOpen(false)
      fetchTours()
    } finally {
      setLoading(false)
    }
  }

  const handleRename = async (id: string, currentNaam: string) => {
    const nieuweNaam = prompt("Nieuwe naam locatie:", currentNaam) ?? ""
    if (!nieuweNaam.trim() || nieuweNaam === currentNaam) return
    setLoading(true)
    try {
      await updateTourNaam(id, nieuweNaam.trim())
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

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <h2 className="text-4xl font-extrabold text-gray-800 text-center mb-8">
        Rondleidingen beheren
      </h2>

      {/* Knop om modal te openen */}
      <div className="text-center mb-12">
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow hover:bg-blue-700 transition"
        >
          <FaPlus /> Nieuwe tour
        </button>
      </div>

      {/* Modal voor nieuwe tour */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h3 className="text-xl font-semibold text-gray-800">Nieuwe tour</h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                &times;
              </button>
            </div>
            {/* Body */}
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Naam locatie
              </label>
              <input
                type="text"
                value={newNaam}
                onChange={(e) => setNewNaam(e.target.value)}
                disabled={loading}
                placeholder="Vul naam in."
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-200 focus:border-blue-300 transition"
              />
            </div>
            {/* Footer */}
            <div className="flex justify-end gap-4 px-6 py-4 border-t">
              <button
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Annuleren
              </button>
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? "Bezig..." : "Maak tour"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tours grid */}
      {loading && tours.length === 0 ? (
        <div className="text-center text-gray-500">Laden…</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="relative flex flex-col bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-1 transition"
            >
              {/* Actieknoppen */}
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleRename(tour.id, tour.naamLocatie)}
                  disabled={loading}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <FaEdit className="text-gray-600" />
                </button>
                <button
                  onClick={() => handleDelete(tour.id)}
                  disabled={loading}
                  className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
                >
                  <FaTrash className="text-red-600" />
                </button>
              </div>

              {/* Inhoud */}
              <div className="flex flex-col items-center mb-6">
                <FaMapMarkedAlt className="text-5xl text-blue-500 mb-4" />
                <h3 className="text-2xl font-semibold text-gray-800 truncate">
                  {tour.naamLocatie}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                  <FaTag /> {tour.id}
                </p>
              </div>

              {/* Bewerken-knop */}
              <Link
                to={`/tours/${tour.id}/builder`}
                className="mt-auto block bg-green-600 text-white font-medium text-center py-3 rounded-lg hover:bg-green-700 transition"
              >
                <FaEdit className="inline mr-2" /> Bewerken
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
)
}
