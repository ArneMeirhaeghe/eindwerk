import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "../components/LoadingIndicator";

export default function PublicEntryPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setLoading(true);
    // Best check je hier nog even of de sessie bestaat, maar
    // navigeren is voldoende; 404 wordt in PublicSessionPage afgehandeld
    navigate(`/public/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-xl font-semibold mb-4 text-center">
          Vul sessie-code in
        </h1>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Sessie-code"
          className="w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring focus:ring-blue-200"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? <LoadingIndicator  /> : "Start"}
        </button>
      </form>
    </div>
);
}
