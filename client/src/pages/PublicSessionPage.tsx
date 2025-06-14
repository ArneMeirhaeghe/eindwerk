// File: src/pages/PublicSessionPage.tsx
import  { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LoadingIndicator from "../components/LoadingIndicator"
import useLiveSession from "../hooks/useLiveSession"
import LiveSection from "../components/livesession/LiveSection"

export default function PublicSessionPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const {
    session,
    flatSections,
    currentIndex,
    setCurrentIndex,
    responses,
    loading,
    saveSection,
    uploadFile,
    saveField,
  } = useLiveSession(id!)
  const [isSummary, setIsSummary] = useState(false)

  useEffect(() => {
    if (!loading && !session) navigate("/public")
  }, [loading, session, navigate])

  if (loading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <LoadingIndicator />
      </div>
    )
  }

  const current = flatSections[currentIndex]
  const saved = responses[current.section.id] || {}

  const prev = async () => {
    if (isSummary) {
      setIsSummary(false)
      setCurrentIndex(flatSections.length - 1)
    } else {
      await saveSection(current.section.id, responses[current.section.id] || {})
      setCurrentIndex(i => Math.max(i - 1, 0))
    }
  }

  const next = async () => {
    await saveSection(current.section.id, responses[current.section.id] || {})
    if (currentIndex === flatSections.length - 1) {
      setIsSummary(true)
    } else {
      setCurrentIndex(i => Math.min(i + 1, flatSections.length - 1))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div
        className="relative bg-white rounded-2xl shadow-lg w-full max-w-xs flex flex-col"
        style={{ height: "90vh" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-400 rounded-t-2xl p-4 flex flex-col items-center">
          <h2 className="text-xs text-white uppercase tracking-wide">
            {isSummary ? "Overzicht" : current.phase}
          </h2>
          {!isSummary && (
            <h1 className="text-lg font-semibold text-white mt-1 text-center">
              {current.section.naam}
            </h1>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isSummary ? (
            <LiveSection
              sessionId={id!}
              sectionData={current}
              saved={saved}
              // async wrapper zorgt voor Promise<void> return
              onFieldSave={async (compId, v) => {
                saveField(current.section.id, compId, v)
              }}
              onUploadFile={async (file, compId) => {
                await uploadFile(current.section.id, compId, file)
              }}
            />
          ) : (
            <div className="p-6 space-y-4">
              {flatSections.map(({ phase, section }) => (
                <div key={section.id} className="space-y-1">
                  <h3 className="text-sm font-medium text-gray-600 uppercase">
                    {phase}
                  </h3>
                  <h4 className="font-semibold">{section.naam}</h4>
                  <pre className="text-xs bg-gray-100 p-2 rounded">
                    {JSON.stringify(responses[section.id] || {}, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-3 bg-gray-100 rounded-b-2xl">
          <button
            onClick={prev}
            className="p-2 rounded-full bg-white hover:bg-gray-200 transition"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          {!isSummary && (
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {flatSections.length}
            </span>
          )}
          <button
            onClick={next}
            disabled={isSummary}
            className={`p-2 rounded-full transition ${
              isSummary
                ? "cursor-not-allowed opacity-50"
                : "bg-white hover:bg-gray-200"
            }`}
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
