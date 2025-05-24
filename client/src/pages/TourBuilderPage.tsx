// src/pages/TourBuilderPage.tsx

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTour, updateTour, type Tour } from "../api/tours";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

export type ComponentType = "title" | "paragraph" | "image" | "checklist";

interface ComponentItem {
  id: string;
  type: ComponentType;
  props: any;
}

type Fase = "voor" | "aankomst" | "terwijl" | "vertrek" | "na";
type Fases = Record<Fase, ComponentItem[]>;

const faseOrder: Fase[] = ["voor", "aankomst", "terwijl", "vertrek", "na"];

export default function TourBuilderPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [naamLocatie, setNaamLocatie] = useState("");
  const [fases, setFases] = useState<Fases>({
    voor: [],
    aankomst: [],
    terwijl: [],
    vertrek: [],
    na: [],
  });
  const [activeFase, setActiveFase] = useState<Fase>("voor");
  const [selectedComp, setSelectedComp] = useState<ComponentItem | null>(null);

  // Load tour data
  useEffect(() => {
    if (!id) {
      navigate("/tours");
      return;
    }
    setLoading(true);
    setError(null);

    getTour(id)
      .then((tour: Tour) => {
        setNaamLocatie(tour.naamLocatie);
        setFases(tour.fases as Fases);
      })
      .catch((err: any) => {
        console.error("GET /api/tours/:id failed:", err);
        if (err.response?.status === 404) {
          setError("Tour niet gevonden");
          navigate("/tours");
        } else {
          setError("Fout bij laden tour");
        }
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  // Add new component to active phase
  const addComponent = (type: ComponentType) => {
    const comp: ComponentItem = {
      id: crypto.randomUUID(),
      type,
      props:
        type === "checklist"
          ? { items: [""] }
          : type === "image"
          ? { url: "" }
          : { text: "" },
    };
    setFases((prev) => ({
      ...prev,
      [activeFase]: [...prev[activeFase], comp],
    }));
    setSelectedComp(comp);
  };

  // Update component props
  const updateComponent = (comp: ComponentItem) => {
    setFases((prev) => ({
      ...prev,
      [activeFase]: prev[activeFase].map((c) => (c.id === comp.id ? comp : c)),
    }));
    setSelectedComp(comp);
  };

  // Save tweaks back to backend
  const save = async () => {
    if (!id) return;
    setSaving(true);
    setError(null);
    console.log(`PUT /api/tours/${id} payload:`, { naamLocatie, fases });

    try {
      await updateTour(id, { naamLocatie, fases });
      alert("Wijzigingen opgeslagen!");
    } catch (err: any) {
      console.error("PUT /api/tours/:id error:", err);
      const data = err.response?.data;
      const msg =
        typeof data === "string"
          ? data
          : data?.message || JSON.stringify(data);
      setError(msg || "Fout bij opslaan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Laden…</div>;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <aside className="w-1/5 border-r p-4 flex flex-col gap-2">
        <h3 className="font-semibold">Componenten</h3>
        {(["title", "paragraph", "image", "checklist"] as ComponentType[]).map(
          (type) => (
            <button
              key={type}
              onClick={() => addComponent(type)}
              className="w-full p-2 bg-gray-100 rounded hover:bg-gray-200 text-left"
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          )
        )}
        <button
          onClick={() => navigate("/tours")}
          className="mt-auto text-sm text-gray-600 hover:underline"
        >
          ← Overzicht
        </button>
      </aside>

      {/* Main builder view */}
      <div className="flex-1 flex flex-col">
        <header className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl">Builder: {naamLocatie}</h2>
          <button
            onClick={save}
            disabled={saving}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          >
            {saving ? "Opslaan..." : "Opslaan"}
          </button>
        </header>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded m-4">{error}</div>
        )}

        <div className="flex flex-1 overflow-hidden">
          {/* Preview area */}
          <div className="flex-1 bg-gray-50 p-4 overflow-auto">
            <div className="w-72 mx-auto bg-white border rounded-xl p-4 space-y-4">
              {fases[activeFase].map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComp(comp)}
                  className={`p-2 border rounded cursor-pointer ${
                    selectedComp?.id === comp.id ? "border-blue-500" : ""
                  }`}
                >
                  {comp.type === "title" && (
                    <h3 className="font-bold">{comp.props.text || "Titel…"} </h3>
                  )}
                  {comp.type === "paragraph" && (
                    <p>{comp.props.text || "Paragraaf…"} </p>
                  )}
                  {comp.type === "image" &&
                    (comp.props.url ? (
                      <img
                        src={comp.props.url}
                        alt=""
                        className="max-w-full"
                      />
                    ) : (
                      <div className="h-24 bg-gray-200 flex items-center justify-center">
                        Image URL…
                      </div>
                    ))}
                  {comp.type === "checklist" && (
                    <ul className="list-disc pl-5">
                      {comp.props.items.map((it: string, i: number) => (
                        <li key={i}>{it || "Item…"} </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Configuration panel */}
          <div className="w-1/4 border-l p-4 overflow-auto">
            <h3 className="font-semibold mb-2">Configuratie</h3>
            {!selectedComp && <p>Selecteer een component…</p>}
            {selectedComp && (
              <div className="space-y-2">
                {selectedComp.type === "title" && (
                  <input
                    type="text"
                    value={selectedComp.props.text}
                    onChange={(e) =>
                      updateComponent({
                        ...selectedComp,
                        props: { ...selectedComp.props, text: e.target.value },
                      })
                    }
                    className="w-full border p-1 rounded"
                  />
                )}
                {selectedComp.type === "paragraph" && (
                  <textarea
                    value={selectedComp.props.text}
                    onChange={(e) =>
                      updateComponent({
                        ...selectedComp,
                        props: { ...selectedComp.props, text: e.target.value },
                      })
                    }
                    className="w-full border p-1 rounded"
                  />
                )}
                {selectedComp.type === "image" && (
                  <input
                    type="text"
                    value={selectedComp.props.url}
                    onChange={(e) =>
                      updateComponent({
                        ...selectedComp,
                        props: { ...selectedComp.props, url: e.target.value },
                      })
                    }
                    className="w-full border p-1 rounded"
                    placeholder="Image URL"
                  />
                )}
                {selectedComp.type === "checklist" && (
                  <div className="space-y-1">
                    {selectedComp.props.items.map((it: string, i: number) => (
                      <div key={i} className="flex gap-2">
                        <input
                          type="text"
                          value={it}
                          onChange={(e) => {
                            const items = [...selectedComp.props.items];
                            items[i] = e.target.value;
                            updateComponent({
                              ...selectedComp,
                              props: { ...selectedComp.props, items },
                            });
                          }}
                          className="flex-1 border p-1 rounded"
                        />
                        <button
                          onClick={() => {
                            const items = selectedComp.props.items.filter(
                              (_: any, idx: number) => idx !== i
                            );
                            updateComponent({
                              ...selectedComp,
                              props: { ...selectedComp.props, items },
                            });
                          }}
                          className="text-red-500"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const items = [...selectedComp.props.items, ""];
                        updateComponent({
                          ...selectedComp,
                          props: { ...selectedComp.props, items },
                        });
                      }}
                      className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                      Item toevoegen
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <footer className="p-2 border-t">
          <Tabs
            selectedIndex={faseOrder.indexOf(activeFase)}
            onSelect={(i) => setActiveFase(faseOrder[i])}
          >
            <TabList className="flex justify-around">
              {faseOrder.map((f) => (
                <Tab
                  key={f}
                  className={f === activeFase ? "font-bold text-blue-600" : ""}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Tab>
              ))}
            </TabList>
            {faseOrder.map((f) => (
              <TabPanel key={f} />
            ))}
          </Tabs>
        </footer>
      </div>
    </div>
  );
}
