// File: src/components/verhuur/ActiveSessionsList.tsx
import React from "react"
import type { LiveSessionDto } from "../../api/verhuur/types"
import SessionCard from "./SessionCard"

interface ActiveSessionsListProps {
  sessions: LiveSessionDto[]
  onEnd: (session: LiveSessionDto) => void
}

export default function ActiveSessionsList({
  sessions,
  onEnd,
}: ActiveSessionsListProps) {
  // toon melding als geen actieve sessies
  if (sessions.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-gray-500 italic">
        Geen lopende huuractiviteiten.
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 mb-12">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Actieve huuractiviteiten
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <SessionCard
            key={session.id}
            session={session}
            onEnd={onEnd}
          />
        ))}
      </div>
    </section>
  )
}
