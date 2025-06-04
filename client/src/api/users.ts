// File: client/src/api/users.ts
import API from './axios';
import type { User, UserCreateRequest } from '../types/User';

export const getAllUsers = async (): Promise<User[]> => {
  // Haalt alle gebruikers op (Admin-endpoint; JWT vereist)
  const res = await API.get<User[]>('/admin/users');
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  // Haalt één gebruiker op op basis van ID (Admin-endpoint)
  const res = await API.get<User>(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (data: UserCreateRequest) => {
  // Maakt nieuwe gebruiker aan (Admin-endpoint)
  await API.post('/admin/users', data);
};

export const updateUser = async (id: string, role: 'user' | 'admin') => {
  // Wijzigt rol van gebruiker (Admin-endpoint)
  await API.put(`/admin/users/${id}`, { role });
};

export const deleteUser = async (id: string) => {
  // Verwijdert gebruiker (Admin-endpoint)
  await API.delete(`/admin/users/${id}`);
};
