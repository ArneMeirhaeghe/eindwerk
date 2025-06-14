import  { useState, useEffect } from "react"
import { NavLink, Link, useLocation } from "react-router-dom"
import {
  FaHome,
  FaClipboardList,
  FaMapMarkedAlt,
  FaBoxOpen,
  FaUpload,
  FaWpforms,
  FaUsers,
  FaBars,
  FaTimes,
} from "react-icons/fa"
import { useAuth } from "../context/AuthContext"
import { getToursList } from "../api/tours"
import type { TourListDto } from "../api/tours/types"

export default function Sidebar() {
  const { token, logout, role } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [tours, setTours] = useState<TourListDto[]>([])

  useEffect(() => {
    getToursList().then(setTours).catch(console.error)
  }, [])

  if (!token) return null

  const isBuilderPage = location.pathname.includes("/builder")
  const isFormbuiderPage = location.pathname.includes("/formbuilder")
  const isAdmin = role === "Admin"

  const payload = JSON.parse(atob(token.split(".")[1]))
  const email = payload?.unique_name || "gebruiker"
  const id =
    payload?.sub ||
    payload?.id ||
    payload?.nameid ||
    "onbekend"

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-4 py-2 rounded transition text-sm ${
      active
        ? "bg-blue-100 font-medium text-blue-700"
        : "text-gray-700 hover:bg-gray-100"
    }`

  const Desktop = (
    <aside
      className="hidden lg:flex flex-col justify-between fixed top-0 left-0 h-full
                 bg-white border-r shadow-sm overflow-y-auto transition-all
                 w-16 hover:w-64 group/sidebar z-40"
    >
      <div className="p-4 border-b flex items-center justify-center group-hover/sidebar:justify-start">
        <Link to="/" className="flex items-center gap-2 text-blue-600">
          <FaHome className="text-xl" />
          <span className="hidden group-hover/sidebar:inline font-semibold">
            Home
          </span>
        </Link>
      </div>

      <nav className="p-2 space-y-1 flex-1">
        <NavLink to="/" className={({ isActive }) => linkClass(isActive)}>
          <FaClipboardList className="text-lg" />
          <span className="hidden group-hover/sidebar:inline">
            Overzicht verhuur
          </span>
        </NavLink>

        <div className="px-4 pt-3 pb-1 text-xs text-gray-400 uppercase hidden group-hover/sidebar:block">
          Rondleidingen
        </div>
        <NavLink to="/tours" className={({ isActive }) => linkClass(isActive)}>
          <FaMapMarkedAlt className="text-lg" />
          <span className="hidden group-hover/sidebar:inline">
            Rondleidingen
          </span>
        </NavLink>

        {tours.slice(0, 3).map((t) => (
          <NavLink
            key={t.id}
            to={`/tours/${t.id}/builder`}
            className={({ isActive }) =>
              `ml-6 block text-sm py-1 px-3 rounded hover:bg-gray-100 truncate ${
                isActive ? "text-blue-700 font-medium" : "text-gray-700"
              } hidden group-hover/sidebar:block`
            }
          >
            {t.naamLocatie}
          </NavLink>
        ))}

        {tours.length > 3 && (
          <NavLink
            to="/tours"
            className="ml-6 block text-sm py-1 px-3 text-gray-500 hover:bg-gray-100 rounded hidden group-hover/sidebar:block"
          >
            …
          </NavLink>
        )}

        <NavLink
          to="/inventory"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaBoxOpen className="text-lg" />
          <span className="hidden group-hover/sidebar:inline">Inventaris</span>
        </NavLink>

        <NavLink
          to="/upload-zone"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaUpload className="text-lg" />
          <span className="hidden group-hover/sidebar:inline">Bestanden</span>
        </NavLink>

        <NavLink
          to="/formbuilder"
          className={({ isActive }) => linkClass(isActive)}
        >
          <FaWpforms className="text-lg" />
          <span className="hidden group-hover/sidebar:inline">Formulieren</span>
        </NavLink>

        {isAdmin && (
          <NavLink
            to="/users"
            className={({ isActive }) => linkClass(isActive)}
          >
            <FaUsers className="text-lg" />
            <span className="hidden group-hover/sidebar:inline">
              Gebruikers
            </span>
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t flex items-center gap-3 group-hover/sidebar:flex-col group-hover/sidebar:items-start">
        <FaUsers className="text-gray-500" />
        <div className="hidden group-hover/sidebar:block text-sm">
          <p className="font-medium text-gray-800">{email}</p>
          <p className="text-xs text-gray-400">ID: {id}</p>
        </div>
        <button
          onClick={logout}
          className="ml-auto group-hover/sidebar:ml-0 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </aside>
  )

  const Mobile = (
    <>
      <button
        className={`fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded shadow ${
          isBuilderPage ? "" : "lg:hidden"
        }`}
        onClick={() => setOpen(true)}
      >
        <FaBars />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg z-50 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  onClick={() => setOpen(false)}
                  className="text-blue-600"
                >
                  <FaHome className="text-xl" />
                </Link>
                <span className="font-semibold">Menu</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600"
              >
                <FaTimes />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLink
                to="/"
                className={({ isActive }) => linkClass(isActive)}
                onClick={() => setOpen(false)}
              >
                <FaClipboardList /> Overzicht verhuur
              </NavLink>

              <div className="mt-4 mb-1 text-xs text-gray-400 uppercase">
                Rondleidingen
              </div>
              <NavLink
                to="/tours"
                className={({ isActive }) => linkClass(isActive)}
                onClick={() => setOpen(false)}
              >
                <FaMapMarkedAlt /> Rondleidingen
              </NavLink>

              {tours.slice(0, 3).map((t) => (
                <NavLink
                  key={t.id}
                  to={`/tours/${t.id}/builder`}
                  className="ml-4 text-sm hover:bg-gray-100 rounded"
                  onClick={() => setOpen(false)}
                >
                  {t.naamLocatie}
                </NavLink>
              ))}

              {tours.length > 3 && (
                <NavLink
                  to="/tours"
                  className="ml-4 text-sm text-gray-500 hover:bg-gray-100 rounded"
                  onClick={() => setOpen(false)}
                >
                  …
                </NavLink>
              )}

              <NavLink
                to="/inventory"
                className={({ isActive }) => linkClass(isActive)}
                onClick={() => setOpen(false)}
              >
                <FaBoxOpen /> Inventaris
              </NavLink>

              <NavLink
                to="/upload-zone"
                className={({ isActive }) => linkClass(isActive)}
                onClick={() => setOpen(false)}
              >
                <FaUpload /> Bestanden
              </NavLink>

              <NavLink
                to="/formbuilder"
                className={({ isActive }) => linkClass(isActive)}
                onClick={() => setOpen(false)}
              >
                <FaWpforms /> Formulieren
              </NavLink>

              {isAdmin && (
                <NavLink
                  to="/users"
                  className={({ isActive }) => linkClass(isActive)}
                  onClick={() => setOpen(false)}
                >
                  <FaUsers /> Gebruikers
                </NavLink>
              )}
            </nav>

            <div className="flex flex-col items-end text-right text-sm p-4 border-t">
              <span className="text-gray-700">
                Hallo, <strong>{email}</strong>
              </span>
              <span className="text-xs text-gray-400">ID: {id}</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-3 py-1 mt-2 text-sm rounded hover:bg-red-500"
              >
                Logout
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )

  return (
    <>
      {!isBuilderPage && Desktop || Desktop && !isFormbuiderPage}
      {Mobile}
    </>
  )
}
