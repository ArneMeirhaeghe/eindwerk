import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Navbar() {
  const { email, role, logout, loading } = useAuth()

  if (loading || !email) return null

  return (
    <nav className="bg-gray-900 text-white px-4 py-3 flex justify-between items-center shadow">
      <div className="text-lg font-semibold">
        <Link to="/">🏠 Mijn Rondleidingen</Link>
      </div>
      <div className="flex items-center space-x-6">
        {role === "admin" && (
          <Link
            to="/admin/users"
            className="text-sm underline underline-offset-2 text-yellow-300 hover:text-yellow-400"
          >
            👑 Gebruikers
          </Link>
        )}
        <div className="text-sm">
          👋 {email} — <span className="uppercase text-yellow-400">{role}</span>
        </div>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
