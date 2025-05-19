import { Link } from "react-router-dom"
import type { Plan } from "../types/Plan"

interface Props {
  plans: Plan[]
}

function PlanList({ plans }: Props) {
  return (
    <ul className="space-y-4">
      {plans.map(plan => (
        <li
          key={plan.id}
          className="border p-4 rounded shadow bg-white flex justify-between items-center"
        >
          <span className="font-semibold">{plan.title}</span>
          <Link
            to={`/plans/${plan.id}`}
            className="text-blue-500 underline"
          >
            ➤ Bekijk
          </Link>
        </li>
      ))}
    </ul>
  )
}

export default PlanList
