// File: client/src/pages/TourBuilderPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTour,
  addSection,
  updateSection,
  deleteSection,
  addComponent,
  updateComponent,
  deleteComponent,
  updateTourNaam,
  type Tour,
  type SectionDto,
  type ComponentDto,
} from "../api/tours";
import { v4 as uuidv4 } from "uuid";
import ComponentPalette from "../components/ComponentPalette";
import BuilderCanvas from "../components/BuilderCanvas";
import SettingsPanel from "../components/SettingsPanel";
import BottomNav from "../components/BottomNav";
import LivePreview from "../components/LivePreview";
import EditSectionModal from "../components/EditSectionModal";
import { ToastContainer, toast } from "react-toastify";
import { type DropResult } from "@hello-pangea/dnd";
import {
  type ComponentItem,
  type ComponentType,
  type Section,
  type Fase,
  type FaseSections,
} from "../types/types";

export default function TourBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [naamLocatie, setNaamLocatie] = useState("");
  const fasesList: Fase[] = ["voor", "aankomst", "terwijl", "vertrek", "na"];
  const [sectionsByFase, setSectionsByFase] = useState<FaseSections>(() =>
    fasesList.reduce((acc, f) => ({ ...acc, [f]: [] }), {} as FaseSections)
  );
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);

  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Laad tour én zorg dat elke fase minstens één section in DB heeft
  useEffect(() => {
    if (!id) {
      navigate("/tours");
      return;
    }
    setLoading(true);

    async function loadTour(tourId: string) {
      try {
        const tour: Tour = await getTour(tourId);
        setNaamLocatie(tour.naamLocatie);

        const newState: FaseSections = {} as FaseSections;
        for (const f of fasesList) {
          const apiSections: SectionDto[] = tour.fases?.[f] ?? [];
          if (apiSections.length === 0) {
            const created = await addSection(tourId, f, "Nieuwe sectie");
            newState[f] = [
              {
                id: created.id,
                title: created.naam,
                components: [],
              },
            ];
          } else {
            newState[f] = apiSections.map((secDto) => ({
              id: secDto.id,
              title: secDto.naam,
              components: secDto.components.map((c: ComponentDto) => ({
                id: c.id,
                type: c.type as ComponentType,
                props: c.props,
              })),
            }));
          }
        }
        setSectionsByFase(newState);
        setActiveSectionIndex(0);
      } catch {
        toast.error("Kon tour niet laden");
        navigate("/tours");
      } finally {
        setLoading(false);
      }
    }

    loadTour(id);
  }, [id, navigate]);

  // Zorg dat er altijd minstens één section is in actieve fase
  useEffect(() => {
    const currentSections = sectionsByFase[activeFase] || [];
    if (currentSections.length === 0 && id) {
      (async () => {
        try {
          const created = await addSection(id, activeFase, "Nieuwe sectie");
          const newSection: Section = {
            id: created.id,
            title: created.naam,
            components: [],
          };
          setSectionsByFase((prev) => ({
            ...prev,
            [activeFase]: [newSection],
          }));
          setActiveSectionIndex(0);
        } catch {
          toast.error("Sectie initialisatie mislukt");
        }
      })();
    }
  }, [sectionsByFase, activeFase, id]);

  if (loading) return <div className="p-4 animate-pulse">Laden…</div>;

  const currentFaseSections = sectionsByFase[activeFase]!;
  const current =
    currentFaseSections[activeSectionIndex] ?? currentFaseSections[0];

  // SLA wijzigingen op voor het wisselen van component/fase
  const savePreviousComponent = async () => {
    if (!selectedComp || !dirty || !id) return;
    for (const f of fasesList) {
      const secs = sectionsByFase[f];
      for (const sectie of secs) {
        const compMatch = sectie.components.find((c) => c.id === selectedComp.id);
        if (compMatch) {
          try {
            await updateComponent(
              id,
              f,
              sectie.id,
              selectedComp.id,
              selectedComp.type,
              selectedComp.props
            );
            toast.success("Component opgeslagen");
          } catch {
            toast.error("Fout bij opslaan component");
          }
          break;
        }
      }
    }
    setDirty(false);
  };

  // Wijzig actieve fase
  const onFaseChange = async (f: Fase) => {
    await savePreviousComponent();
    setSelectedComp(null);
    setActiveFase(f);
    setActiveSectionIndex(0);
  };

  // SECTION-CRUD

  const onAddSection = async () => {
    try {
      const nieuwSec = await addSection(id!, activeFase, "Nieuwe sectie");
      const sec: Section = {
        id: nieuwSec.id,
        title: nieuwSec.naam,
        components: [],
      };
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: [...prev[activeFase], sec],
      }));
      setActiveSectionIndex(currentFaseSections.length);
      setSelectedComp(null);
      setDirty(false);
    } catch {
      toast.error("Sectie aanmaken mislukt");
    }
  };

  const onRenameSection = async (idx: number, newTitle: string) => {
    const sectie = sectionsByFase[activeFase][idx];
    try {
      await updateSection(id!, activeFase, sectie.id, newTitle);
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].map((s, i) =>
          i === idx ? { ...s, title: newTitle } : s
        ),
      }));
    } catch {
      toast.error("Sectie hernoemen mislukt");
    }
  };

  const onDeleteSection = async (idx: number) => {
    const sectie = sectionsByFase[activeFase][idx];
    if (!window.confirm(`Verwijder sectie "${sectie.title}"?`)) return;
    try {
      await deleteSection(id!, activeFase, sectie.id);
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].filter((_, i) => i !== idx),
      }));
      setActiveSectionIndex(0);
      setSelectedComp(null);
      setDirty(false);
    } catch {
      toast.error("Sectie verwijderen mislukt");
    }
  };

  // COMPONENT-CRUD

  const onAddComponent = async (type: ComponentType) => {
    const baseText = {
      text: "Tekst",
      fontFamily: "sans-serif",
      fontSize: 16,
      color: "#000000",
      bg: "#ffffff",
      align: "left" as const,
      bold: false,
      italic: false,
      underline: false,
      lineHeight: 1.5,
    };
    const props =
      type === "checklist"
        ? { items: [""], fontSize: 16, color: "#000000", bg: "#ffffff", spacing: 8 }
        : type === "checkbox-list"
        ? { items: [{ label: "", good: false }], fontSize: 16, color: "#000000", bg: "#ffffff" }
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
            functionType: "link" as const,
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
            objectFit: "cover" as const,
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
            objectFit: "cover" as const,
          }
        : type === "grid"
        ? {
            images: [] as string[],
            columns: 3,
            gap: 8,
            borderWidth: 0,
            borderColor: "#000000",
            radius: 0,
            shadow: false,
            objectFit: "cover" as const,
          }
        : type === "uploadzone"
        ? { label: "Upload Foto" }
        : baseText;

    const sec = currentFaseSections[activeSectionIndex];
    try {
      const nieuwComp = await addComponent(id!, activeFase, sec.id, type, props);
      const compNew: ComponentItem = {
        id: nieuwComp.id,
        type: nieuwComp.type as ComponentType,
        props: nieuwComp.props,
      };
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].map((s, i) => {
          if (i !== activeSectionIndex) return s;
          return {
            ...s,
            components: [...s.components, compNew],
          };
        }),
      }));
      await savePreviousComponent();
      setSelectedComp(compNew);
      setDirty(false);
    } catch {
      toast.error("Component aanmaken mislukt");
    }
  };

  const onDeleteComponent = async (cid: string) => {
    const sec = currentFaseSections[activeSectionIndex];
    try {
      await deleteComponent(id!, activeFase, sec.id, cid);
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].map((s, i) => {
          if (i !== activeSectionIndex) return s;
          return {
            ...s,
            components: s.components.filter((c) => c.id !== cid),
          };
        }),
      }));
      setSelectedComp(null);
      setDirty(false);
    } catch {
      toast.error("Component verwijderen mislukt");
    }
  };

  // Wijziging in settings, alleen lokale update
  const handleSettingsChange = (c: ComponentItem) => {
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) => {
        if (i !== activeSectionIndex) return s;
        return {
          ...s,
          components: s.components.map((x) => (x.id === c.id ? c : x)),
        };
      }),
    }));
    setSelectedComp(c);
    setDirty(true);
  };

  // Drag & drop voor componenten
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

  // Opslaan tour-naam
  const onSaveName = async () => {
    try {
      await updateTourNaam(id!, naamLocatie);
      toast.success("Naam bijgewerkt");
    } catch {
      toast.error("Naam bijwerken mislukt");
    }
  };

  // Wanneer gebruiker een component selecteert, sla vorige op
  const onSelectComponent = async (comp: ComponentItem) => {
    await savePreviousComponent();
    setSelectedComp(comp);
    setDirty(false);
  };

  // Als user wegklikt uit component (bv. naar preview), sla op
  const onDeselect = async () => {
    await savePreviousComponent();
    setSelectedComp(null);
    setDirty(false);
  };

  // Handlers voor edit-sectie modal
  const openSectionModal = (idx: number) => {
    const sectie = currentFaseSections[idx];
    setModalValue(sectie.title);
    setEditingSectionIndex(idx);
    setModalOpen(true);
  };

  const closeSectionModal = () => {
    setModalOpen(false);
    setEditingSectionIndex(null);
    setModalValue("");
  };

  const submitSectionModal = async (newTitle: string) => {
    if (editingSectionIndex !== null) {
      await onRenameSection(editingSectionIndex, newTitle);
    }
    closeSectionModal();
  };

  // Handle click on section title in canvas
  const handleSectionTitleClick = () => {
    openSectionModal(activeSectionIndex);
  };

  // Schakel previewmode in
  if (previewMode) {
    return (
      <div className="relative h-full bg-gray-100">
        <div className="p-4">
          <button
            onClick={async () => {
              await savePreviousComponent();
              setPreviewMode(false);
            }}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Terug naar bewerken
          </button>
          <LivePreview fases={fasesList} sectionsByFase={sectionsByFase} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full">
      <ComponentPalette onAdd={onAddComponent} />

      <div className="flex-1 relative pb-16" onClick={onDeselect}>
        <BuilderCanvas
          components={current.components}
          sectionTitle={current.title}
          preview={false}
          onSelect={onSelectComponent}
          onDelete={onDeleteComponent}
          onDragEnd={onDragEnd}
          onSectionTitleClick={handleSectionTitleClick}
        />

        {/* Knop Voorbeeld */}
        <div className="absolute top-4 right-4 space-x-2">
          <button
            onClick={async () => {
              await savePreviousComponent();
              setPreviewMode(true);
            }}
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
          onFaseChange={onFaseChange}
          onSectionChange={async (i) => {
            await savePreviousComponent();
            setActiveSectionIndex(i);
            setSelectedComp(null);
            setDirty(false);
          }}
          onAddSection={onAddSection}
          onEditSection={openSectionModal}
          onRenameSection={onRenameSection}
          onDeleteSection={onDeleteSection}
        />
      </div>

      <SettingsPanel comp={selectedComp} onUpdate={handleSettingsChange} />

      {/* Edit Section Modal */}
      <EditSectionModal
        isOpen={modalOpen}
        initialValue={modalValue}
        onSave={submitSectionModal}
        onClose={closeSectionModal}
      />

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
