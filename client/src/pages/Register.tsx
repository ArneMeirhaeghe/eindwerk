import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register as registerApi } from "../api/auth"
import { useAuth } from "../context/AuthContext"
import FloatingInput from "../components/FloatingInput"

function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email.includes("@") || !email.includes(".")) {
      return setError("Voer een geldig e-mailadres in.")
    }

    if (password.length < 6) {
      return setError("Wachtwoord moet minstens 6 tekens bevatten.")
    }

    if (password !== confirmPassword) {
      return setError("Wachtwoorden komen niet overeen.")
    }

    try {
      const { token } = await registerApi({ email, password })
      login(token, remember)
      navigate("/plans")
    } catch (err) {
      console.error(err)
      setError("Registratie mislukt. Mogelijk bestaat dit e-mailadres al.")
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded space-y-6">
      <h1 className="text-2xl font-bold text-center">🆕 Registreren</h1>

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

        <FloatingInput
          type="password"
          name="confirmPassword"
          label="Bevestig wachtwoord"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">
          Maak account aan
        </button>
      </form>

      <div className="text-center text-sm">
        Al een account?{" "}
        <Link to="/login" className="text-blue-600 underline">
          Log in
        </Link>
      </div>
    </div>
  )
}

export default Register
