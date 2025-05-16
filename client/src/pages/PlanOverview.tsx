// client/src/pages/PlanOverview.tsx
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import { getAllPlansByUser } from "../api/api"
import type { Plan } from "../types/Plan"

function PlanOverview() {
  const { userId } = useAuth()
  const [plans, setPlans] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    setLoading(true)
    getAllPlansByUser(userId)
      .then(setPlans)
      .catch(() => alert("Fout bij laden van rondleidingen"))
      .finally(() => setLoading(false))
  }, [userId])

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">Laden...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">📋 Mijn Rondleidingen</h1>
        <Link
          to="/builder/new"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          ➕ Nieuwe rondleiding
        </Link>
      </div>

      {plans.length === 0 ? (
        <p className="text-gray-600">Je hebt nog geen rondleidingen gemaakt.</p>
      ) : (
        <ul className="space-y-4">
          {plans.map((plan) => (
            <li
              key={plan.id}
              className="border p-4 rounded-lg shadow flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold">{plan.title}</h2>
                {plan.publicId && (
                  <p className="text-sm text-gray-500">
                    Publieke link: <code>/preview/{plan.publicId}</code>
                  </p>
                )}
              </div>
              <Link
                to={`/plans/${plan.id}`}
                className="text-blue-600 hover:underline"
              >
                ➤ Bekijken
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default PlanOverview
