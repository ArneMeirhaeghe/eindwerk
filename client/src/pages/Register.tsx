// File: src/pages/Register.tsx

import { useState } from "react"
import { Link } from "react-router-dom"
import { registerUser } from "../api/auth"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await registerUser(email, password)
      setSuccess("Registratie gelukt. Je wordt doorgestuurd...")
      setTimeout(() => (window.location.href = "/login"), 1500)
    } catch (err: any) {
      setError(err.response?.data || "Registratie mislukt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Info */}
      <div className="bg-green-600 text-white w-full lg:w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Start met Vlot Verhuurd</h1>
        <p className="text-lg mb-6 max-w-md">
          Verhuur je een lokaal of gebouw? Maak gratis je account aan en ontdek hoe je via digitale rondleidingen en slimme sessiebeheer tijd wint en fouten voorkomt.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-green-100">
          <li>Beheer al je verhuuractiviteiten centraal</li>
          <li>Gebruik je eigen structuur en flow</li>
          <li>Toon huurders enkel wat ze echt nodig hebben</li>
          <li>Geen installatie nodig – gewoon een link</li>
        </ul>
      </div>

      {/* Registratieformulier */}
      <div className="w-full lg:w-1/2 p-8 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md border">
          <h2 className="text-2xl font-bold mb-6 text-center">Registreren</h2>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-mailadres"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Wachtwoord"
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Even geduld..." : "Registreren"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm">
            Al een account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Log hier in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
