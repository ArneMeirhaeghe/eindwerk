// File: client/src/types/Auth.ts
export interface AuthResponse {
  token: string; // JWT-token
}

export interface AuthRequest {
  email: string;
  password: string;
  role?: 'user' | 'admin'; // Optioneel bij register/login
}
