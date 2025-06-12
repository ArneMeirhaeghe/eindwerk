// File: src/hooks/useFormBuilder.ts
import { useState, useEffect, useCallback } from "react"
import { nanoid } from "nanoid"
import type { FieldDto, FormDto } from "../api/forms/types"
import { getForms, getForm, createForm, updateForm, deleteForm } from "../api/forms"
import type { DropResult } from "@hello-pangea/dnd"

export function useFormBuilder(initialFormId?: string) {
  const [loading, setLoading] = useState(false)
  const [formsList, setFormsList] = useState<FormDto[]>([])
  const [formId, setFormId] = useState<string | null>(initialFormId || null)
  const [formName, setFormName] = useState("")
  const [fields, setFields] = useState<FieldDto[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState(false)

  // Laad alle formulieren bij mount
  useEffect(() => {
    getForms().then(setFormsList)
  }, [])

  // Laad één formulier
  const loadForm = useCallback(async (id: string | null) => {
    if (!id) {
      setFormId(null)
      setFormName("")
      setFields([])
      return
    }
    setLoading(true)
    const dto = await getForm(id)
    setFormId(dto.id)
    setFormName(dto.name)
    setFields(dto.fields)
    setLoading(false)
  }, [])

  // Maak nieuw formulier functie (zonder opslaan)
  const createNewForm = useCallback(async () => {
    setFormId(null)
    setFormName("Nieuw formulier")
    setFields([])
  }, [])

  // Verwijder formulier
  const removeForm = useCallback(async () => {
    if (!formId) return
    setLoading(true)
    await deleteForm(formId)
    setFormsList(fl => fl.filter(f => f.id !== formId))
    setFormId(null)
    setFormName("")
    setFields([])
    setLoading(false)
  }, [formId])

  // Eerste load als initialFormId is meegegeven
  useEffect(() => {
    if (initialFormId) loadForm(initialFormId)
  }, [initialFormId, loadForm])

  // Expliciete save: maakt nieuw of werkt bij
  const saveForm = useCallback(async () => {
    setLoading(true)
    if (!formId) {
      // nieuw form aanmaken
      const created = await createForm({
        name: formName,
        fields
      })
      setFormId(created.id)
      setFormName(created.name)
      setFields(created.fields)
      setFormsList(fl => [created, ...fl])
    } else {
      // bestaand form updaten
      await updateForm(formId, {
        name: formName,
        fields
      })
      // update local list
      setFormsList(fl =>
        fl.map(f => f.id === formId ? { ...f, name: formName, fields } : f)
      )
    }
    setLoading(false)
  }, [formId, formName, fields])

  // Field handlers
  const onAddField = useCallback((type: FieldDto["type"]) => {
    const id = nanoid()
    setFields(f => [
      ...f,
      { id, type, label: "", settings: {}, order: f.length }
    ])
    setSelectedId(id)
  }, [])

  const onSelectField = useCallback((id: string) => {
    setSelectedId(id)
  }, [])

  const onDeleteField = useCallback((id: string) => {
    setFields(f =>
      f.filter(x => x.id !== id).map((x, i) => ({ ...x, order: i }))
    )
    if (selectedId === id) setSelectedId(null)
  }, [selectedId])

  const onDragEndField = useCallback((result: DropResult) => {
    const { source, destination } = result
    if (!destination) return
    setFields(prev => {
      const arr = Array.from(prev)
      const [moved] = arr.splice(source.index, 1)
      arr.splice(destination.index, 0, moved)
      return arr.map((x, i) => ({ ...x, order: i }))
    })
  }, [])

  const handleSettingsChange = useCallback((updated: FieldDto) => {
    setFields(f => f.map(x => x.id === updated.id ? updated : x))
  }, [])

  const selectedField = fields.find(x => x.id === selectedId) || null

  return {
    loading,
    formsList,
    formId,
    formName,
    fields,
    selectedField,
    previewMode,
    handlers: {
      setFormName,
      setPreviewMode,
      loadForm,
      createNewForm,
      removeForm,
      saveForm,             // expliciete save werkt nu voor nieuw + bestaand
      onAddField,
      onSelectField,
      onDeleteField,
      onDragEndField,
      handleSettingsChange,
    },
  }
}
