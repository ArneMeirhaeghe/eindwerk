// File: src/components/Navbar.tsx
import { useAuth } from "../context/AuthContext"
import { Link } from "react-router-dom"
import { FaHome } from "react-icons/fa"

const Navbar: React.FC = () => {
  const { logout, token } = useAuth()
  if (!token) return null

  const payload = JSON.parse(atob(token.split(".")[1]))
  const email = payload?.unique_name || "gebruiker"
  const id = payload?.sub || payload?.id || payload.nameid || "onbekend"

  return (
    <nav className="bg-white shadow px-4 py-2 flex justify-between items-center w-full border-b">
      {/* Home knop links */}
      <Link
        to="/"
        className="flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-800"
      >
        <FaHome />
        <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Gebruiker + logout rechts */}
      <div className="flex flex-col items-end text-right text-sm">
        <span className="text-gray-700">
          Hallo, <strong>{email}</strong>
        </span>
        <span className="text-xs text-gray-400">ID: {id}</span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-3 py-1 mt-1 text-sm rounded hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar
