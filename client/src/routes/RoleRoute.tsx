import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RoleRoute({
  role,
  children,
}: {
  role: string;
  children: ReactNode;
}) {
  const { token, role: userRole, loading } = useAuth();

  if (loading) return null;
  if (!token || userRole !== role) return <Navigate to="/" />;

  return <>{children}</>;
}
