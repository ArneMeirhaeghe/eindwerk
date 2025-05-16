import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth()

  if (loading) return null
  if (!token) return <Navigate to="/login" />

  return <>{children}</>
}

export default PrivateRoute
