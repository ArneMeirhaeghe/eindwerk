// src/pages/SessiePage.tsx

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
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

const SessiePage = () => {
  const { slug } = useParams<{ slug: string }>()
  const [sessie, setSessie] = useState<VerhuurPeriode | null>(null)
  const [tour, setTour] = useState<TourListDto | null>(null)
  const [loading, setLoading] = useState(true)

  // haal sessie-data en gekoppelde tour op
  const fetchSessie = async () => {
    try {
      const res = await API.get<VerhuurPeriode>(
        `/fakeapi/verhuurperiodes/${slug}`
      )
      const data = res.data
      setSessie(data)
      if (data.tourId) {
        const allTours = await getTours()
        const found = allTours.find((t) => t.id === data.tourId) || null
        setTour(found)
      }
    } catch (err: any) {
      console.error("Kan sessie niet laden:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSessie()
  }, [slug])

  if (loading) {
    return <div className="p-6">Loading…</div>
  }
  if (!sessie) {
    return <div className="p-6">Sessie niet gevonden</div>
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Groep: {sessie.groep}</h1>
      <div className="mb-2">
        <span className="font-semibold">Verantwoordelijke:</span>{" "}
        {sessie.verantwoordelijke.naam} ({sessie.verantwoordelijke.tel},{" "}
        {sessie.verantwoordelijke.mail})
      </div>
      <div className="mb-2">
        <span className="font-semibold">Aankomst:</span>{" "}
        {new Date(sessie.aankomst).toLocaleString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Vertrek:</span>{" "}
        {new Date(sessie.vertrek).toLocaleString()}
      </div>
      <div>
        <span className="font-semibold">Gekoppelde Tour:</span>{" "}
        {tour ? (
          <Link
            to={`/tours/${tour.id}/builder`}
            className="text-blue-600 hover:underline"
          >
            {tour.naamLocatie}
          </Link>
        ) : (
          <span>Geen tour geselecteerd</span>
        )}
      </div>
    </div>
  )
}

export default SessiePage
