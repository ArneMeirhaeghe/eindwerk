// File: src/pages/VerhuurPage.tsx

import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";
import ErrorMessage from "../components/ErrorMessage";

import {
  getVerhuurperiodes,
  getAllLiveSessions,
  startLiveSession,
} from "../api/verhuur";
import { getToursList, getTour } from "../api/tours";
import { endLiveSession } from "../api/liveSession";

import type {
  VerhuurPeriode,
  LiveSessionDto,
  StartSessionDto,
} from "../api/verhuur/types";
import type { TourListDto, Tour, SectionDto } from "../api/tours/types";

export default function VerhuurPage() {
  const navigate = useNavigate();

  // Deel 1: Nieuwe sessie
  const [periodes, setPeriodes] = useState<VerhuurPeriode[]>([]);
  const [tours, setTours] = useState<TourListDto[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<VerhuurPeriode | null>(null);
  const [selectedTourId, setSelectedTourId] = useState("");
  const [tourDetail, setTourDetail] = useState<Tour | null>(null);
  const [chosenSections, setChosenSections] = useState<string[]>([]);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Deel 2 & 3: Overzicht sessies
  const [allSessions, setAllSessions] = useState<LiveSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // laad initiële data
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [pds, tls, sessies] = await Promise.all([
          getVerhuurperiodes(),
          getToursList(),
          getAllLiveSessions(),
        ]);
        setPeriodes(pds);
        setTours(tls);
        setAllSessions(sessies);
      } catch (e) {
        console.error(e);
        setError("Kon data niet laden");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // laad tour-detail
  useEffect(() => {
    if (!selectedTourId) {
      setTourDetail(null);
      setChosenSections([]);
      return;
    }
    getTour(selectedTourId).then(setTourDetail).catch(console.error);
  }, [selectedTourId]);

  // split actieve vs verlopen
  const activeSessions = useMemo(
    () => allSessions.filter((s) => s.isActive),
    [allSessions]
  );
  const pastSessions = useMemo(
    () => allSessions.filter((s) => !s.isActive),
    [allSessions]
  );
  const filteredPast = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return pastSessions.filter((s) =>
      s.groep.toLowerCase().includes(term) ||
      new Date(s.startDate).toLocaleDateString().includes(term)
    );
  }, [pastSessions, searchTerm]);

  // filter periodes: verberg groepen met actieve sessie
  const availablePeriodes = useMemo(
    () => periodes.filter(p => !activeSessions.some(s => s.groep === p.groep)),
    [periodes, activeSessions]
  );

  // start nieuwe sessie
  const handleStart = async () => {
    if (!selectedPeriode || !tourDetail || chosenSections.length === 0) {
      setCreateError("Kies periode, tour én minstens één sectie");
      return;
    }
    setCreating(true);
    setCreateError("");
    try {
      const dto: StartSessionDto = {
        verhuurderId: selectedPeriode.verhuurderId,
        groep: selectedPeriode.groep,
        verantwoordelijkeNaam: selectedPeriode.verantwoordelijke.naam,
        verantwoordelijkeTel: selectedPeriode.verantwoordelijke.tel,
        verantwoordelijkeMail: selectedPeriode.verantwoordelijke.mail,
        aankomst: selectedPeriode.aankomst,
        vertrek: selectedPeriode.vertrek,
        tourId: selectedTourId,
        tourName: tours.find(t => t.id === selectedTourId)?.naamLocatie || "",
        sectionIds: chosenSections,
      };
      const session = await startLiveSession(selectedPeriode, selectedTourId, dto.tourName, chosenSections);
      navigate(`/sessions/${session.id}/responses`);
    } catch (e) {
      console.error(e);
      setCreateError("Kon sessie niet starten");
    } finally {
      setCreating(false);
    }
  };

  // sessie beëindigen
  const handleEnd = async (id: string) => {
    if (!confirm("Wil je deze sessie echt beëindigen?")) return;
    await endLiveSession(id);
    setAllSessions(s => s.map(x => x.id === id ? { ...x, isActive: false } : x));
  };

  // helper: kopieer tekst naar clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  if (loading) return <LoadingIndicator />;
  if (error)   return <ErrorMessage message={error} />;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      {/* Deel 1: Nieuwe sessie */}
      <section className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Nieuwe Live-sessie</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">Periode</label>
            <select
              value={selectedPeriode?.id || ""}
              onChange={e => setSelectedPeriode(
                availablePeriodes.find(p => p.id === e.target.value) || null
              )}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">– kies periode –</option>
              {availablePeriodes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.groep} ({new Date(p.aankomst).toLocaleDateString()}–{new Date(p.vertrek).toLocaleDateString()})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1">Tour</label>
            <select
              value={selectedTourId}
              onChange={e => setSelectedTourId(e.target.value)}
              className="w-full border rounded px-3 py-2"
            >
              <option value="">– kies tour –</option>
              {tours.map(t => (
                <option key={t.id} value={t.id}>{t.naamLocatie}</option>
              ))}
            </select>
          </div>
        </div>

        {tourDetail && (
          <div className="mt-4">
            <label className="block font-medium mb-1">Secties</label>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded p-2">
              {Object.entries(tourDetail.fases).map(([fase, secs]) => (
                <div key={fase}>
                  <div className="font-medium">{fase}</div>
                  <div className="pl-4 space-y-1">
                    {secs.map((sec: SectionDto) => (
                      <label key={sec.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={chosenSections.includes(sec.id)}
                          onChange={e => setChosenSections(cs =>
                            e.target.checked
                              ? [...cs, sec.id]
                              : cs.filter(id => id !== sec.id)
                          )}
                          className="mr-2"
                        />
                        {sec.naam}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {createError && <p className="text-red-600 mt-2">{createError}</p>}
        <button
          onClick={handleStart}
          disabled={creating}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? "Bezig..." : "Start sessie"}
        </button>
      </section>

      {/* Deel 2: Actieve sessies */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Actieve sessies</h2>
        {activeSessions.length === 0 ? (
          <p className="text-gray-500">Geen actieve sessies.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Groep</th>
                  <th className="px-4 py-2 text-left">Tour</th>
                  <th className="px-4 py-2 text-left">Start</th>
                  <th className="px-4 py-2 text-left">Vertrek</th>
                  <th className="px-4 py-2 text-left">Link</th>
                  <th className="px-4 py-2 text-left">Code</th>
                  <th className="px-4 py-2 text-left">Beëindig</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeSessions.map(s => {
                  const pubUrl = `${window.location.origin}/public/${s.id}`;
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-blue-600">
                        <Link to={`/sessions/${s.id}/responses`}>{s.groep}</Link>
                      </td>
                      <td className="px-4 py-2">{s.tourName}</td>
                      <td className="px-4 py-2">{new Date(s.startDate).toLocaleString()}</td>
                      <td className="px-4 py-2">{new Date(s.vertrek).toLocaleDateString()}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => copyToClipboard(pubUrl)}
                          className="text-blue-600 hover:underline"
                        >
                          Kopieer link
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => copyToClipboard(s.id)}
                          className="text-blue-600 hover:underline"
                        >
                          Kopieer code
                        </button>
                      </td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleEnd(s.id)}
                          className="text-red-600 hover:underline"
                        >
                          Einde
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Deel 3: Verlopen sessies */}
      <section className="pt-8">
        <h2 className="text-xl font-semibold mb-4">Verlopen sessies doorzoeken</h2>
        <input
          type="text"
          placeholder="Zoek op groep of datum"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full mb-4 border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
        />
        {filteredPast.length === 0 ? (
          <p className="text-gray-500">Geen sessies gevonden.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Groep</th>
                  <th className="px-4 py-2 text-left">Tour</th>
                  <th className="px-4 py-2 text-left">Start</th>
                  <th className="px-4 py-2 text-left">Vertrek</th>
                  <th className="px-4 py-2 text-left">Bekijk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPast.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 font-medium text-blue-600">
                      <Link to={`/sessions/${s.id}/responses`}>{s.groep}</Link>
                    </td>
                    <td className="px-4 py-2">{s.tourName}</td>
                    <td className="px-4 py-2">{new Date(s.startDate).toLocaleString()}</td>
                    <td className="px-4 py-2">{new Date(s.vertrek).toLocaleDateString()}</td>
                    <td className="px-4 py-2">
                      <Link to={`/sessions/${s.id}/responses`} className="text-blue-600 hover:underline">
                        Bekijk
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
