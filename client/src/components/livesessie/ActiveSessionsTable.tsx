// File: src/components/ActiveSessionsTable.tsx

import type { LiveSessionDto } from "../../api/verhuur/types";

interface ActiveSessionsTableProps {
  sessions: LiveSessionDto[];
  onEndSession: (id: string) => void;
  onCopyCode: (id: string) => void;
  onCopyLink: (id: string) => void;
}

export default function ActiveSessionsTable({
  sessions,
  onEndSession,
  onCopyCode,
  onCopyLink,
}: ActiveSessionsTableProps) {
  return (
    <div className="overflow-auto">
      <table className="min-w-full border-collapse shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">Groep</th>
            <th className="p-2 border-b text-left">Tour Naam</th>
            <th className="p-2 border-b text-left">Code</th>
            <th className="p-2 border-b text-left">Aangemaakt op</th>
            <th className="p-2 border-b text-left">Status</th>
            <th className="p-2 border-b text-left">Acties</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50">
              <td className="p-2 border-b">{s.groep}</td>
              <td className="p-2 border-b">{s.tourName}</td>
              <td className="p-2 border-b">
                <button
                  onClick={() => onCopyCode(s.id)}
                  className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Copy Code
                </button>
              </td>
              <td className="p-2 border-b">
                {new Date(s.startDate).toLocaleString()}
              </td>
              <td className="p-2 border-b">
                {s.isActive ? (
                  <span className="px-2 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                    Actief
                  </span>
                ) : (
                  <span className="px-2 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                    Beëindigd
                  </span>
                )}
              </td>
              <td className="p-2 border-b space-x-2">
                <button
                  onClick={() => onCopyLink(s.id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  Kopieer Link
                </button>
                {s.isActive && (
                  <button
                    onClick={() => onEndSession(s.id)}
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
  );
}
