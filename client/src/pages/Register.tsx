// File: client/src/pages/Register.tsx
import { useState } from 'react';
import { registerUser } from '../api/auth';
import { Link } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await registerUser(email, password);
      setSuccess('Registratie gelukt. Je wordt doorgestuurd...');
      setTimeout(() => (window.location.href = '/login'), 1500);
    } catch (err: any) {
      setError(err.response?.data || 'Registratie mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registreren</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mailadres"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Wachtwoord"
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-green-500"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-500 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Even geduld...' : 'Registreren'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Al een account?{' '}
          <Link to="/login" className="text-indigo-600 hover:underline">
            Log hier in
          </Link>
        </p>
      </div>
    </div>
  );
}
