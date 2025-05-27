import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { role } = useAuth();
  const isAdmin = role === 'Admin';

  const cards = [
    { label: 'tours', to: '/tours' },
    { label: 'InventoryManager', to: '/inventory' },
    { label: 'Upload zone', to: '/upload-zone' },
     { label: 'verhuur overzicht', to: '/verhuur' },
    ...(isAdmin ? [{ label: 'Gebruikersbeheer', to: '/users' }] : [])
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        {isAdmin ? 'Admin Dashboard' : 'Dashboard'}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {cards.map(card => (
          <Link
            key={card.to}
            to={card.to}
            className="bg-white shadow hover:shadow-lg transition rounded-lg p-6 border border-gray-200 hover:border-blue-500"
          >
            <h2 className="text-lg font-semibold text-gray-800">{card.label}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
