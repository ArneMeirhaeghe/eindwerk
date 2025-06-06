// File: src/api/users/index.ts
import API from "../axios";
import type { User, UserCreateRequest } from "./types";

// Alle functienamen blijven ongewijzigd:

export const getAllUsers = async (): Promise<User[]> => {
  const res = await API.get<User[]>("/admin/users");
  return res.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const res = await API.get<User>(`/admin/users/${id}`);
  return res.data;
};

export const createUser = async (data: UserCreateRequest) => {
  await API.post("/admin/users", data);
};

export const updateUser = async (
  id: string,
  role: "user" | "admin"
) => {
  await API.put(`/admin/users/${id}`, { role });
};

export const deleteUser = async (id: string) => {
  await API.delete(`/admin/users/${id}`);
};
