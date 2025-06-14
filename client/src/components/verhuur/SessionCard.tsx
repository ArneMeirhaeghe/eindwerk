// File: src/components/verhuur/SessionCard.tsx
import { Link } from "react-router-dom"
import { endLiveSession } from "../../api/liveSession"
import type { LiveSessionDto } from "../../api/verhuur/types"

interface SessionCardProps {
  session: LiveSessionDto
  onEnd: (session: LiveSessionDto) => void
}

export default function SessionCard({
  session,
  onEnd,
}: SessionCardProps) {
  const now = new Date()
  const start = new Date(session.startDate)
  const end = new Date(session.vertrek)

  const isSameDay = (d1: Date, d2: Date) =>
    d1.toDateString() === d2.toDateString()

  let phase: "voor" | "terwijl" | "vertrek" | "na"
  if (now < start) phase = "voor"
  else if (now >= start && now < end && !isSameDay(now, end))
    phase = "terwijl"
  else if (isSameDay(now, end)) phase = "vertrek"
  else phase = "na"

  const formatDate = (d: Date) =>
    d.toLocaleString("nl-BE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  const phaseInfo = {
    voor: { label: "⏳ Voor aankomst", color: "border-l-yellow-400" },
    terwijl: { label: "🟢 Tijdens verblijf", color: "border-l-green-500" },
    vertrek: { label: "🟠 Dag van vertrek", color: "border-l-orange-500" },
    na: { label: "✅ Afgerond", color: "border-l-gray-400" },
  } as const

  const copyToClipboard = (text: string) =>
    navigator.clipboard.writeText(text).catch(() => {})

  const handleEnd = async () => {
    if (!confirm("Beëindig deze huuractiviteit?")) return
    await endLiveSession(session.id)
    onEnd(session)
  }

  return (
    <div
      className={`flex flex-col items-center text-center bg-white rounded-xl shadow-lg p-6 border-l-4 ${phaseInfo[phase].color} hover:shadow-2xl transition`}
    >
      <h3 className="text-xl font-bold text-gray-800 mb-2">{session.groep}</h3>
      <p className="text-sm text-gray-500 mb-4">{session.tourName}</p>
      <div className="text-gray-600 text-sm space-y-1 mb-4">
        <p><strong>Start:</strong> {formatDate(start)}</p>
        <p><strong>Vertrek:</strong> {formatDate(end)}</p>
        <p className="mt-2 text-blue-700 font-medium">{phaseInfo[phase].label}</p>
      </div>
      <div className="w-full grid grid-cols-2 gap-2">
        <Link
          to={`/sessions/${session.id}/responses`}
          className="flex justify-center items-center gap-2 text-blue-600 hover:underline"
        >
          🔍 Antwoorden
        </Link>
        <button
          onClick={() =>
            copyToClipboard(`${window.location.origin}/public/${session.id}`)
          }
          className="flex justify-center items-center gap-2 text-gray-700 hover:underline"
        >
          📎 Link
        </button>
        <button
          onClick={() => copyToClipboard(session.id)}
          className="flex justify-center items-center gap-2 text-gray-700 hover:underline"
        >
          🔑 Code
        </button>
        <button
          onClick={handleEnd}
          className="flex justify-center items-center gap-2 text-red-600 hover:underline font-medium"
        >
          ❌ Beëindigen
        </button>
      </div>
    </div>
)
}
