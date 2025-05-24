import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardCopy } from "lucide-react";
import API from "../api/axios";

type VerhuurPeriode = {
  groep: string;
  verantwoordelijke: {
    naam: string;
    tel: string;
    mail: string;
  };
  aankomst: string;
  vertrek: string;
};

const VerhuurPage = () => {
  const [sessies, setSessies] = useState<VerhuurPeriode[]>([]);
  const navigate = useNavigate();

const fetchSessies = async () => {
  try {
    const res = await API.get("/fakeapi/verhuurperiodes");
    setSessies(res.data);
  } catch (err: any) {
    console.error("API fout:", err?.response?.data || err.message);
  }
};

  const copyLink = (groep: string) => {
    const link = `${window.location.origin}/sessie/${groep.toLowerCase().replace(/\s+/g, "-")}`;
    navigator.clipboard.writeText(link);
    alert("Link gekopieerd!");
  };

  useEffect(() => {
    fetchSessies();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Verhuur Overzicht</h1>
      <button
        onClick={fetchSessies}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Herlaad data
      </button>
      <table className="w-full border shadow rounded">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2">Groep</th>
            <th className="p-2">Verantwoordelijke</th>
            <th className="p-2">Aankomst</th>
            <th className="p-2">Vertrek</th>
            <th className="p-2">Acties</th>
          </tr>
        </thead>
        <tbody>
          {sessies.map((s) => (
            <tr key={s.groep} className="border-t">
              <td
                className="p-2 text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate(`/groep/${s.groep.toLowerCase().replace(/\s+/g, "-")}`)}
              >
                {s.groep}
              </td>
              <td className="p-2">{s.verantwoordelijke.naam}</td>
              <td className="p-2">{new Date(s.aankomst).toLocaleString()}</td>
              <td className="p-2">{new Date(s.vertrek).toLocaleString()}</td>
              <td className="p-2">
                <button onClick={() => copyLink(s.groep)}>
                  <ClipboardCopy size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VerhuurPage;
