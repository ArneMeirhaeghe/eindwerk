// File: src/pages/SessionResponsesPage.tsx

import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";
import { getLiveSession } from "../api/liveSession";
import type { LiveSessionDto, ComponentSnapshot } from "../api/liveSession/types";

export default function SessionResponsesPage() {
  const { id } = useParams<{ id: string }>();
  const [session, setSession] = useState<LiveSessionDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setSession(await getLiveSession(id!));
      } catch {
        setError("Kon sessie niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const getResp = (secId: string, compId: string) =>
    session?.responses[secId]?.[compId] as any;

  if (loading) return <LoadingIndicator />;
  if (error || !session) return <ErrorMessage message={error || "Geen data"} />;

  return (
    <div className="p-4 space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl font-semibold text-center">Responses: {session.groep}</h1>
      {Object.entries(session.fases).map(([fase, secs]) => (
        <div key={fase}>
          <h2 className="text-xl font-semibold">{fase.toUpperCase()}</h2>
          <div className="space-y-4">
            {secs.map((sec) => (
              <div key={sec.id} className="border rounded-lg p-4 space-y-3">
                <h3 className="font-medium">{sec.naam}</h3>
                {sec.components.map((comp: ComponentSnapshot) => {
                  const resp = getResp(sec.id, comp.id);
                  if (!resp) return null;
                  return (
                    <div key={comp.id} className="space-y-1">
                      <div className="font-medium">{comp.props.label || comp.type}</div>
                      {resp.url ? (
                        <div>
                          <img src={resp.url} alt={resp.fileName} className="max-w-full rounded" />
                          <a
                            href={resp.url}
                            download={resp.fileName}
                            className="block mt-1 text-blue-600 hover:underline"
                          >
                            Download {resp.fileName}
                          </a>
                        </div>
                      ) : (
                        <span>{String(resp)}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
