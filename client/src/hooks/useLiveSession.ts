// File: src/hooks/useLiveSession.ts
import { useState, useEffect, useCallback } from "react"
import type { SectionSnapshot } from "../api/verhuur/types"
import { bulkSubmit, getPublicSession, uploadResponseFile } from "../api/liveSession"

export interface FlatSection {
  phase: string
  section: SectionSnapshot
}

export default function useLiveSession(link: string) {
  const [session, setSession] = useState<any>(null)
  const [flatSections, setFlatSections] = useState<FlatSection[]>([])
  const [responses, setResponses] = useState<Record<string, Record<string, any>>>({})
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  // 1) Laad sessie + bestaande antwoorden
  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const data = await getPublicSession(link)
        setSession(data)
        setResponses(data.responses || {})
        const list: FlatSection[] = []
        Object.entries(data.fases).forEach(([phase, secs]) =>
          secs.forEach(sec => list.push({ phase, section: sec }))
        )
        setFlatSections(list)
      } catch {
        setSession(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [link])

  // 2) Update één veld *lokaal* (géén API-call)
  const saveField = useCallback(
    (sectionId: string, componentId: string, value: any) => {
      setResponses(prev => ({
        ...prev,
        [sectionId]: {
          ...(prev[sectionId] || {}),
          [componentId]: value,
        },
      }))
    },
    []
  )

  // 3) Bulk save voor hele sectie
  const saveSection = useCallback(
    async (sectionId: string, vals: Record<string, any>) => {
      await bulkSubmit(link, { [sectionId]: vals })
      setResponses(prev => ({ ...prev, [sectionId]: vals }))
    },
    [link]
  )

  // 4) Upload bestand en update state
  const uploadFile = useCallback(
    async (sectionId: string, componentId: string, file: File) => {
      const mediaItem = await uploadResponseFile(link, sectionId, componentId, file)
      setResponses(prev => {
        const arr = (prev[sectionId]?.[componentId] as any[]) || []
        return {
          ...prev,
          [sectionId]: {
            ...(prev[sectionId] || {}),
            [componentId]: [...arr, mediaItem],
          },
        }
      })
    },
    [link]
  )

  return {
    session,
    flatSections,
    currentIndex,
    setCurrentIndex,
    responses,
    loading,
    saveField,
    saveSection,
    uploadFile,
  }
}
