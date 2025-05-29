// src/pages/Dashboard.tsx

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getTours, type TourListDto } from '../api/tours'

// Typedef voor dashboard-kaarten
interface Card {
  label: string
  to: string
}

const Dashboard: React.FC = () => {
  const { role } = useAuth()                       // haal rol uit context
  const isAdmin = role === 'Admin'                 // bepaal admin-status

  const [tours, setTours] = useState<TourListDto[]>([])   // tours state
  const [loading, setLoading] = useState(false)          // laad-status

  // haal tours op bij mount
  const fetchTours = async () => {
    setLoading(true)
    try {
      const data = await getTours()
      setTours(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTours()
  }, [])

  // definieer kaarten; voeg gebruikersbeheer toe voor admins
  const cards: Card[] = [
    { label: 'Tours', to: '/tours' },
    { label: 'Inventory Manager', to: '/inventory' },
    { label: 'Upload Zone', to: '/upload-zone' },
    { label: 'Verhuur Overzicht', to: '/verhuur' },
    { label: 'Form Builder', to: '/formbuilder' },
    ...(isAdmin ? [{ label: 'Gebruikersbeheer', to: '/users' }] : [])
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Pagina-titel */}
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
      </h1>

      {/* Kaarten-grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <div
            key={card.to}
            className="bg-white border border-gray-200 rounded-xl p-6 shadow hover:shadow-lg transition"
          >
            {/* Hoofd-link */}
            <Link
              to={card.to}
              className="block text-lg font-semibold text-gray-800 hover:underline"
            >
              {card.label}
            </Link>

            {/* Voor Tours: klein overzicht met directe links naar builder */}
            {card.to === '/tours' && (
              <div className="mt-3 space-y-1">
                {loading ? (
                  <div className="text-sm text-gray-500">Loading…</div>
                ) : (
                  tours.slice(0, 3).map(tour => (
                    <Link
                      key={tour.id}
                      to={`/tours/${tour.id}/builder`}         // verwijst naar builder-pagina
                      className="block text-sm text-blue-600 hover:underline"
                    >
                      {tour.naamLocatie}
                    </Link>
                  ))
                )}
                {/* Link naar volledige tours-pagina */}
                {!loading && tours.length > 3 && (
                  <Link
                    to="/tours"
                    className="text-xs text-gray-500 hover:underline"
                  >
                    Alle tours bekijken…
                  </Link>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard
