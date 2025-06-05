// File: client/src/pages/PublicEntryPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function PublicEntryPage() {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      alert("Vul een geldige sessiecode in.");
      return;
    }
    // Verwijder spaties en maak lowercase
    const cleaned = code.trim();
    navigate(`/public/${cleaned}`);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Live‐sessie Toegang</h1>
        <label htmlFor="sessionCode" className="block text-sm font-medium text-gray-700 mb-2">
          Voer sessiecode in:
        </label>
        <input
          id="sessionCode"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Bv. 684198a7f903dc62885121a"
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Open sessie
        </button>
      </form>
    </div>
  );
}
