// File: client/src/api/auth.ts
import API from './axios';

export const loginUser = async (email: string, password: string) => {
  // Stuurt login-data naar backend en retourneert token
  const res = await API.post<{ token: string }>('/auth/login', { email, password });
  return res.data.token;
};

export const registerUser = async (email: string, password: string) => {
  // Stuurt registra­tie-data naar backend
  const res = await API.post<string>('/auth/register', { email, password });
  return res.data;
};
