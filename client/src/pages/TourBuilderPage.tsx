// src/pages/TourBuilderPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTour, updateTour, type Tour } from "../api/tours";
import { v4 as uuidv4 } from "uuid";
import ComponentPalette from "../components/ComponentPalette";
import BuilderCanvas from "../components/BuilderCanvas";
import SettingsPanel from "../components/SettingsPanel";
import BottomNav from "../components/BottomNav";
import { ToastContainer, toast } from "react-toastify";
import type { DropResult } from "@hello-pangea/dnd";
import type {
  ComponentItem,
  ComponentType,
  Section,
  Fase,
  FaseSections,
} from "../types/types";

export default function TourBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [naamLocatie, setNaamLocatie] = useState("");
  const fasesList: Fase[] = ["voor", "aankomst", "terwijl", "vertrek", "na"];
  const [sectionsByFase, setSectionsByFase] = useState<FaseSections>(() =>
    fasesList.reduce((acc, f) => {
      acc[f] = [];
      return acc;
    }, {} as FaseSections)
  );
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // laad tour uit API
  useEffect(() => {
    (async () => {
      if (!id) return navigate("/tours");
      setLoading(true);
      try {
        const tour: Tour = await getTour(id);
        setNaamLocatie(tour.naamLocatie ?? "");
        const init = fasesList.reduce((acc, f) => {
          const comps = tour.fases?.[f] ?? [];
          acc[f] = comps.length
            ? [{ id: uuidv4(), title: "Sectie 1", components: comps }]
            : [{ id: uuidv4(), title: "Nieuwe sectie", components: [] }];
          return acc;
        }, {} as FaseSections);
        setSectionsByFase(init);
      } catch {
        toast.error("Kon tour niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  // opslaan functie (stuurt nu 'fases' mee)
  const saveTour = useCallback(async () => {
    setSaving(true);
    try {
      const payload = fasesList.reduce((acc, f) => {
        acc[f] = sectionsByFase[f].flatMap((s) => s.components);
        return acc;
      }, {} as Record<Fase, ComponentItem[]>);
      await updateTour(id!, { naamLocatie, fases: payload });
      toast.success("Opgeslagen");
    } catch {
      toast.error("Opslaan mislukt");
    } finally {
      setSaving(false);
    }
  }, [id, naamLocatie, sectionsByFase]);

  // auto-save bij tab wissel of sluiten
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") saveTour();
    };
    window.addEventListener("beforeunload", saveTour);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("beforeunload", saveTour);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [saveTour]);

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>;

  // zorg altijd voor een geldige sectie
  const currentFaseSections = sectionsByFase[activeFase]!;
  if (currentFaseSections.length === 0) {
    currentFaseSections.push({
      id: uuidv4(),
      title: "Nieuwe sectie",
      components: [],
    });
    setSectionsByFase((prev) => ({ ...prev, [activeFase]: currentFaseSections }));
  }
  const current =
    currentFaseSections[activeSectionIndex] ?? currentFaseSections[0];

  // sectie manipulaties
  const addSection = () => {
    const sec: Section = { id: uuidv4(), title: "Nieuwe sectie", components: [] };
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: [...prev[activeFase], sec],
    }));
    setActiveSectionIndex((prev) => prev + 1);
    setSelectedComp(null);
  };
  const renameSection = (idx: number, title: string) =>
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) => (i === idx ? { ...s, title } : s)),
    }));
  const deleteSection = (idx: number) => {
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].filter((_, i) => i !== idx),
    }));
    setActiveSectionIndex(0);
    setSelectedComp(null);
  };

  // component manipulaties
  const addComponent = (type: ComponentType) => {
    const baseText = {
      text: "Tekst",
      fontFamily: "sans-serif",
      fontSize: 16,
      color: "#000000",
      bg: "#ffffff",
      align: "left",
      bold: false,
      italic: false,
      underline: false,
      lineHeight: 1.5,
    };
    const props =
      type === "checklist"
        ? { items: [""], fontSize: 16, color: "#000000", bg: "#ffffff", spacing: 8 }
        : type === "checkbox-list"
        ? { items: [{ label: "", good: false }], color: "#000000", bg: "#ffffff" }
        : type === "divider"
        ? { color: "#000000", thickness: 1 }
        : type === "button"
        ? {
            label: "Knop",
            fontSize: 16,
            color: "#ffffff",
            bg: "#007bff",
            radius: 4,
            bold: false,
            italic: false,
            underline: false,
          }
        : baseText;
    const comp: ComponentItem = { id: uuidv4(), type, props };
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? { ...s, components: [...s.components, comp] }
          : s
      ),
    }));
    setSelectedComp(comp);
  };
  const deleteComponent = (cid: string) => {
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? { ...s, components: s.components.filter((c) => c.id !== cid) }
          : s
      ),
    }));
    setSelectedComp(null);
  };
  const updateComponent = (c: ComponentItem) => {
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? { ...s, components: s.components.map((x) => (x.id === c.id ? c : x)) }
          : s
      ),
    }));
    setSelectedComp(c);
  };
  const onDragEnd = (res: DropResult) => {
    const { source, destination } = res;
    if (!destination) return;
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) => {
        if (i !== activeSectionIndex) return s;
        const comps = Array.from(s.components);
        const [moved] = comps.splice(source.index, 1);
        comps.splice(destination.index, 0, moved);
        return { ...s, components: comps };
      }),
    }));
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b">
        <input
          value={naamLocatie}
          onChange={(e) => setNaamLocatie(e.target.value)}
          className="text-2xl font-semibold border-b px-2 py-1"
        />
        <div className="space-x-2">
          <button
            onClick={saveTour}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {saving ? "Opslaan…" : "Opslaan"}
          </button>
          <button
            onClick={() => setPreviewMode((v) => !v)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            {previewMode ? "Bewerken" : "Voorbeeld"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!previewMode && <ComponentPalette onAdd={addComponent} />}

        <BuilderCanvas
          components={current.components}
          sectionTitle={current.title}
          onDragEnd={onDragEnd}
          onSelect={setSelectedComp}
          onDelete={deleteComponent}
          onSectionTitleChange={(title) =>
            renameSection(activeSectionIndex, title)
          }
          preview={previewMode}
        />

        {!previewMode && (
          <SettingsPanel comp={selectedComp} onUpdate={updateComponent} />
        )}

        <BottomNav
          fases={fasesList}
          sectionsByFase={sectionsByFase}
          activeFase={activeFase}
          activeSectionIndex={activeSectionIndex}
          onFaseChange={(f) => {
            setActiveFase(f);
            setActiveSectionIndex(0);
            setSelectedComp(null);
          }}
          onSectionChange={(i) => {
            setActiveSectionIndex(i);
            setSelectedComp(null);
          }}
          onAddSection={addSection}
          onRenameSection={renameSection}
          onDeleteSection={deleteSection}
        />

        <ToastContainer position="bottom-right" autoClose={3000} />
      </div>
    </div>
  );
}
