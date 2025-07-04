// File: client/src/AppRoutes.tsx
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
// import InventoryPage from "../pages/InventoryManagementPage"
import SessionResponsesPage from "../pages/SessionResponsesPage"
import FormBuilderPage from "../pages/FormBuilderPage"
import InventoryManagementPage from "../pages/InventoryManagementPage"
import InventoryFormPage from "../pages/InventoryFormPage"
import { Route, Routes } from "react-router-dom"

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
      <Route path="/inventory" element={<PrivateRoute><InventoryManagementPage /></PrivateRoute>} />
      <Route path="/inventory/new" element={<PrivateRoute><InventoryFormPage/></PrivateRoute>} />
      <Route path="/inventory/:id/edit" element={<InventoryFormPage />} />
      <Route path="/formbuilder" element={<PrivateRoute><FormBuilderPage /></PrivateRoute>} />

      <Route
       path="/sessions/:id/responses"
       element={
         <PrivateRoute>
           <SessionResponsesPage />
         </PrivateRoute>
       }
     />
      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
