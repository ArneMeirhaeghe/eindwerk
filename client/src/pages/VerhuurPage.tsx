// File: client/src/pages/VerhuurPage.tsx
import { useEffect, useState } from "react";
import {
  getActiveLiveSessions,
  getToursList,
  getVerhuurperiodes,
  startLiveSession,
  type VerhuurPeriode,
  type LiveSessionDto,
  type TourListDto,
} from "../api/verhuur";
import { getTour, type Tour } from "../api/tours";
import ErrorMessage from "../components/ErrorMessage";
import LoadingIndicator from "../components/LoadingIndicator";
import { useNavigate } from "react-router-dom";

// Typedef voor plat sectie‐selectie in modal
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
  const navigate = useNavigate();

  // --- State voor “selecteer secties” modal ---
  const [isSelectingSections, setIsSelectingSections] = useState(false);
  const [selectedGroep, setSelectedGroep] = useState<string>("");
  const [selectedTourId, setSelectedTourId] = useState<string>("");
  const [tourSections, setTourSections] = useState<SectionOption[]>([]);
  const [checkedSections, setCheckedSections] = useState<Record<string, boolean>>({});

  // Ophalen verhuurperiodes
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

  // Ophalen tours
  const fetchTours = async () => {
    try {
      const lijst = await getToursList();
      setTours(lijst);
    } catch (err: any) {
      console.error("Kan tours niet laden:", err);
    }
  };

  // Ophalen actieve live-sessies
  const fetchLiveSessions = async () => {
    try {
      const sessies = await getActiveLiveSessions();
      setLiveSessions(sessies);
    } catch (err: any) {
      console.error("Kan live-sessies niet laden:", err);
      setError("Kan live-sessies niet laden");
    }
  };

  useEffect(() => {
    fetchVerhuurperiodes();
    fetchTours();
    fetchLiveSessions();
  }, []);

  // Zodra gebruiker kiest in dropdown: haal tour‐details en open modal
  const handleTourChange = async (groep: string, tourId: string) => {
    try {
      // Bewaar tijdelijk de context
      setSelectedGroep(groep);
      setSelectedTourId(tourId);

      // Haal tour op om sectielijst te tonen
      const tour: Tour = await getTour(tourId);

      // Bouw platte lijst van alle secties met fase + id + naam
      const secties: SectionOption[] = [];
      Object.entries(tour.fases).forEach(([faseNaam, sectieArray]) => {
        sectieArray.forEach(secDto => {
          secties.push({
            fase: faseNaam,
            id: secDto.id,
            naam: secDto.naam,
          });
        });
      });

      // Zet alle secties aanvankelijk aangevinkt
      const initialChecked: Record<string, boolean> = {};
      secties.forEach(s => {
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

  // Gebruiker schakelt checkbox in modal aan/uit
  const toggleSectionChecked = (sectionId: string) => {
    setCheckedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Annuleer modal (reset state)
  const cancelSectionSelection = () => {
    setIsSelectingSections(false);
    setTourSections([]);
    setSelectedGroep("");
    setSelectedTourId("");
    setCheckedSections({});
  };

  // Bevestig: start Live‐sessie met alleen aangevinkte sectie IDs
  const confirmSectionSelection = async () => {
    try {
      const chosenIds = Object.keys(checkedSections).filter(id => checkedSections[id]);
      if (!selectedGroep || !selectedTourId || chosenIds.length === 0) {
        alert("Selecteer minstens één sectie.");
        return;
      }

      // Start sessie met sectielijst
      await startLiveSession(selectedGroep, selectedTourId, chosenIds);
      await fetchLiveSessions();
      setIsSelectingSections(false);

      // Vind nieuwe sessie en kopieer link
      const nieuwe = liveSessions.find(
        s => s.groep === selectedGroep && s.tour.id === selectedTourId
      );
      const publicUrl = nieuwe
        ? `${window.location.origin}/public/${nieuwe.id}`
        : `${window.location.origin}/public/`;
      await navigator.clipboard.writeText(publicUrl);
      alert("Live-sessie gestart! Link naar de sessie is gekopieerd.");
    } catch (err: any) {
      console.error("Kan live-sessie niet starten:", err.response?.data || err);
      const serverMsg = err.response?.data?.message;
      if (serverMsg) {
        alert("Fout vanaf server: " + serverMsg);
      } else {
        alert("Er ging iets mis bij het starten van de live-sessie.");
      }
    } finally {
      // Reset
      setSelectedGroep("");
      setSelectedTourId("");
      setTourSections([]);
      setCheckedSections({});
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verhuur Overzicht</h1>

      {loading && <LoadingIndicator />}

      {error && <ErrorMessage message={error} />}

      {/* Verhuurperiodes + Tour‐keuze */}
      {!loading && !error && verhuur.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-2">Verhuurperiodes</h2>
          <table className="w-full table-auto border-collapse mb-8">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">Groep</th>
                <th className="border px-4 py-2">Aankomst</th>
                <th className="border px-4 py-2">Vertrek</th>
                <th className="border px-4 py-2">Verantwoordelijke</th>
                <th className="border px-4 py-2">Contact</th>
                <th className="border px-4 py-2">Kies Tour</th>
              </tr>
            </thead>
            <tbody>
              {verhuur.map(v => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{v.groep}</td>
                  <td className="border px-4 py-2">
                    {new Date(v.aankomst).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {new Date(v.vertrek).toLocaleString()}
                  </td>
                  <td className="border px-4 py-2">
                    {v.verantwoordelijke.naam}
                  </td>
                  <td className="border px-4 py-2">
                    {v.verantwoordelijke.tel} / {v.verantwoordelijke.mail}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      onChange={e =>
                        handleTourChange(v.groep, e.target.value)
                      }
                      defaultValue=""
                      className="border rounded px-2 py-1 w-full"
                    >
                      <option value="" disabled>
                        Selecteer tour
                      </option>
                      {tours.map(t => (
                        <option key={t.id} value={t.id}>
                          {t.naamLocatie}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {!loading && !error && verhuur.length === 0 && (
        <div className="text-gray-500 mb-8">Geen verhuurperiodes gevonden.</div>
      )}

      {/* Modal: Selecteer Secties voor Live‐sessie */}
      {isSelectingSections && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <div className="bg-white rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 py-2 border-b">
              <h3 className="text-lg font-semibold">
                Secties selecteren
              </h3>
              <button
                onClick={cancelSectionSelection}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-4">
              {tourSections.map(sec => (
                <label
                  key={sec.id}
                  className="flex items-center space-x-2 mb-2"
                >
                  <input
                    type="checkbox"
                    checked={checkedSections[sec.id] || false}
                    onChange={() => toggleSectionChecked(sec.id)}
                  />
                  <span className="text-gray-700">
                    <strong className="capitalize">
                      {sec.fase}
                    </strong>
                    {" – "}
                    {sec.naam}
                  </span>
                </label>
              ))}
              {tourSections.length === 0 && (
                <p className="text-gray-500">
                  Geen secties gevonden in deze tour.
                </p>
              )}
            </div>
            <div className="flex justify-end px-4 py-2 border-t">
              <button
                onClick={cancelSectionSelection}
                className="mr-2 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
              >
                Annuleren
              </button>
              <button
                onClick={confirmSectionSelection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Start Live‐sessie
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actieve Live Sessies */}
      <h2 className="text-xl font-semibold mb-4">Actieve Live Sessies</h2>
      {!loading && !error && liveSessions.length === 0 && (
        <div className="text-gray-500">Geen actieve live sessies.</div>
      )}
      {!loading && !error && liveSessions.length > 0 && (
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Groep</th>
              <th className="border px-4 py-2">Tour Naam</th>
              <th className="border px-4 py-2">Gestart op</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Link</th>
            </tr>
          </thead>
          <tbody>
            {liveSessions.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{s.groep}</td>
                <td className="border px-4 py-2">
                  {s.tour.naamLocatie}
                </td>
                <td className="border px-4 py-2">
                  {new Date(s.startDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {s.isActive ? "Actief" : "Beëindigd"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() =>
                      navigate(`/public/${s.id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    Unieke Link
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
