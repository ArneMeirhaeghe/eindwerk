// File: src/components/verhuur/PastSessionsList.tsx
import React, { useState, useMemo } from "react"
import { Link } from "react-router-dom"
import type { LiveSessionDto } from "../../api/verhuur/types"

interface PastSessionsListProps {
  sessions: LiveSessionDto[]
}

export default function PastSessionsList({
  sessions,
}: PastSessionsListProps) {
  const [search, setSearch] = useState("")

  const grouped = useMemo(() => {
    const map: Record<string, LiveSessionDto[]> = {}
    sessions.forEach((s) => {
      const month = new Date(s.startDate).toLocaleDateString("nl-BE", {
        year: "numeric",
        month: "long",
      })
      ;(map[month] ||= []).push(s)
    })
    return map
  }, [sessions])

  const filtered = useMemo(() => {
    if (!search) return grouped
    const term = search.toLowerCase()
    const result: typeof grouped = {}
    for (const [month, list] of Object.entries(grouped)) {
      const matches = list.filter(
        (s) =>
          s.groep.toLowerCase().includes(term) ||
          new Date(s.startDate)
            .toLocaleDateString("nl-BE")
            .includes(term)
      )
      if (matches.length) result[month] = matches
    }
    return result
  }, [search, grouped])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
        Afgelopen huuractiviteiten
      </h2>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="🔍 Zoek op groep of datum..."
          className="w-full max-w-md border-gray-300 rounded-lg px-4 py-2 focus:ring-blue-200 focus:border-blue-300"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {Object.keys(filtered).length === 0 ? (
        <p className="text-center text-gray-500 italic">Geen resultaten gevonden.</p>
      ) : (
        Object.entries(filtered).map(([month, list]) => (
          <details
            key={month}
            className="mb-6 bg-white rounded-lg shadow-md overflow-hidden"
          >
            <summary className="px-6 py-3 font-medium bg-blue-50 hover:bg-blue-100 cursor-pointer text-center">
              {month} ({list.length})
            </summary>
            <ul className="divide-y">
              {list.map((s) => (
                <li
                  key={s.id}
                  className="p-4 flex flex-col sm:flex-row justify-between items-center"
                >
                  <div className="text-center sm:text-left">
                    <p className="font-medium text-gray-800">{s.groep}</p>
                    <p className="text-xs text-gray-500">{s.tourName}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(s.startDate).toLocaleDateString("nl-BE")} –{" "}
                      {new Date(s.vertrek).toLocaleDateString("nl-BE")}
                    </p>
                  </div>
                  <Link
                    to={`/sessions/${s.id}/responses`}
                    className="mt-2 sm:mt-0 text-blue-600 hover:underline"
                  >
                    Bekijk →
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))
      )}
    </section>
  )
}
