import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";

const GroepDetailPage = () => {
  const { groepId } = useParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await API.get("/fakeapi/verhuurperiodes");
        const groepData = res.data.find(
          (r: any) => r.groep.toLowerCase().replace(/\s+/g, "-") === groepId
        );
        if (!groepData) {
          setError("Groep niet gevonden");
        } else {
          setData(groepData);
        }
      } catch (err: any) {
        setError("Kan data niet laden");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [groepId]);

  if (loading) return <div className="p-4">Laden...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Detail van {data.groep}</h2>
      <pre className="bg-gray-100 p-4 rounded overflow-auto">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
};

export default GroepDetailPage;
