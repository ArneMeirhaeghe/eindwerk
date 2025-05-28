// src/pages/TourBuilderPage.tsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTour, updateTour, type Tour } from "../api/tours";
import { v4 as uuidv4 } from "uuid";
import ComponentPalette from "../components/ComponentPalette";
import BuilderCanvas from "../components/BuilderCanvas";
import SettingsPanel from "../components/SettingsPanel";
import BottomNav from "../components/BottomNav";
import LivePreview from "../components/LivePreview";
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
    fasesList.reduce((acc, f) => ({ ...acc, [f]: [] }), {} as FaseSections)
  );
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // 1) Load tour
  useEffect(() => {
    if (!id) {
      navigate("/tours");
      return;
    }
    setLoading(true);
    async function loadTour(tourId: string) {
      try {
        const tour: Tour = await getTour(tourId);
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
    }
    loadTour(id);
  }, [id, navigate]);

  // 2) Save tour
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
  }, [id, naamLocatie, sectionsByFase, fasesList]);

  // 3) Auto-save on hide/unload
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") saveTour();
    };
    window.addEventListener("beforeunload", saveTour);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("beforeunload", saveTour);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [saveTour]);

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>;

  // Ensure at least one section
  const currentFaseSections = sectionsByFase[activeFase]!;
  if (currentFaseSections.length === 0) {
    currentFaseSections.push({
      id: uuidv4(),
      title: "Nieuwe sectie",
      components: [],
    });
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: currentFaseSections,
    }));
  }
  const current =
    currentFaseSections[activeSectionIndex] ?? currentFaseSections[0];

  // Section handlers
  const addSection = () => {
    const sec: Section = { id: uuidv4(), title: "Nieuwe sectie", components: [] };
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: [...p[activeFase], sec],
    }));
    setActiveSectionIndex((i) => i + 1);
    setSelectedComp(null);
  };
  const renameSection = (idx: number, title: string) =>
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].map((s, i) =>
        i === idx ? { ...s, title } : s
      ),
    }));
  const deleteSection = (idx: number) => {
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].filter((_, i) => i !== idx),
    }));
    setActiveSectionIndex(0);
    setSelectedComp(null);
  };

  // Component handlers
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
            functionType: "dummy",
            url: "",
          }
        : type === "image"
        ? {
            url: "",
            alt: "",
            width: 300,
            height: 200,
            borderWidth: 0,
            borderColor: "#000000",
            radius: 0,
            shadow: false,
            objectFit: "cover",
          }
        : type === "video"
        ? {
            url: "",
            alt: "",
            controls: true,
            autoplay: false,
            loop: false,
            width: 300,
            height: 200,
            radius: 0,
            shadow: false,
            objectFit: "cover",
          }
        : type === "grid"
        ? {
            images: [],
            columns: 3,
            gap: 8,
            borderWidth: 0,
            borderColor: "#000000",
            radius: 0,
            shadow: false,
            objectFit: "cover",
          }
        : baseText;
    const comp: ComponentItem = { id: uuidv4(), type, props };
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? { ...s, components: [...s.components, comp] }
          : s
      ),
    }));
    setSelectedComp(comp);
  };

  const deleteComponent = (cid: string) => {
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? { ...s, components: s.components.filter((c) => c.id !== cid) }
          : s
      ),
    }));
    setSelectedComp(null);
  };

  const updateComponent = (c: ComponentItem) => {
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].map((s, i) =>
        i === activeSectionIndex
          ? {
              ...s,
              components: s.components.map((x) =>
                x.id === c.id ? c : x
              ),
            }
          : s
      ),
    }));
    setSelectedComp(c);
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    setSectionsByFase((p) => ({
      ...p,
      [activeFase]: p[activeFase].map((s, i) => {
        if (i !== activeSectionIndex) return s;
        const arr = [...s.components];
        const [moved] = arr.splice(res.source.index, 1);
        arr.splice(res.destination!.index, 0, moved);
        return { ...s, components: arr };
      }),
    }));
  };

  // Preview mode: flatten alle secties uit alle fases
  if (previewMode) {
    const allComponents = fasesList.flatMap((f) =>
      sectionsByFase[f].flatMap((s) => s.components)
    );
    return (
      <div className="relative h-full bg-gray-100">
        <div className="p-4">
          <button
            onClick={() => setPreviewMode(false)}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Terug naar bewerken
          </button>
          <LivePreview components={allComponents} />
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div className="flex h-full">
      <ComponentPalette onAdd={addComponent} />

      <div className="flex-1 relative">
        <BuilderCanvas
          components={current.components}
          sectionTitle={current.title}
          preview={previewMode}
          onSelect={setSelectedComp}
          onDelete={deleteComponent}
          onDragEnd={onDragEnd}
          onSectionTitleChange={(t) => renameSection(activeSectionIndex, t)}
        />
        <div className="absolute top-4 right-4 space-x-2">
          <button
            onClick={saveTour}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            {saving ? "..." : "Opslaan"}
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            Voorbeeld
          </button>
        </div>
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
      </div>

      <SettingsPanel comp={selectedComp} onUpdate={updateComponent} />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
