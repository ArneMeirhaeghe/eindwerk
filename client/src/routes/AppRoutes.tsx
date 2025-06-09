// File: client/src/AppRoutes.tsx
import { Routes, Route } from "react-router-dom"
import Dashboard from "../pages/Dashboard"
import Login from "../pages/Login"
import Register from "../pages/Register"
import PrivateRoute from "./PrivateRoute"
import RoleRoute from "./RoleRoute"
import NotFound from "../pages/NotFound"
import UserManagement from "../pages/UserManagement"
import VerhuurPage from "../pages/VerhuurPage"
import ToursPage from "../pages/ToursPage"
import TourBuilderPage from "../pages/TourBuilderPage"
import UploadZone from "../pages/UploadZone"
import PublicSessionPage from "../pages/PublicSessionPage" // Route voor publieke live-sessie
import PublicEntryPage from "../pages/PublicEntryPage"
import InventoryPage from "../pages/InventoryPage"

function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />


 {/* Dashboard */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

      {/* Verhuur */}
      <Route path="/verhuur" element={<PrivateRoute><VerhuurPage /></PrivateRoute>} />

      {/* Tours */}
      <Route path="/tours" element={<PrivateRoute><ToursPage /></PrivateRoute>} />
      <Route path="/tours/:id" element={<PrivateRoute><TourBuilderPage /></PrivateRoute>} />
      <Route path="/tours/:id/builder" element={<PrivateRoute><TourBuilderPage /></PrivateRoute>} />

      {/* Publieke toegang */}
      <Route path="/public" element={<PublicEntryPage />} />
      <Route path="/public/:id" element={<PublicSessionPage />} />

      {/* Admin */}
      <Route path="/users" element={<RoleRoute role="Admin"><UserManagement /></RoleRoute>} />

      {/* Upload & Inventory */}
      <Route path="/upload-zone" element={<PrivateRoute><UploadZone /></PrivateRoute>} />
      <Route path="/inventory" element={<PrivateRoute><InventoryPage /></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
