import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function RoleRoute({
  requiredRole,
  children,
}: {
  requiredRole: "admin"
  children: React.ReactNode
}) {
  const { token, role, loading } = useAuth()

  if (loading) return null
  if (!token || role !== requiredRole) return <Navigate to="/login" />

  return <>{children}</>
}

export default RoleRoute
