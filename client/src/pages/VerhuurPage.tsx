// src/pages/VerhuurPage.tsx

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ClipboardCopy } from "lucide-react"
import API from "../api/axios"
import { getTours, type TourListDto } from "../api/tours"

type VerhuurPeriode = {
  groep: string
  verantwoordelijke: {
    naam: string
    tel: string
    mail: string
  }
  aankomst: string
  vertrek: string
  tourId?: string
}

type LiveSession = {
  id: string
  groep: string
  tourId: string
  startDate: string
  isActive: boolean
}

const VerhuurPage = () => {
  const [sessies, setSessies] = useState<VerhuurPeriode[]>([])
  const [tours, setTours] = useState<TourListDto[]>([])
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // haal verhuurperiodes op van eigen API
  const fetchSessies = async () => {
    setLoading(true)
    try {
      const res = await API.get<VerhuurPeriode[]>("/api/Verhuurperiodes")
      setSessies(res.data)
    } finally {
      setLoading(false)
    }
  }

  // haal beschikbare tours op
  const fetchTours = async () => {
    try {
      const data = await getTours()
      setTours(data)
    } catch (err: any) {
      console.error("Kan tours niet laden:", err)
    }
  }

  // update geselecteerde tour via eigen API
  const handleTourChange = async (groep: string, tourId: string) => {
    try {
      await API.patch(`/api/Verhuurperiodes/${groep}`, { tourId })
      fetchSessies()
    } catch (err: any) {
      console.error("Kan tour niet opslaan:", err)
    }
  }

  // trigger start van live-sessies voor aankomst binnen 2 weken
  const triggerCheckStart = async () => {
    try {
      await API.get("/api/LiveSession/check-start")
      fetchLiveSessions()
    } catch (err: any) {
      console.error("Check-start fout:", err)
    }
  }

  // haal actieve live-sessies op
  const fetchLiveSessions = async () => {
    try {
      const res = await API.get<LiveSession[]>("/api/LiveSession/active")
      setLiveSessions(res.data)
    } catch (err: any) {
      console.error("Kan live-sessies niet laden:", err)
    }
  }

  // start sessie bij kopiëren van link
  const copyLink = async (s: VerhuurPeriode) => {
    if (s.tourId) {
      try {
        await API.post("/api/LiveSession/start", {
          groep: s.groep,
          tourId: s.tourId,
        })
        fetchLiveSessions()
      } catch (err: any) {
        console.error("Kan live-sessie niet starten:", err)
      }
    }
    const link = `${window.location.origin}/sessie/${s.groep
      .toLowerCase()
      .replace(/\s+/g, "-")}`
    navigator.clipboard.writeText(link)
    alert("Link gekopieerd!")
  }

  useEffect(() => {
    fetchSessies()
    fetchTours()
    triggerCheckStart()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Verhuur Overzicht</h1>
      <button
        onClick={() => {
          fetchSessies()
          fetchLiveSessions()
        }}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Herlaad data
      </button>

      <table className="w-full border shadow rounded mb-8">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Groep</th>
            <th className="p-2">Tour</th>
            <th className="p-2">Verantwoordelijke</th>
            <th className="p-2">Aankomst</th>
            <th className="p-2">Vertrek</th>
            <th className="p-2">Acties</th>
          </tr>
        </thead>
        <tbody>
          {sessies.map((s) => (
            <tr key={s.groep} className="border-t">
              <td
                className="p-2 text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  navigate(
                    `/groep/${s.groep.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
              >
                {s.groep}
              </td>
              <td className="p-2">
                <select
                  value={s.tourId || ""}
                  onChange={(e) => handleTourChange(s.groep, e.target.value)}
                  className="border px-2 py-1 rounded"
                >
                  <option value="">— kies tour —</option>
                  {tours.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.naamLocatie}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-2">{s.verantwoordelijke.naam}</td>
              <td className="p-2">{new Date(s.aankomst).toLocaleString()}</td>
              <td className="p-2">{new Date(s.vertrek).toLocaleString()}</td>
              <td className="p-2">
                <button onClick={() => copyLink(s)}>
                  <ClipboardCopy size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="text-xl font-semibold mb-2">Actieve Live Sessies</h2>
      {liveSessions.length === 0 ? (
        <div className="text-gray-500">Geen live sessies</div>
      ) : (
        <ul className="space-y-2">
          {liveSessions.map((ls) => (
            <li
              key={ls.id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-semibold">{ls.groep}</div>
                <div className="text-sm text-gray-600">
                  Start: {new Date(ls.startDate).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(
                    `/groep/${ls.groep.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
                className="text-blue-600 hover:underline"
              >
                Bekijk sessie
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && <div className="mt-4 text-sm text-gray-500">Loading…</div>}
    </div>
  )
}

export default VerhuurPage
