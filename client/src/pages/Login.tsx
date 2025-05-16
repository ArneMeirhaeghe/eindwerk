import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login as loginApi } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import FloatingInput from "../components/FloatingInput"

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { token } = await loginApi({ email, password })
      login(token, remember)
      navigate("/")
    } catch {
      setError("Ongeldige login.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-center">🔐 Inloggen</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <FloatingInput
          type="email"
          name="email"
          label="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <FloatingInput
          type="password"
          name="password"
          label="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label className="text-sm flex items-center space-x-2">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Blijf ingelogd</span>
        </label>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <div className="text-center text-sm">
        Nog geen account?{" "}
        <Link to="/register" className="text-blue-600 underline">
          Registreer hier
        </Link>
      </div>
    </div>
  )
}

export default Login
