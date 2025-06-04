// File: client/src/api/auth.ts
import API from './axios';

export const loginUser = async (email: string, password: string): Promise<string> => {
  const res = await API.post<{ token: string }>('/auth/login', { email, password });
  return res.data.token;
};

export const registerUser = async (email: string, password: string): Promise<string> => {
  const res = await API.post<{ message: string }>('/auth/register', { email, password });
  return res.data.message;
};
