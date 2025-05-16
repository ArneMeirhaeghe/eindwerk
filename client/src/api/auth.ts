import axios from "axios"
import type { AuthRequest, AuthResponse } from "../types/Auth"

const API = import.meta.env.VITE_API_URL

export const login = async (data: AuthRequest): Promise<AuthResponse> => {
  const res = await axios.post(`${API}/auth/login`, data)
  return res.data
}

export const register = async (data: AuthRequest): Promise<AuthResponse> => {
  const res = await axios.post(`${API}/auth/register`, data)
  return res.data
}
