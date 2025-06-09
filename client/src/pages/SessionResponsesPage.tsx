// File: src/pages/SessionResponsesPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import { getLiveSession } from "../api/liveSession";
import type {
  LiveSessionDto,
  SectionSnapshot,
  ComponentSnapshot,
} from "../api/liveSession/types";

export default function SessionResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<LiveSessionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    (async () => {
      try {
        const data = await getLiveSession(id!);
        setSession(data);
        // init collapse state
        const opens: Record<string, boolean> = {};
        Object.values(data.fases).flat().forEach((sec: SectionSnapshot) => {
          opens[sec.id] = false;
        });
        setOpenSections(opens);
      } catch (e) {
        console.error(e);
        setError("Kon sessie niet laden");
        navigate("/verhuur");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  if (loading) return <LoadingIndicator />;
  if (error || !session) return <ErrorMessage message={error || "Geen data"} />;

  const getResponse = (sectionId: string, compId: string) =>
    session.responses?.[sectionId]?.[compId];

  const renderValue = (value: unknown) => {
    if (value == null) return <span className="text-gray-400">– niet ingevuld –</span>;
    if (Array.isArray(value))
      return (
        <ul className="list-disc list-inside">
          {value.map((v, i) => (
            <li key={i}>{String(v)}</li>
          ))}
        </ul>
      );
    if (typeof value === "object" && (value as any).url)
      return (
        <a
          href={(value as any).url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {(value as any).filename || "Download bestand"}
        </a>
      );
    return <span>{String(value)}</span>;
  };

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-center">
        Responses: {session.groep}
      </h1>

      {Object.entries(session.fases).map(([fase, sections]) => (
        <div key={fase}>
          <h2 className="text-xl font-semibold">{fase.toUpperCase()}</h2>
          <div className="space-y-4">
            {sections.map((sec: SectionSnapshot) => (
              <div key={sec.id} className="border rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setOpenSections((o) => ({ ...o, [sec.id]: !o[sec.id] }))
                  }
                  className="w-full bg-gray-100 px-4 py-2 text-left flex justify-between items-center"
                >
                  <span className="font-medium">{sec.naam}</span>
                  <span>{openSections[sec.id] ? "▾" : "▸"}</span>
                </button>
                {openSections[sec.id] && (
                  <div className="p-4 space-y-3">
                    {sec.components.map((comp: ComponentSnapshot) => (
                      <div key={comp.id} className="space-y-1">
                        <div className="font-medium text-gray-700">
                          {comp.props.label ?? comp.type}
                        </div>
                        <div className="pl-2">
                          {renderValue(getResponse(sec.id, comp.id))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
