// File: src/components/VerhuurTable.tsx

import type { TourListDto } from "../../api/tours"
import type { VerhuurPeriode } from "../../api/verhuur"

interface VerhuurTableProps {
  periodes: VerhuurPeriode[]
  tours: TourListDto[]
  onSelectTour: (groep: string, tourId: string) => void
}

export default function VerhuurTable({
  periodes,
  tours,
  onSelectTour,
}: VerhuurTableProps) {
  return (
    <div className="overflow-auto mb-8">
      <table className="min-w-full border-collapse shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border-b text-left">Groep</th>
            <th className="p-2 border-b text-left">Verantwoordelijke</th>
            <th className="p-2 border-b text-left">Telefoon</th>
            <th className="p-2 border-b text-left">Email</th>
            <th className="p-2 border-b text-left">Aankomst</th>
            <th className="p-2 border-b text-left">Vertrek</th>
            <th className="p-2 border-b text-left">Selecteer Tour</th>
          </tr>
        </thead>
        <tbody>
          {periodes.map((periode) => (
            <tr key={periode.groep} className="hover:bg-gray-50">
              <td className="p-2 border-b">{periode.groep}</td>
              <td className="p-2 border-b">{periode.verantwoordelijke.naam}</td>
              <td className="p-2 border-b">{periode.verantwoordelijke.tel}</td>
              <td className="p-2 border-b">{periode.verantwoordelijke.mail}</td>
              <td className="p-2 border-b">
                {new Date(periode.aankomst).toLocaleString()}
              </td>
              <td className="p-2 border-b">
                {new Date(periode.vertrek).toLocaleString()}
              </td>
              <td className="p-2 border-b">
                <select
                  value={periode.tourId || ""}
                  onChange={(e) =>
                    onSelectTour(periode.groep, e.target.value)
                  }
                  className="border px-2 py-1 rounded w-full"
                >
                  <option value="">— kies tour —</option>
                  {tours.map((t) => (
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
    </div>
  )
}
