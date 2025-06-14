import  { useEffect, useState, useMemo } from "react"
import Sidebar from "../components/Sidebar"
import ActiveSessionsList from "../components/verhuur/ActiveSessionsList"
import PastSessionsList from "../components/verhuur/PastSessionsList"
import NewLiveSessionModal from "../components/verhuur/NewLiveSessionModal"
import { getAllLiveSessions, getVerhuurperiodes } from "../api/verhuur"
import { getToursList } from "../api/tours"
import type { LiveSessionDto, VerhuurPeriode } from "../api/verhuur/types"
import type { TourListDto } from "../api/tours/types"

export default function Dashboard() {
  const [sessions, setSessions] = useState<LiveSessionDto[]>([])
  const [periodes, setPeriodes] = useState<VerhuurPeriode[]>([])
  const [tours, setTours] = useState<TourListDto[]>([])
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const [all, pds, tls] = await Promise.all([
        getAllLiveSessions(),
        getVerhuurperiodes(),
        getToursList(),
      ])
      setSessions(all)
      setPeriodes(pds)
      setTours(tls)
    })()
  }, [])

  const activeSessions = useMemo(
    () => sessions.filter((s) => s.isActive),
    [sessions]
  )
  const pastSessions = useMemo(
    () => sessions.filter((s) => !s.isActive),
    [sessions]
  )

  const handleEnd = (ended: LiveSessionDto) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === ended.id ? { ...s, isActive: false } : s
      )
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-auto pt-8 pb-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 text-center sm:text-left">
              Live huuractiviteiten
            </h1>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 sm:mt-0 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
            >
              + Nieuwe huuractiviteit
            </button>
          </div>

          <ActiveSessionsList
            sessions={activeSessions}
            onEnd={handleEnd}
          />

          <PastSessionsList sessions={pastSessions} />

          <NewLiveSessionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            periodes={periodes}
            tours={tours}
            activeSessions={activeSessions}
            onSuccess={(s) => {
              setSessions((prev) => [s, ...prev])
              setModalOpen(false)
            }}
          />
        </div>
      </main>
    </div>
)
}
