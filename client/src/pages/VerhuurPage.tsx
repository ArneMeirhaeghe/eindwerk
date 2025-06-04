// File: src/pages/VerhuurPage.tsx
import { useEffect, useState } from "react"
import {
  getActiveLiveSessions,
  getToursList,
  getVerhuurperiodes,
  startLiveSession,
  type VerhuurPeriode,
  type LiveSessionDto,
} from "../api/verhuur"
import type { TourListDto } from "../api/tours"

import ErrorMessage from "../components/ErrorMessage"
import LoadingIndicator from "../components/LoadingIndicator"
import VerhuurTable from "../components/livesessie/VerhuurTable"
import ActiveSessionsTable from "../components/livesessie/ActiveSessionsTable"

export default function VerhuurPage() {
  const [verhuur, setVerhuur] = useState<VerhuurPeriode[]>([])
  const [tours, setTours] = useState<TourListDto[]>([])
  const [liveSessions, setLiveSessions] = useState<LiveSessionDto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>("")

  // Haal verhuurperiodes op
  const fetchVerhuurperiodes = async () => {
    setLoading(true)
    setError("")
    try {
      const periodes = await getVerhuurperiodes()
      setVerhuur(periodes)
    } catch (err: any) {
      console.error("Kan verhuurperiodes niet laden:", err)
      setError("Kan verhuurperiodes niet laden")
    } finally {
      setLoading(false)
    }
  }

  // Haal tours op
  const fetchTours = async () => {
    try {
      const lijst = await getToursList()
      setTours(lijst)
    } catch (err: any) {
      console.error("Kan tours niet laden:", err)
    }
  }

  // Haal actieve live-sessies op
  const fetchLiveSessions = async () => {
    try {
      const sessies = await getActiveLiveSessions()
      setLiveSessions(sessies)
    } catch (err: any) {
      console.error("Kan live-sessies niet laden:", err)
      setError("Kan live-sessies niet laden")
    }
  }

  // Start live-sessie
  const handleTourSelect = async (groep: string, tourId: string) => {
    try {
      await startLiveSession(groep, tourId)
      await fetchLiveSessions()
    } catch (err: any) {
      console.error("Kan live-sessie niet starten:", err)
      if (err.response?.data?.message) {
        alert("Fout vanuit server: " + err.response.data.message)
      } else {
        alert("Er ging iets mis bij het starten van de live-sessie.")
      }
    }
  }

  useEffect(() => {
    fetchVerhuurperiodes()
    fetchTours()
    fetchLiveSessions()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Verhuur Overzicht</h1>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      {!loading && !error && verhuur.length > 0 && (
        <VerhuurTable
          periodes={verhuur}
          tours={tours}
          onSelectTour={handleTourSelect}
        />
      )}

      {!loading && !error && verhuur.length === 0 && (
        <div className="text-gray-500 mb-8">Geen verhuurperiodes gevonden.</div>
      )}

      <h2 className="text-xl font-semibold mb-4">Actieve Live Sessies</h2>
      {!loading && !error && liveSessions.length === 0 && (
        <div className="text-gray-500">Geen live sessies</div>
      )}
      {!loading && !error && liveSessions.length > 0 && (
        <ActiveSessionsTable sessions={liveSessions} />
      )}
    </div>
  )
}
