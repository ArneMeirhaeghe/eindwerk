// File: src/components/Navbar.tsx

import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { logout, token } = useAuth();

  if (!token) return null; // Niet ingelogd? Geen NavBar

  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log("Payload:", payload);
  const email = payload?.unique_name || "gebruiker";
  const id = payload?.sub || payload?.id ||payload.nameid || "onbekend";

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <Link to="/" className="text-xl text-blue-600 hover:text-blue-800">
          <FaHome />
        </Link>
      </div>

      <div className="flex flex-col items-end gap-1 text-right">
        <span className="text-gray-700">
          Hallo, <strong>{email}</strong>
        </span>
        <span className="text-xs text-gray-400">ID: {id}</span>
        <button
          onClick={logout}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-500 mt-1"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
