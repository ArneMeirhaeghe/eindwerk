import AppRoutes from "./routes/AppRoutes"
import { AuthProvider } from "./context/AuthContext"
import Sidebar from "./components/Sidebar"

function App() {
  return (
    <AuthProvider>
      <Sidebar />
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
