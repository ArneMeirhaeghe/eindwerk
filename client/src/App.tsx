import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import Sidebar from "./components/Sidebar"
import { ToastContainer } from "react-toastify"

function App() {
  return (
    <AuthProvider>
      <Sidebar />
      <AppRoutes />
            <ToastContainer position="bottom-right" />

    </AuthProvider>
  )
}

export default App
