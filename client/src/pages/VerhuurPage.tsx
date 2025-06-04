// File: client/src/pages/VerhuurPage.tsx
import { useEffect, useState } from 'react';
import {
  getActiveLiveSessions,
  getToursList,
  getVerhuurperiodes,
  startLiveSession,
  type VerhuurPeriode,
  type LiveSessionDto,
  type TourListDto,
} from '../api/verhuur';
import ErrorMessage from '../components/ErrorMessage';
import LoadingIndicator from '../components/LoadingIndicator';
import { useNavigate } from 'react-router-dom';

export default function VerhuurPage() {
  const [verhuur, setVerhuur] = useState<VerhuurPeriode[]>([]);
  const [tours, setTours] = useState<TourListDto[]>([]);
  const [liveSessions, setLiveSessions] = useState<LiveSessionDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  // Ophalen verhuurperiodes
  const fetchVerhuurperiodes = async () => {
    setLoading(true);
    setError('');
    try {
      const periodes = await getVerhuurperiodes();
      setVerhuur(periodes);
    } catch (err: any) {
      console.error('Kan verhuurperiodes niet laden:', err);
      setError('Kan verhuurperiodes niet laden');
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
      console.error('Kan tours niet laden:', err);
    }
  };

  // Ophalen actieve live-sessies
  const fetchLiveSessions = async () => {
    try {
      const sessies = await getActiveLiveSessions();
      setLiveSessions(sessies);
    } catch (err: any) {
      console.error('Kan live-sessies niet laden:', err);
      setError('Kan live-sessies niet laden');
    }
  };

  // Start live-sessie
  const handleTourSelect = async (groep: string, tourId: string) => {
    try {
      await startLiveSession(groep, tourId);
      await fetchLiveSessions();
    } catch (err: any) {
      console.error('Kan live-sessie niet starten:', err);
      if (err.response?.data?.message) {
        alert('Fout vanuit server: ' + err.response.data.message);
      } else {
        alert('Er ging iets mis bij het starten van de live-sessie.');
      }
    }
  };

  useEffect(() => {
    fetchVerhuurperiodes();
    fetchTours();
    fetchLiveSessions();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Verhuur Overzicht</h1>

      {loading && <LoadingIndicator />}

      {error && <ErrorMessage message={error} />}

      {/* Verhuurperiodes */}
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
                  <td className="border px-4 py-2">{v.verantwoordelijke.naam}</td>
                  <td className="border px-4 py-2">
                    {v.verantwoordelijke.tel} / {v.verantwoordelijke.mail}
                  </td>
                  <td className="border px-4 py-2">
                    <select
                      onChange={e => handleTourSelect(v.groep, e.target.value)}
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
                <td className="border px-4 py-2">{s.tour.naamLocatie}</td>
                <td className="border px-4 py-2">
                  {new Date(s.startDate).toLocaleString()}
                </td>
                <td className="border px-4 py-2">
                  {s.isActive ? 'Actief' : 'Beëindigd'}
                </td>
                <td className="border px-4 py-2">
                  {/* Navigeren naar mobiele weergave van fase-navigatie */}
                  <button
                    onClick={() => navigate(`/public/${s.id}`)}
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
