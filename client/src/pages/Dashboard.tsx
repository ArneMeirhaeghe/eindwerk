// client/src/pages/Dashboard.tsx
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

function Dashboard() {
  const { email } = useAuth()
  const nav = useNavigate()

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <h1 className="text-4xl font-bold">🏠 Dashboard</h1>
      <p>Welkom, <b>{email}</b>!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => nav("/plans")} className="...">🔍 Bekijken</button>
        <button onClick={() => nav("/builder/new")} className="...">✏️ Maken</button>
        <button onClick={() => nav("/inventory")} className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow">
          📦 Inventaris
        </button>
      </div>
    </div>
  )
}

export default Dashboard
