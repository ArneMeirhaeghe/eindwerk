import { useState } from "react"
import { Link } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { loginUser } from "../api/auth"

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [show, setShow] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const toggleShow = () => setShow((prev) => !prev)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const token = await loginUser(email, password)
      login(token, remember)
      window.location.href = "/"
    } catch (err: any) {
      setError(err.response?.data || "Login mislukt")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Info gedeelte */}
      <div className="bg-blue-600 text-white w-full lg:w-1/2 p-10 flex flex-col justify-center">
        <h1 className="text-4xl font-bold mb-4">Welkom bij Vlot Verhuurd</h1>
        <p className="text-lg mb-6 max-w-md">
          Een slimme webtool om jeugdlokalen, zalen of huisjes eenvoudig digitaal te verhuren.
        </p>
        <ul className="list-disc list-inside space-y-2 text-sm text-blue-100">
          <li>Stel digitale rondleidingen samen in 5 fases</li>
          <li>Laat huurders zelfstandig het gebouw ontdekken</li>
          <li>Bekijk live antwoorden, van wat je zelf wil weten</li>
          <li>Geen app nodig, enkel een unieke link</li>
        </ul>
      </div>

      {/* Login gedeelte */}
      <div className="w-full lg:w-1/2 p-6 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md ring-1 ring-gray-100 p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Inloggen</h2>
          {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="E-mailadres"
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="Wachtwoord"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={toggleShow}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-300 border-gray-300 rounded"
              />
              Ingelogd blijven
            </label>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Bezig..." : "Inloggen"}
            </button>
          </form>
          <p className="text-center mt-4 text-sm text-gray-600">
            Nog geen account?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registreer hier
            </Link>
          </p>
        </div>
      </div>
    </div>
)
}
