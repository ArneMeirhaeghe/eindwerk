import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import LoadingIndicator from "../components/LoadingIndicator"
import ErrorMessage from "../components/ErrorMessage"
import { getLiveSession } from "../api/liveSession"
import type { LiveSessionDto, ComponentSnapshot } from "../api/liveSession/types"
import { getForm } from "../api/forms"
import type { FormDto } from "../api/forms/types"
import FormResponseSummary from "../components/livesession/inputs/FormResponseSummary"
import InventoryResponseSummary from "../components/livesession/inputs/InventoryResponseSummary"
import { getInventoryTemplate } from "../api/inventory"
import type { InventoryTemplateDto } from "../api/inventory/types"

export default function SessionResponsesPage() {
  const { id } = useParams<{ id: string }>()
  const [session, setSession] = useState<LiveSessionDto | null>(null)
  const [forms, setForms] = useState<Record<string, FormDto>>({})
  const [inventories, setInventories] = useState<Record<string, InventoryTemplateDto>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    ;(async () => {
      try {
        const s = await getLiveSession(id!)
        setSession(s)
        // Prefetch forms
        const formIds = new Set<string>()
        Object.values(s.fases).flat().forEach(sec =>
          sec.components.forEach(comp => {
            if (comp.type === "form" && comp.props.formId) formIds.add(comp.props.formId)
          })
        )
        const formEntries = await Promise.all(
          Array.from(formIds).map(fid =>
            getForm(fid).then(f => [fid, f] as [string, FormDto])
          )
        )
        setForms(Object.fromEntries(formEntries))
        // Prefetch inventories
        const invIds = new Set<string>()
        Object.values(s.fases).flat().forEach(sec =>
          sec.components.forEach(comp => {
            if (comp.type === "inventory" && comp.props.templateId) invIds.add(comp.props.templateId)
          })
        )
        const invEntries = await Promise.all(
          Array.from(invIds).map(tid =>
            getInventoryTemplate(tid).then(tpl => [tid, tpl] as [string, InventoryTemplateDto])
          )
        )
        setInventories(Object.fromEntries(invEntries))
      } catch {
        setError("Kon sessie niet laden")
      } finally {
        setLoading(false)
      }
    })()
  }, [id])

  if (loading) return <LoadingIndicator />
  if (error || !session) return <ErrorMessage message={error || "Geen data gevonden"} />

  return (
    <div className="container mx-auto px-4 py-6 space-y-12">
      {/* Pagina-titel */}
      <h1 className="text-3xl font-bold text-center text-blue-600">
        Antwoorden: <span className="text-gray-800">{session.groep}</span>
      </h1>

      {/* Fases */}
      {Object.entries(session.fases).map(([fase, secs]) => (
        <section key={fase} className="space-y-8">
          <h2 className="text-2xl font-semibold text-blue-600 border-b-2 border-blue-200 pb-2">
            {fase.charAt(0).toUpperCase() + fase.slice(1)}
          </h2>
          <div className="space-y-6">
            {secs.map(sec => (
              <div 
                key={sec.id} 
                className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-6 hover:shadow-lg transition"
              >
                <h3 className="text-xl font-medium text-gray-800 mb-4">
                  {sec.naam}
                </h3>
                <div className="space-y-8">
                  {sec.components.map((comp: ComponentSnapshot) => {
                    const resp = session.responses[sec.id]?.[comp.id]
                    if (resp == null) return null

                    const title = comp.props.label || comp.type

                    // Formulier antwoorden
                    if (comp.type === "form") {
                      const formDto = forms[comp.props.formId]
                      return formDto ? (
                        <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
                          <FormResponseSummary form={formDto} values={resp as Record<string, any>} />
                        </div>
                      ) : (
                        <p key={comp.id} className="text-sm text-gray-500">Formulier laden…</p>
                      )
                    }

                    // Inventaris antwoorden
                    if (comp.type === "inventory") {
                      const tpl = inventories[comp.props.templateId]
                      return tpl ? (
                        <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
                          <InventoryResponseSummary
                            template={tpl}
                            selectedLokalen={comp.props.selectedLokalen}
                            selectedSubs={comp.props.selectedSubs}
                            values={resp as Record<string, any>}
                          />
                        </div>
                      ) : (
                        <p key={comp.id} className="text-sm text-gray-500">Inventaris laden…</p>
                      )
                    }

                    // Bestand of upload
                    if ((resp as any).url) {
                      return (
                        <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
                          <img
                            src={(resp as any).url}
                            alt={(resp as any).fileName}
                            className="w-full rounded-lg shadow-inner mb-2"
                          />
                          <a
                            href={(resp as any).url}
                            download={(resp as any).fileName}
                            className="text-blue-600 hover:underline font-medium"
                          >
                            Download {(resp as any).fileName}
                          </a>
                        </div>
                      )
                    }

                    // Meerdere waarden (checkbox / dropdown)
                    if (Array.isArray(resp)) {
                      return (
                        <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                          <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
                          <ul className="list-disc list-inside text-gray-800">
                            {(resp as any[]).map((v, i) => (
                              <li key={i}>{v}</li>
                            ))}
                          </ul>
                        </div>
                      )
                    }

                    // Eenvoudige waarde (text, number)
                    return (
                      <div key={comp.id} className="bg-gray-50 rounded-lg p-4">
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">{title}</h4>
                        <p className="text-gray-800">{String(resp)}</p>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
