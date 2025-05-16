import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import { jwtDecode } from "jwt-decode"

interface AuthData {
  token: string | null
  userId: string | null
  email: string | null
  role: "user" | "admin" | null
  loading: boolean
  login: (token: string, remember: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthData>({
  token: null,
  userId: null,
  email: null,
  role: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [role, setRole] = useState<"user" | "admin" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("token") || sessionStorage.getItem("token")
    const expiry = sessionStorage.getItem("tokenExpiry")

    if (stored && (!expiry || Date.now() < Number(expiry))) {
      applyToken(stored)
    } else {
      logout()
    }

    setLoading(false)
  }, [])

  const applyToken = (jwt: string) => {
    try {
      const decoded: any = jwtDecode(jwt)

      const id = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"]
      const email = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"]
      const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

      if (!id || !role || !email) throw new Error("Ongeldige token payload")

      setToken(jwt)
      setUserId(id)
      setEmail(email)
      setRole(role)
    } catch (err) {
      logout()
    }
  }

  const login = (jwt: string, remember: boolean) => {
    applyToken(jwt)
    if (remember) {
      localStorage.setItem("token", jwt)
    } else {
      sessionStorage.setItem("token", jwt)
      const expiry = Date.now() + 60 * 60 * 1000
      sessionStorage.setItem("tokenExpiry", expiry.toString())
    }
  }

  const logout = () => {
    setToken(null)
    setUserId(null)
    setEmail(null)
    setRole(null)
    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
    sessionStorage.removeItem("tokenExpiry")
  }

  return (
    <AuthContext.Provider
      value={{ token, userId, email, role, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
