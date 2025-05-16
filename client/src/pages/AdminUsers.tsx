// src/pages/AdminUsers.tsx
import { useEffect, useState } from "react"
import {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from "../api/users"
import type { User } from "../types/User"

function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const load = async () => {
    try {
      const data = await getAllUsers()
      setUsers(data)
    } catch {
      alert("Fout bij ophalen gebruikers")
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return
    try {
      await createUser({ email, password })
      setEmail("")
      setPassword("")
      load()
    } catch {
      alert("Aanmaken mislukt")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Verwijder gebruiker?")) return
    await deleteUser(id)
    load()
  }

  const handleRoleChange = async (id: string, role: "user" | "admin") => {
    await updateUser(id, role)
    load()
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">👑 Gebruikersbeheer</h1>

      <form
        onSubmit={handleCreate}
        className="grid grid-cols-1 md:grid-cols-[2fr,2fr,1fr] gap-4 bg-white p-6 rounded-lg shadow"
      >
        <input
          type="email"
          className="border p-2 rounded"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 rounded"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          ➕ Gebruiker
        </button>
      </form>

      <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2">E-mail</th>
              <th className="py-2">Rol</th>
              <th className="py-2">Acties</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="py-2">{u.email}</td>
                <td className="py-2">
                  <select
                    value={u.role}
                    onChange={(e) =>
                      handleRoleChange(u.id, e.target.value as "user" | "admin")
                    }
                    className="border px-2 py-1 rounded"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </td>
                <td className="py-2">
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
