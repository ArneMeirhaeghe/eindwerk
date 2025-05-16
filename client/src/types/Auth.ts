// src/types/Auth.ts
export interface AuthResponse {
  token: string
}

export interface AuthRequest {
  email: string
  password: string
  role?: "user" | "admin"
}
