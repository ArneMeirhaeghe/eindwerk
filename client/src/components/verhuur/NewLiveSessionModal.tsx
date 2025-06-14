// File: src/components/verhuur/NewLiveSessionModal.tsx
import  { useState, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { startLiveSession } from "../../api/verhuur"
import type {
  VerhuurPeriode,
  StartSessionDto,
  LiveSessionDto,
} from "../../api/verhuur/types"
import type { Tour, TourListDto, SectionDto } from "../../api/tours/types"
import { getTour } from "../../api/tours"

interface NewLiveSessionModalProps {
  isOpen: boolean
  onClose: () => void
  periodes: VerhuurPeriode[]
  tours: TourListDto[]
  activeSessions: LiveSessionDto[]
  onSuccess: (session: LiveSessionDto) => void
}

export default function NewLiveSessionModal({
  isOpen,
  onClose,
  periodes,
  tours,
  activeSessions,
  onSuccess,
}: NewLiveSessionModalProps) {
  const navigate = useNavigate()
  const [selectedPeriode, setSelectedPeriode] = useState<VerhuurPeriode | null>(null)
  const [tourId, setTourId] = useState<string>("")
  const [tourDetail, setTourDetail] = useState<Tour | null>(null)
  const [sections, setSections] = useState<string[]>([])
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState("")

  // filter beschikbare periodes
  const availablePeriodes = useMemo(() => {
    const used = new Set(activeSessions.map((s) => s.groep))
    return periodes.filter((p) => !used.has(p.groep))
  }, [periodes, activeSessions])

  // haal tour details als tourId verandert
  useEffect(() => {
    if (!tourId) {
      setTourDetail(null)
      setSections([])
      return
    }
    getTour(tourId).then((tour) => {
      setTourDetail(tour)
      setSections(Object.values(tour.fases).flat().map((s) => s.id))
    })
  }, [tourId])

  // toggle alle secties selecteren/deselecteren
  const toggleAll = () => {
    if (!tourDetail) return
    const allIds = Object.values(tourDetail.fases).flat().map((s) => s.id)
    setSections((prev) =>
      prev.length === allIds.length ? [] : allIds
    )
  }

  // start nieuwe sessie
  const start = async () => {
    if (!selectedPeriode || !tourDetail || sections.length === 0) {
      setError("Kies periode, tour en minstens één sectie")
      return
    }
    setCreating(true)
    setError("")
    try {
      const dto: StartSessionDto = {
        verhuurderId: selectedPeriode.verhuurderId,
        groep: selectedPeriode.groep,
        verantwoordelijkeNaam: selectedPeriode.verantwoordelijke.naam,
        verantwoordelijkeTel: selectedPeriode.verantwoordelijke.tel,
        verantwoordelijkeMail: selectedPeriode.verantwoordelijke.mail,
        aankomst: selectedPeriode.aankomst,
        vertrek: selectedPeriode.vertrek,
        tourId,
        tourName: tours.find((t) => t.id === tourId)?.naamLocatie || "",
        sectionIds: sections,
      }
      const session = await startLiveSession(selectedPeriode, tourId, dto.tourName, sections)
      onSuccess(session)
      navigate("/")  // na starten terug naar dashboard
    } catch {
      setError("Kon niet starten")
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-lg shadow-xl overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 text-center">
          <h2 className="text-white text-xl font-semibold">
            Nieuwe live huuractiviteit
          </h2>
        </header>
        <div className="p-6 space-y-4">
          <div className="space-y-4">
            <select
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
              value={selectedPeriode?.id || ""}
              onChange={(e) =>
                setSelectedPeriode(
                  availablePeriodes.find((p) => p.id === e.target.value) || null
                )
              }
            >
              <option value="">Kies periode</option>
              {availablePeriodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.groep} ({p.aankomst})
                </option>
              ))}
            </select>
            <select
              className="w-full border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
              value={tourId}
              onChange={(e) => setTourId(e.target.value)}
            >
              <option value="">Kies tour</option>
              {tours.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.naamLocatie}
                </option>
              ))}
            </select>
          </div>
          {tourDetail && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Secties</span>
                <button
                  onClick={toggleAll}
                  className="text-blue-600 hover:underline text-sm"
                >
                  {sections.length ===
                  Object.values(tourDetail.fases).flat().length
                    ? "Deselecteer alles"
                    : "Selecteer alles"}
                </button>
              </div>
              <div className="border border-gray-200 rounded-lg p-3 max-h-56 overflow-y-auto space-y-2">
                {Object.entries(tourDetail.fases).map(([fase, secs]) => (
                  <div key={fase}>
                    <p className="font-medium text-gray-600">{fase}</p>
                    <div className="ml-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(secs as SectionDto[]).map((sec) => (
                        <label key={sec.id} className="flex items-center text-sm">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={sections.includes(sec.id)}
                            onChange={(e) =>
                              setSections((prev) =>
                                e.target.checked
                                  ? [...prev, sec.id]
                                  : prev.filter((id) => id !== sec.id)
                              )
                            }
                          />
                          {sec.naam}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        </div>
        <footer className="flex flex-col sm:flex-row justify-center sm:justify-end gap-4 bg-gray-50 p-4">
          <button
            onClick={onClose}
            className="text-gray-600 hover:underline"
          >
            Annuleren
          </button>
          <button
            onClick={start}
            disabled={creating}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          >
            {creating ? "Bezig…" : "Start activiteit"}
          </button>
        </footer>
      </div>
    </div>
  )
}
