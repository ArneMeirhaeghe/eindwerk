// File: src/api/auth/index.ts
import API from "../axios";
import type {
  LoginResponse,
  RegisterResponse,
  LoginRequest,
  RegisterRequest,
  ChangePasswordRequest,
} from "./types";

// Zolang je elders in de code naar `loginUser(...)` verwijst, blijft deze naam bestaan:
export const loginUser = async (
  email: string,
  password: string
): Promise<string> => {
  const payload: LoginRequest = { email, password };
  const res = await API.post<LoginResponse>("/auth/login", payload);
  return res.data.token;
};

export const registerUser = async (
  email: string,
  password: string
): Promise<string> => {
  const payload: RegisterRequest = { email, password };
  const res = await API.post<RegisterResponse>("/auth/register", payload);
  return res.data.message;
};

// (optioneel) change-password als je dat gebruikt in je frontend:
export const changePassword = async (
  currentPassword: string,
  newPassword: string
): Promise<void> => {
  const payload: ChangePasswordRequest = { currentPassword, newPassword };
  await API.post("/auth/change-password", payload);
};
