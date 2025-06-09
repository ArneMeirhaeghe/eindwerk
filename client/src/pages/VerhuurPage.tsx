import { useEffect, useState, useMemo } from "react";
import {
         // ← zorg dat deze functie bestaat in src/api/verhuur/index.ts
  getActiveLiveSessions,
  getVerhuurperiodes,
  startLiveSession,
} from "../api/verhuur";
import { getTour, getToursList } from "../api/tours";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

import type { LiveSessionDto, VerhuurPeriode } from "../api/verhuur/types";
import type { Tour, TourListDto } from "../api/tours/types";

import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

interface SectionOption {
  fase: string;
  id: string;
  naam: string;
}

export default function VerhuurPage() {
  const [verhuur, setVerhuur] = useState<VerhuurPeriode[]>([]);
  const [tours, setTours] = useState<TourListDto[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const [isSelectingSections, setIsSelectingSections] = useState(false);
  const [selectedPeriode, setSelectedPeriode] = useState<VerhuurPeriode | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string>("");
  const [selectedTourName, setSelectedTourName] = useState<string>("");
  const [tourSections, setTourSections] = useState<SectionOption[]>([]);
  const [checkedSections, setCheckedSections] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  // 1) Verhuurperiodes laden
  const fetchVerhuurperiodes = async () => {
    setLoading(true);
    setError("");
    try {
      const periodes = await getVerhuurperiodes();
      setVerhuur(periodes);
    } catch (err: any) {
      console.error("Kan verhuurperiodes niet laden:", err);
      setError("Kan verhuurperiodes niet laden");
    } finally {
      setLoading(false);
    }
  };

  // 2) Tours laden (id + naam)
  const fetchTours = async () => {
    try {
      const lijst = await getToursList();
      setTours(lijst);
    } catch (err: any) {
      console.error("Kan tours niet laden:", err);
    }
  };

  // 3) Actieve live‐sessies laden
  const fetchLiveSessions = async () => {
    try {
      const sessies = await getActiveLiveSessions();
      setLiveSessions(sessies);
    } catch (err: any) {
      console.error("Kan live‐sessies niet laden:", err);
      setError("Kan live‐sessies niet laden");
    }
  };

  useEffect(() => {
    fetchVerhuurperiodes();
    fetchTours();
    fetchLiveSessions();
  }, []);

  // Alleen periodes waarvan vertrek >= nu en nog geen live‐sessie
  const availablePeriodes = useMemo(() => {
    const now = new Date();
    return verhuur.filter((p) => {
      const vertrekDate = new Date(p.vertrek);
      if (vertrekDate < now) return false;
      return !liveSessions.some(
        (s) =>
          s.verhuurderId === p.verhuurderId &&
          s.groep === p.groep &&
          new Date(s.aankomst).toISOString() === new Date(p.aankomst).toISOString() &&
          new Date(s.vertrek).toISOString() === new Date(p.vertrek).toISOString()
      );
    });
  }, [verhuur, liveSessions]);

  // 1. Verhuurperiode selecteren
  const handlePeriodeSelect = (id: string) => {
    const periode = verhuur.find((v) => v.id === id) || null;
    setSelectedPeriode(periode);
    setSelectedTourId("");
    setSelectedTourName("");
  };

  // 2. Tour selecteren → secties ophalen
  const handleTourSelect = async (tourId: string) => {
    if (!selectedPeriode) return;
    try {
      setSelectedTourId(tourId);
      const tour: Tour = await getTour(tourId);
      setSelectedTourName(tour.naamLocatie);

      const secties: SectionOption[] = [];
      Object.entries(tour.fases).forEach(([faseNaam, sectieArray]) => {
        sectieArray.forEach((secDto) => {
          secties.push({ fase: faseNaam, id: secDto.id, naam: secDto.naam });
        });
      });

      const initialChecked: Record<string, boolean> = {};
      secties.forEach((s) => {
        initialChecked[s.id] = true;
      });

      setTourSections(secties);
      setCheckedSections(initialChecked);
      setIsSelectingSections(true);
    } catch (err: any) {
      console.error("Fout bij ophalen tour‐secties:", err);
      alert("Kon de details van de tour niet laden.");
    }
  };

  // Checkbox toggle
  const toggleSectionChecked = (sectionId: string) => {
    setCheckedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Annuleer sectie‐selectie
  const cancelSectionSelection = () => {
    setIsSelectingSections(false);
    setTourSections([]);
    setCheckedSections({});
    setSelectedTourId("");
    setSelectedTourName("");
  };

  // 3. Live sessie starten met gekozen secties
  const confirmSectionSelection = async () => {
    if (!selectedPeriode || !selectedTourId) return;
    const chosenIds = Object.keys(checkedSections).filter((id) => checkedSections[id]);
    if (chosenIds.length === 0) {
      alert("Selecteer minstens één sectie.");
      return;
    }

    try {
      const newSession = await startLiveSession(
        selectedPeriode,
        selectedTourId,
        selectedTourName,
        chosenIds
      );
      await fetchLiveSessions();
      setIsSelectingSections(false);

      const publicUrl = `${window.location.origin}/public/${newSession.id}`;
      await navigator.clipboard.writeText(publicUrl);
      alert("Live‐sessie gestart! Link is gekopieerd.");
    } catch (err: any) {
      console.error("Kan live‐sessie niet starten:", err.response?.data || err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        alert("Fout vanaf server: " + serverMsg);
      } else {
        alert("Er ging iets mis bij het starten van de live‐sessie.");
      }
    } finally {
      setSelectedPeriode(null);
      setSelectedTourId("");
      setSelectedTourName("");
      setTourSections([]);
      setCheckedSections({});
    }
  };

  // Live sessie beëindigen
  const endSession = async (sessionId: string) => {
    if (!confirm("Weet je zeker dat je deze live‐sessie wilt beëindigen?")) return;
    try {
      await API.patch(`/livesession/${sessionId}/end`);
      await fetchLiveSessions();
    } catch (err: any) {
      console.error("Kon live‐sessie niet beëindigen:", err);
      alert("Er ging iets mis bij het beëindigen van de sessie.");
    }
  };

  // Copy session code
  const copyCode = async (sessionId: string) => {
    try {
      await navigator.clipboard.writeText(sessionId);
      alert("Sessiecode gekopieerd!");
    } catch {
      alert("Kon code niet kopiëren.");
    }
  };

  // Copy public link
  const copyLink = async (sessionId: string) => {
    const fullUrl = `${window.location.origin}/public/${sessionId}`;
    try {
      await navigator.clipboard.writeText(fullUrl);
      alert("Link gekopieerd!");
    } catch {
      alert("Kon link niet kopiëren.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center mb-4">Verhuur Overzicht</h1>

      {loading && <LoadingIndicator />}
      {error && <ErrorMessage message={error} />}

      {/* 1. Verhuurperiode kiezen */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-3">1. Kies Verhuurperiode</h2>
        <select
          onChange={(e) => handlePeriodeSelect(e.target.value)}
          value={selectedPeriode?.id || ""}
          className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="" disabled>
            Selecteer periode...
          </option>
          {availablePeriodes.map((v) => (
            <option key={v.id} value={v.id}>
              {v.groep} (
              {new Date(v.aankomst).toLocaleDateString()} -{" "}
              {new Date(v.vertrek).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>

      {/* 2. Tour kiezen */}
      {selectedPeriode && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-3">2. Kies Tour</h2>
          <select
            onChange={(e) => handleTourSelect(e.target.value)}
            defaultValue=""
            className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="" disabled>
              Selecteer tour...
            </option>
            {tours.map((t) => (
              <option key={t.id} value={t.id}>
                {t.naamLocatie}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* 3. Secties selecteren (modal) */}
      {isSelectingSections && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-96 overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 border-b">
              <h3 className="text-lg font-semibold">Secties selecteren</h3>
              <button
                onClick={cancelSectionSelection}
                className="text-gray-500 hover:text-gray-700 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <div className="px-4 py-2 overflow-y-auto max-h-72">
              {tourSections.length > 0 ? (
                tourSections.map((sec) => (
                  <label
                    key={sec.id}
                    className="flex items-center space-x-2 hover:bg-gray-50 rounded p-2"
                  >
                    <input
                      type="checkbox"
                      checked={checkedSections[sec.id] || false}
                      onChange={() => toggleSectionChecked(sec.id)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                    <span className="text-gray-900 font-medium">{sec.naam}</span>
                  </label>
                ))
              ) : (
                <p className="text-gray-500">Geen secties gevonden voor deze tour.</p>
              )}
            </div>
            <div className="flex justify-end px-4 py-3 border-t">
              <button
                onClick={cancelSectionSelection}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition mr-2"
              >
                Annuleren
              </button>
              <button
                onClick={confirmSectionSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Live‐sessie starten
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Actieve Live Sessies tabel */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Actieve Live Sessies</h2>
        {liveSessions.length === 0 ? (
          <p className="text-gray-500">Geen actieve live sessies.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Groep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Naam
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aangemaakt op
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acties
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {liveSessions.map((s) => (
                  <tr key={s.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {s.groep}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {s.tourName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => copyCode(s.id)}
                        className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                      >
                        Copy Code
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                      {new Date(s.startDate).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          s.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {s.isActive ? "Actief" : "Beëindigd"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => copyLink(s.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Kopieer Link
                      </button>
                      {s.isActive && (
                        <button
                          onClick={() => endSession(s.id)}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          Beëindigen
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
