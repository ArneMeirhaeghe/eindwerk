// src/pages/Dashboard.tsx
import React from "react"
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const { email } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">🏠 Dashboard</h1>
      <p className="text-gray-600">Welkom, <span className="font-medium">{email}</span>!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bekijken */}
        <button
          onClick={() => navigate("/plans")}
          className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow flex flex-col items-start space-y-2"
        >
          <span className="text-2xl">🔍 Bekijken</span>
          <span className="text-sm">Bekijk al je virtuele rondleidingen</span>
        </button>

        {/* Maken */}
        <button
          onClick={() => navigate("/builder/new")}
          className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow flex flex-col items-start space-y-2"
        >
          <span className="text-2xl">✏️ Maken</span>
          <span className="text-sm">Creëer een nieuwe rondleiding</span>
        </button>
      </div>
    </div>
  )
}

export default Dashboard
