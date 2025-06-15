// File: src/pages/NotFound.tsx

import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white max-w-md w-full rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">404 – Pagina niet gevonden</h1>
        <p className="text-gray-600 mb-6">
          Oeps! De pagina die je zoekt bestaat niet of is verplaatst.
        </p>
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          <ArrowLeft className="mr-2" size={18} />
          Terug naar home
        </Link>
      </div>
    </div>
  )
}
