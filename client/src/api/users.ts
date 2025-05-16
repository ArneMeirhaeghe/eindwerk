// client/src/api/users.ts
import axios from "./axios"
import type { User, UserCreateRequest } from "../types/User"

export const getAllUsers = async (): Promise<User[]> => {
  const res = await axios.get("/users")
  return res.data
}

export const getUserById = async (id: string): Promise<User> => {
  const res = await axios.get(`/users/${id}`)
  return res.data
}

export const createUser = async (data: UserCreateRequest) => {
  await axios.post("/users", data)
}

export const updateUser = async (
  id: string,
  role: "user" | "admin"
) => {
  await axios.patch(`/users/${id}`, { role })
}

export const deleteUser = async (id: string) => {
  await axios.delete(`/users/${id}`)
}
