// File: src/components/ActiveSessionsTable.tsx
import React from "react"
import { Link } from "react-router-dom"
import type { LiveSessionDto } from "../../api/verhuur"

interface ActiveSessionsTableProps {
  sessions: LiveSessionDto[]
}

export default function ActiveSessionsTable({
  sessions,
}: ActiveSessionsTableProps) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">Groep</th>
            <th className="p-2 border-b text-left">Tour ID</th>
            <th className="p-2 border-b text-left">Tour Naam</th>
            <th className="p-2 border-b text-left">Startdatum</th>
            <th className="p-2 border-b text-left">Actief</th>
            <th className="p-2 border-b text-left">Details</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session.id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{session.groep}</td>
              <td className="p-2 border-b">{session.tourId || "-"}</td>
              <td className="p-2 border-b">{session.tourNaam || "-"}</td>
              <td className="p-2 border-b">
                {new Date(session.startDate).toLocaleString()}
              </td>
              <td className="p-2 border-b">{session.isActive ? "Ja" : "Nee"}</td>
              <td className="p-2 border-b">
                <Link
                  to={`/livesession/${session.id}`}
                  className="text-blue-600 hover:underline"
                >
                  Bekijk JSON
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
