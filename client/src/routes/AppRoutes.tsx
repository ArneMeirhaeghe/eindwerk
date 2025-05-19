// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import PlanOverview from "../pages/PlanOverview"
import PlanDetail from "../pages/PlanDetail"
import PlanPreview from "../pages/PlanPreview"
import Login from "../pages/Login"
import Register from "../pages/Register"
import AdminUsers from "../pages/AdminUsers"
import PrivateRoute from "./PrivateRoute"
import RoleRoute from "./RoleRoute"
import NotFound from "../pages/NotFound"
import Builder from "../pages/Builder"
// import InventoryManager from "../pages/InventoryManager"

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

      {/* Rondleidingen bekijken */}
      <Route
        path="/plans"
        element={
          <PrivateRoute>
            <PlanOverview />
          </PrivateRoute>
        }
      />
      <Route
        path="/plans/:id"
        element={
          <PrivateRoute>
            <PlanDetail />
          </PrivateRoute>
        }
      />

      {/* Builder: nieuw en bewerken */}
      <Route
        path="/builder/new"
        element={
          <PrivateRoute>
            <Builder />
          </PrivateRoute>
        }
      />
      <Route
        path="/builder/:id"
        element={
          <PrivateRoute>
            <Builder />
          </PrivateRoute>
        }
      />

      {/* Admin */}
      <Route
        path="/admin/users"
        element={
          <RoleRoute requiredRole="admin">
            <AdminUsers />
          </RoleRoute>
        }
      />
     {/* Inventory: master‐detail op één pagina */}
      {/* <Route
        path="/inventory"
        element={
          <PrivateRoute>
            <InventoryManager />
          </PrivateRoute>
        }
      /> */}
      {/* Publieke preview */}
      <Route path="/preview/:publicId" element={<PlanPreview />} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
