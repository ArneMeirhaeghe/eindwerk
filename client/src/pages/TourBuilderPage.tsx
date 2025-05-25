// src/pages/TourBuilderPage.tsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTour, updateTour, type Tour } from "../api/tours";
import { v4 as uuidv4 } from "uuid";
import ComponentPalette from "../components/ComponentPalette";
import BuilderCanvas from "../components/BuilderCanvas";
import SettingsPanel from "../components/SettingsPanel";
import BottomNav from "../components/BottomNav";
import { ToastContainer, toast } from "react-toastify";
import type { DropResult } from "@hello-pangea/dnd";
import "react-toastify/dist/ReactToastify.css";
import type {
  ComponentItem,
  ComponentType,
  Section,
  Fase,
  FaseSections,
} from "../types/types";

export default function TourBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [naamLocatie, setNaamLocatie] = useState("");
  const [previewMode, setPreviewMode] = useState(false);

  const fasesList: Fase[] = ["voor","aankomst","terwijl","vertrek","na"];
  const [sectionsByFase, setSectionsByFase] = useState<FaseSections>(() =>
    fasesList.reduce((acc, f) => { acc[f] = []; return acc; }, {} as FaseSections)
  );
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [activeSectionIndex, setActiveSectionIndex] = useState(0);
  const [selectedComp, setSelectedComp] = useState<ComponentItem|null>(null);

  useEffect(() => {
    (async () => {
      if (!id) return nav("/tours");
      setLoading(true);
      try {
        const tour: Tour = await getTour(id);
        setNaamLocatie(tour.naamLocatie);
        const init = fasesList.reduce((acc,f) => {
          acc[f] = [{ id: uuidv4(), title: "Sectie 1", components: tour.fases[f]||[] }];
          return acc;
        }, {} as FaseSections);
        setSectionsByFase(init);
      } catch {
        toast.error("Kon tour niet laden");
      } finally {
        setLoading(false);
      }
    })();
  },[id,nav]);

  if (loading) return <div className="p-6 animate-pulse">Laden…</div>;
  const sec = sectionsByFase[activeFase][activeSectionIndex]!;

  const addSection = () => {
    const newSec: Section = { id: uuidv4(), title: "Nieuwe sectie", components: [] };
    setSectionsByFase(prev => ({ ...prev, [activeFase]: [...prev[activeFase], newSec] }));
    setActiveSectionIndex(i=>i+1);
    setSelectedComp(null);
  };
  const updateSectionTitle = (title:string) => {
    setSectionsByFase(prev => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s,i)=> i===activeSectionIndex?{...s,title}:s)
    }));
  };

  const addComponent = (type:ComponentType) => {
    const comp:ComponentItem = { id: uuidv4(), type, props:{} };
    // initialize comp.props here...
    setSectionsByFase(prev => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s,i)=>
        i===activeSectionIndex?{...s,components:[...s.components,comp]}:s
      )
    }));
    setSelectedComp(comp);
  };
  const updateComponent = (c:ComponentItem) => {
    setSectionsByFase(prev => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s,i)=>
        i===activeSectionIndex?{...s,components:s.components.map(x=>x.id===c.id?c:x)}:s
      )
    }));
    setSelectedComp(c);
  };
  const deleteComponent = (cid:string) => {
    setSectionsByFase(prev => ({
      ...prev,
      [activeFase]: prev[activeFase].map((s,i)=>
        i===activeSectionIndex?{...s,components:s.components.filter(x=>x.id!==cid)}:s
      )
    }));
    if(selectedComp?.id===cid) setSelectedComp(null);
  };
  const onDragEnd = (res:DropResult) => {
    if(!res.destination) return;
    const comps = Array.from(sec.components);
    const [m] = comps.splice(res.source.index,1);
    comps.splice(res.destination.index,0,m);
    setSectionsByFase(prev=>({
      ...prev,
      [activeFase]: prev[activeFase].map((s,i)=>
        i===activeSectionIndex?{...s,components:comps}:s
      )
    }));
  };

  const save = async() => {
    setSaving(true);
    try {
      const payload = fasesList.reduce((acc,f)=> {
        acc[f] = sectionsByFase[f].flatMap(s=>s.components);
        return acc;
      },{} as Record<Fase,ComponentItem[]>);
      await updateTour(id!,{naamLocatie,fases:payload});
      toast.success("Opgeslagen!");
    } catch {
      toast.error("Fout bij opslaan");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="flex justify-between items-center p-4 border-b">
        <input
          value={naamLocatie}
          onChange={e=>setNaamLocatie(e.target.value)}
          className="text-2xl font-bold border-b px-2 py-1"
        />
        <div className="flex items-center space-x-2">
          <button
            onClick={()=>setPreviewMode(pm=>!pm)}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            {previewMode?"Terug":"Preview"}
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {saving?"Opslaan...":"Opslaan"}
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {!previewMode && <ComponentPalette onAdd={addComponent}/>}

        <BuilderCanvas
          components={sec.components}
          onDragEnd={onDragEnd}
          onSelect={setSelectedComp}
          onDelete={deleteComponent}
          preview={previewMode}
        />

        {!previewMode && selectedComp && (
          <SettingsPanel
            comp={selectedComp}
            onUpdate={updateComponent}
            sectionTitle={sec.title}
            onSectionTitleChange={updateSectionTitle}
          />
        )}
      </div>

      <BottomNav
        fases={fasesList}
        sectionsByFase={sectionsByFase}
        activeFase={activeFase}
        activeSectionIndex={activeSectionIndex}
        onFaseChange={f=>{ setActiveFase(f); setActiveSectionIndex(0); setSelectedComp(null); }}
        onSectionChange={i=>{ setActiveSectionIndex(i); setSelectedComp(null); }}
        onAddSection={addSection}
      />

      <ToastContainer position="bottom-right" autoClose={3000}/>
    </div>
  );
}
