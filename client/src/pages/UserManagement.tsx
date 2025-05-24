import { useEffect, useState, useRef } from 'react';
import API from '../api/axios';

interface User {
  id: string;
  email: string;
  role: 'User' | 'Admin';
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [selected, setSelected] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'User' | 'Admin'>('User');
  const [error, setError] = useState('');
  const [isNew, setIsNew] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const fetchUsers = () => {
    API.get<User[]>('/admin/users')
      .then(res => setUsers(res.data))
      .catch(err => setError(err.response?.data || 'Fout bij laden'));
  };

  useEffect(fetchUsers, []);

  const openEdit = (user: User) => {
    setIsNew(false);
    setSelected(user);
    setEmail(user.email);
    setRole(user.role);
    dialogRef.current?.showModal();
  };

  const openAdd = () => {
    setIsNew(true);
    setSelected(null);
    setEmail('');
    setRole('User');
    dialogRef.current?.showModal();
  };

  const save = async () => {
    try {
      if (isNew) {
        await API.post('/admin/users', {
          email,
          role,
          password: 'Temp123!', // tijdelijk wachtwoord
        });
      } else if (selected) {
        await API.put(`/admin/users/${selected.id}`, {
          email,
          role,
        });
      }
      dialogRef.current?.close();
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data || 'Fout bij opslaan');
    }
  };

  const remove = async (id: string) => {
    if (!confirm('Ben je zeker dat je deze gebruiker wilt verwijderen?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err: any) {
      setError(err.response?.data || 'Fout bij verwijderen');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gebruikersbeheer</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <button
        onClick={openAdd}
        className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
      >
        + Gebruiker toevoegen
      </button>

      <ul className="space-y-2 mb-6">
        {users.map(u => (
          <li
            key={u.id}
            className="flex justify-between items-center bg-white shadow px-4 py-2 rounded"
          >
            <div>
              <span className="font-medium">{u.email}</span>
              <span className="ml-2 text-sm text-gray-500">({u.role})</span>
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => openEdit(u)}
              >
                Bewerken
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => remove(u.id)}
              >
                Verwijderen
              </button>
            </div>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="rounded-lg p-6 shadow-lg border border-gray-300 w-96"
      >
        <h3 className="text-xl mb-4">
          {isNew ? 'Nieuwe gebruiker' : 'Gebruiker bewerken'}
        </h3>
        <label className="block mb-2">
          Email:
          <input
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label className="block mb-4">
          Rol:
          <select
            className="w-full p-2 border border-gray-300 rounded mt-1"
            value={role}
            onChange={e => setRole(e.target.value as 'User' | 'Admin')}
          >
            <option>User</option>
            <option>Admin</option>
          </select>
        </label>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => dialogRef.current?.close()}
            className="bg-gray-300 px-4 py-1 rounded hover:bg-gray-200"
          >
            Annuleren
          </button>
          <button
            onClick={save}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-500"
          >
            Opslaan
          </button>
        </div>
      </dialog>
    </div>
  );
}
