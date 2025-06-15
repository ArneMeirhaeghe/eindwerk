// File: src/pages/SessionResponsesPage.tsx
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
          Array.from(formIds).map(fid => getForm(fid).then(f => [fid, f] as [string, FormDto]))
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
          Array.from(invIds).map(tid => getInventoryTemplate(tid).then(tpl => [tid, tpl] as [string, InventoryTemplateDto]))
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Pagina titel */}
      <h1 className="text-3xl font-bold text-center text-indigo-600">
        Antwoorden voor: <span className="text-gray-800">{session.groep}</span>
      </h1>

      {Object.entries(session.fases).map(([fase, secs]) => (
        <section key={fase} className="space-y-8">
          {/* Fase titel */}
          <h2 className="text-2xl font-semibold text-indigo-700 border-b-2 border-indigo-200 pb-2">
            {fase.charAt(0).toUpperCase() + fase.slice(1)}
          </h2>

          <div className="space-y-6">
            {secs.map(sec => (
              <div key={sec.id} className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
                {/* Sectie naam */}
                <h3 className="text-xl font-medium text-gray-800">{sec.naam}</h3>

                <div className="space-y-4">
                  {sec.components.map((comp: ComponentSnapshot) => {
                    const resp = session.responses[sec.id]?.[comp.id]
                    if (resp == null) return null

                    /** FORM component **/
                    if (comp.type === "form") {
                      const formDto = forms[comp.props.formId]
                      if (!formDto) return <p key={comp.id} className="text-sm text-gray-500">Formulier laden…</p>
                      return (
                        <FormResponseSummary
                          key={comp.id}
                          form={formDto}
                          values={resp as Record<string, any>}
                        />
                      )
                    }

                    /** INVENTORY component **/
                    if (comp.type === "inventory") {
                      const tpl = inventories[comp.props.templateId]
                      if (!tpl) return <p key={comp.id} className="text-sm text-gray-500">Inventaris laden…</p>
                      return (
                        <InventoryResponseSummary
                          key={comp.id}
                          template={tpl}
                          selectedLokalen={comp.props.selectedLokalen}
                          selectedSubs={comp.props.selectedSubs}
                          values={resp as Record<string, any>}
                        />
                      )
                    }

                    /** UPLOAD component **/
                    if ((resp as any).url) {
                      return (
                        <div key={comp.id} className="space-y-2">
                          <div className="text-indigo-600 font-medium">{comp.props.label || comp.type}</div>
                          <img
                            src={(resp as any).url}
                            alt={(resp as any).fileName}
                            className="w-full rounded-xl border"
                          />
                          <a
                            href={(resp as any).url}
                            download={(resp as any).fileName}
                            className="text-indigo-600 hover:underline font-medium"
                          >
                            Download {(resp as any).fileName}
                          </a>
                        </div>
                      )
                    }

                    /** MEERDERE WAARDEN **/
                    if (Array.isArray(resp)) {
                      return (
                        <div key={comp.id} className="space-y-2">
                          <div className="text-indigo-600 font-medium">{comp.props.label || comp.type}</div>
                          <ul className="list-disc list-inside text-gray-800">
                            {(resp as any[]).map((v, i) => <li key={i}>{v}</li>)}
                          </ul>
                        </div>
                      )
                    }

                    /** EENVOUDIGE WAARDE **/
                    return (
                      <div key={comp.id} className="space-y-1">
                        <div className="text-indigo-600 font-medium">{comp.props.label || comp.type}</div>
                        <div className="text-gray-800 break-words">{String(resp)}</div>
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
