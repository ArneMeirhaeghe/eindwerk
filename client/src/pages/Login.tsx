import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api/auth';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const toggleShow = () => setShow(prev => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = await loginUser(email, password);
      login(token,);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data || 'Login mislukt');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Inloggen</h2>
        {error && <p className="text-red-600 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mailadres"
            className="w-full px-4 py-2 border border-gray-300 rounded"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              placeholder="Wachtwoord"
              className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={toggleShow}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              tabIndex={-1}
            >
              {show ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            Ingelogd blijven
          </label>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Bezig...' : 'Inloggen'}
          </button>
        </form>
        <p className="text-center mt-4 text-sm">
          Nog geen account?{' '}
          <Link to="/register" className="text-blue-600 hover:underline">
            Registreer hier
          </Link>
        </p>
      </div>
    </div>
  );
}
