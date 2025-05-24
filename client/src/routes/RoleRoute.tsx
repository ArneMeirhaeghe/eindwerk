import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RoleRoute({
  role,
  children,
}: {
  role: string;
  children: JSX.Element;
}) {
  const { token, role: userRole, loading } = useAuth();

  if (loading) return null;
  if (!token || userRole !== role) return <Navigate to="/" />;

  return children;
}
