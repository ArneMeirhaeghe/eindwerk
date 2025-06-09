import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getTour,
  addSection,
  updateSection,
  deleteSection,
  addComponent,
  updateComponent,
  deleteComponent,
} from "../api/tours";
import { toast } from "react-toastify";
import type { DropResult } from "@hello-pangea/dnd";
import type {
  ComponentItem,
  ComponentType,
  Fase,
  FaseSections,
} from "../types/types";
import type { ComponentDto, Tour } from "../api/tours/types";
import { flattenProps } from "../utils/flattenProps";

export function useTourBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const fasesList: Fase[] = ["voor", "aankomst", "terwijl", "vertrek", "na"];

  const [loading, setLoading] = useState(true);
  const [sectionsByFase, setSectionsByFase] = useState<FaseSections>(
    () => fasesList.reduce((acc, f) => ({ ...acc, [f]: [] }), {} as FaseSections)
  );
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);
  const [dirty, setDirty] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalValue, setModalValue] = useState("");
  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null);

  // Laad tour en bestaande secties/components
 // Load existing tour + sections/components (no auto-creation)
  useEffect(() => {
    if (!id) return void navigate("/tours");
    setLoading(true);
    (async () => {
      try {
        const tour: Tour = await getTour(id);
        const newState = {} as FaseSections;
        for (const f of fasesList) {
          const apiSecs = tour.fases?.[f] || [];
          newState[f] = apiSecs.map((sec) => ({
            id: sec.id,
            title: sec.naam,
            components: sec.components.map((c: ComponentDto) => ({
              id: c.id,
              type: c.type as ComponentType,
              props: flattenProps(c.props),
            })),
          }));
        }
        setSectionsByFase(newState);
        setActiveSectionIndex(0);
      } catch {
        toast.error("Kon tour niet laden");
        navigate("/tours");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

   // Save last-edited component
  const savePreviousComponent = useCallback(async () => {
    if (!selectedComp || !dirty || !id) return;
    for (const f of fasesList) {
      for (const sect of sectionsByFase[f]) {
        if (sect.components.find((c) => c.id === selectedComp.id)) {
          try {
            await updateComponent(
              id,
              f,
              sect.id,
              selectedComp.id,
              selectedComp.type,
              flattenProps(selectedComp.props)
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
  }, [selectedComp, dirty, id, sectionsByFase, fasesList]);

  // Handlers
  const onFaseChange = async (f: Fase) => {
    await savePreviousComponent();
    setSelectedComp(null);
    setActiveFase(f);
    setActiveSectionIndex(0);
  };

  const onSectionChange = async (idx: number) => {
    await savePreviousComponent();
    setSelectedComp(null);
    setActiveSectionIndex(idx);
  };

 const onAddSection = async () => {
    if (!id) return;
    try {
      const nieuw = await addSection(id, activeFase, "Nieuwe sectie");
      setSectionsByFase((prev) => {
        const updated = [
          ...prev[activeFase],
          { id: nieuw.id, title: nieuw.naam, components: [] },
        ];
        setActiveSectionIndex(updated.length - 1);
        return { ...prev, [activeFase]: updated };
      });
      setSelectedComp(null);
      setDirty(false);
    } catch {
      toast.error("Sectie aanmaken mislukt");
    }
  };

 const onRenameSection = async (idx: number, newTitle: string) => {
    if (!id) return;
    const sect = sectionsByFase[activeFase][idx];
    try {
      await updateSection(id, activeFase, sect.id, newTitle);
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
    if (!id) return;
    const sect = sectionsByFase[activeFase][idx];
    // only delete if more than one
    if (sectionsByFase[activeFase].length <= 1) return;
    if (!window.confirm(`Verwijder sectie "${sect.title}"?`)) return;
    try {
      await deleteSection(id, activeFase, sect.id);
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
  const onAddComponent = async (type: ComponentType) => {
    if (!id) return;
    const sec = sectionsByFase[activeFase][activeSectionIndex];
    let props: Record<string, any> = {};
    try {
      const added = await addComponent(id, activeFase, sec.id, type, props);
      const compNew: ComponentItem = {
        id: added.id,
        type: added.type as ComponentType,
        props: flattenProps(added.props),
      };
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].map((s, i) =>
          i !== activeSectionIndex
            ? s
            : { ...s, components: [...s.components, compNew] }
        ),
      }));
      await savePreviousComponent();
      setSelectedComp(compNew);
      setDirty(false);
    } catch {
      toast.error("Component aanmaken mislukt");
    }
  };

  const onDeleteComponent = async (cid: string) => {
    if (!id) return;
    const sec = sectionsByFase[activeFase][activeSectionIndex];
    try {
      await deleteComponent(id, activeFase, sec.id, cid);
      setSectionsByFase((prev) => ({
        ...prev,
        [activeFase]: prev[activeFase].map((s, i) =>
          i !== activeSectionIndex
            ? s
            : { ...s, components: s.components.filter((c) => c.id !== cid) }
        ),
      }));
      setSelectedComp(null);
      setDirty(false);
    } catch {
      toast.error("Component verwijderen mislukt");
    }
  };

  const handleSettingsChange = (c: ComponentItem) => {
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) =>
        i !== activeSectionIndex
          ? s
          : { ...s, components: s.components.map((x) => (x.id === c.id ? c : x)) }
      ),
    }));
    setSelectedComp(c);
    setDirty(true);
  };

  const onDragEnd = (res: DropResult) => {
    if (!res.destination) return;
    setSectionsByFase((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s, i) => {
        if (i !== activeSectionIndex) return s;
        const arr = [...s.components];
        const [moved] = arr.splice(res.source.index, 1);
        arr.splice(res.destination!.index, 0, moved);
        return { ...s, components: arr };
      }),
    }));
  };

  const onSelectComponent = async (comp: ComponentItem) => {
    await savePreviousComponent();
    setSelectedComp(comp);
    setDirty(false);
  };

  const onDeselect = async () => {
    await savePreviousComponent();
    setSelectedComp(null);
    setDirty(false);
  };

 const openSectionModal = (idx: number) => {
    const sect = sectionsByFase[activeFase][idx];
    setModalValue(sect.title);
    setEditingSectionIndex(idx);
    setModalOpen(true);
  };
  const closeSectionModal = () => { setModalOpen(false); setEditingSectionIndex(null); };
 const submitSectionModal = async (newTitle: string) => {
     if (editingSectionIndex !== null) {
       await onRenameSection(editingSectionIndex, newTitle);
     }
     closeSectionModal();
   };
  return {
    loading,
    fasesList,
    sectionsByFase,
    activeFase,
    activeSectionIndex,
    selectedComp,
    previewMode,
    modalOpen,
    modalValue,
     handlers: {
      setPreviewMode,
      onFaseChange,
      onSectionChange,
      onAddSection,
      onRenameSection,
      onDeleteSection,
      onAddComponent,
      onDeleteComponent,
      handleSettingsChange,
      onDragEnd,
      onSelectComponent,
      onDeselect,
      openSectionModal,
      closeSectionModal,
      submitSectionModal,
    },
  };
}
