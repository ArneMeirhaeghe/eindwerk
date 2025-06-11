// File: src/hooks/useFormBuilder.ts
import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import type { FieldDto, FormDto } from "../api/forms/types";
import { createForm, updateForm, getForm, getForms, deleteForm } from "../api/forms";
import type { DropResult } from "@hello-pangea/dnd";

export function useFormBuilder(initialFormId?: string) {
  const [loading, setLoading] = useState(false);
  const [formsList, setFormsList] = useState<FormDto[]>([]);
  const [formId, setFormId] = useState<string | null>(initialFormId || null);
  const [formName, setFormName] = useState("");
  const [fields, setFields] = useState<FieldDto[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // load all forms
  useEffect(() => {
    getForms().then(setFormsList);
  }, []);

  // load one form
  const loadForm = useCallback(async (id: string | null) => {
    if (!id) {
      setFormId(null);
      setFormName("");
      setFields([]);
      return;
    }
    setLoading(true);
    const dto = await getForm(id);
    setFormId(dto.id);
    setFormName(dto.name);
    setFields(dto.fields);
    setLoading(false);
  }, []);

  // create new form
  const createNewForm = useCallback(async () => {
    setLoading(true);
    const created = await createForm({ name: "Nieuw formulier", fields: [] });
    setFormId(created.id);
    setFormName(created.name);
    setFields([]);
    setFormsList(fl => [created, ...fl]);
    setLoading(false);
  }, []);

  // delete current form
  const removeForm = useCallback(async () => {
    if (!formId) return;
    await deleteForm(formId);
    setFormsList(fl => fl.filter(f => f.id !== formId));
    // reset to new
    setFormId(null);
    setFormName("");
    setFields([]);
  }, [formId]);

  // init load
  useEffect(() => {
    if (initialFormId) loadForm(initialFormId);
  }, [initialFormId, loadForm]);

  // autosave
  useEffect(() => {
    if (loading || !formId) return;
    updateForm(formId, { name: formName, fields });
  }, [formName, fields, formId, loading]);

  const onAddField = useCallback((type: FieldDto["type"]) => {
    const id = nanoid();
    setFields(f => [...f, { id, type, label: "", settings: {}, order: f.length }]);
    setSelectedId(id);
  }, []);

  const onSelectField = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const onDeleteField = useCallback((id: string) => {
    setFields(f =>
      f.filter(x => x.id !== id).map((x, i) => ({ ...x, order: i }))
    );
    if (selectedId === id) setSelectedId(null);
  }, [selectedId]);

  const onDragEndField = useCallback((result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    setFields(prev => {
      const arr = Array.from(prev);
      const [m] = arr.splice(source.index, 1);
      arr.splice(destination.index, 0, m);
      return arr.map((x, i) => ({ ...x, order: i }));
    });
  }, []);

  const handleSettingsChange = useCallback((updated: FieldDto) => {
    setFields(f => f.map(x => x.id === updated.id ? updated : x));
  }, []);

  const selectedField = fields.find(x => x.id === selectedId) || null;

  return {
    loading,
    formsList,
    formId,
    previewMode,
    formName,
    fields,
    selectedField,
    handlers: {
      setFormName,
      setPreviewMode,
      onAddField,
      onSelectField,
      onDeleteField,
      onDragEndField,
      handleSettingsChange,
      loadForm,
      createNewForm,
      removeForm,
    },
  };
}
