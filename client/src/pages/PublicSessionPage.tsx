// File: client/src/pages/PublicSessionPage.tsx
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getPublicSession, type LiveSessionPublicDto } from "../api/liveSession"
import { getVerhuurperiodes, type VerhuurPeriode } from "../api/verhuur"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"

export default function PublicSessionPage() {
  const { id } = useParams<{ id: string }>()
  const [session, setSession] = useState<LiveSessionPublicDto | null>(null)
  const [verhuurPeriode, setVerhuurPeriode] = useState<VerhuurPeriode | null>(null)
  const [phaseKeys, setPhaseKeys] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Haal publieke sessie en verhuurperiode op voor header
  useEffect(() => {
    if (!id) return
    // Eerste: sessie ophalen
    getPublicSession(id)
      .then(data => {
        setSession(data)
        const keys = Object.keys(data.tour.fases)
        setPhaseKeys(keys)
        // Na sessie: huurperiode ophalen op basis van groepnaam
        getVerhuurperiodes()
          .then(periodes => {
            const gevonden = periodes.find(v => v.groep === data.groep)
            setVerhuurPeriode(gevonden || null)
            setLoading(false)
          })
          .catch(() => {
            setVerhuurPeriode(null)
            setLoading(false)
          })
      })
      .catch(() => {
        setError("Fout bij laden van sessie.")
        setLoading(false)
      })
  }, [id])

  const prevPhase = () => {
    setCurrentIndex(i => (i > 0 ? i - 1 : i))
  }

  const nextPhase = () => {
    setCurrentIndex(i =>
      session && phaseKeys.length
        ? i < phaseKeys.length - 1
          ? i + 1
          : i
        : i
    )
  }

  const renderBlock = (block: any) => {
    const { type, props } = block
    switch (type) {
      case "image":
        return (
          <img
            key={block.id}
            src={props.url}
            alt={props.alt || ""}
            className="w-full h-auto my-4 rounded-lg shadow-md"
            style={{ objectFit: props.objectFit || "cover" }}
          />
        )
      case "file":
        return (
          <a
            key={block.id}
            href={props.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block my-4 p-4 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            {props.filename || "Download bestand"}
          </a>
        )
      case "title":
        return (
          <h2
            key={block.id}
            className="text-xl font-semibold my-2"
            style={{
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              color: props.color,
            }}
          >
            {props.text}
          </h2>
        )
      case "paragraph":
        return (
          <p
            key={block.id}
            className="text-base my-2"
            style={{
              fontFamily: props.fontFamily,
              fontSize: props.fontSize,
              color: props.color,
              lineHeight: props.lineHeight,
            }}
          >
            {props.text}
          </p>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p className="text-gray-500">Laden...</p>
      </div>
    )
  }

  if (error || !session) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-white">
        <p className="text-red-500">{error || "Sessie niet gevonden."}</p>
      </div>
    )
  }

  const currentPhaseKey = phaseKeys[currentIndex]
  const blocks = session.tour.fases[currentPhaseKey] || []

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header met huurgroep en periode */}
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-lg font-bold">{session.groep}</h1>
        {verhuurPeriode && (
          <p className="text-sm">
            {new Date(verhuurPeriode.aankomst).toLocaleDateString("nl-BE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            –{" "}
            {new Date(verhuurPeriode.vertrek).toLocaleDateString("nl-BE", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </p>
        )}
      </header>

      {/* Hoofdcontent: alleen fasen */}
      <main className="flex-1 overflow-y-auto p-4">
        {blocks.length === 0 ? (
          <p className="text-gray-500">Geen inhoud in deze fase.</p>
        ) : (
          blocks.map(block => renderBlock(block))
        )}
      </main>

      {/* Pijltjes fixed onderaan */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-2 flex items-center justify-between">
        <button
          onClick={prevPhase}
          disabled={currentIndex === 0}
          className={`p-2 rounded-full ${
            currentIndex === 0 ? "text-gray-300" : "text-blue-600"
          }`}
        >
          <ChevronLeftIcon className="h-6 w-6" />
        </button>
        <span className="text-base font-medium capitalize">
          {currentPhaseKey}
        </span>
        <button
          onClick={nextPhase}
          disabled={currentIndex === phaseKeys.length - 1}
          className={`p-2 rounded-full ${
            currentIndex === phaseKeys.length - 1
              ? "text-gray-300"
              : "text-blue-600"
          }`}
        >
          <ChevronRightIcon className="h-6 w-6" />
        </button>
      </div>
    </div>
  )
}
