import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MainLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      <aside className="bg-maroon text-white md:w-64 p-5">
        <h1 className="font-bold text-xl mb-6">SIP-PEDAS</h1>
        <nav className="space-y-2 text-sm">
          <Link className="block hover:bg-maroon-dark rounded p-2" to="/">Dashboard</Link>
          <Link className="block hover:bg-maroon-dark rounded p-2" to="/assignments">Penugasan</Link>
          <Link className="block hover:bg-maroon-dark rounded p-2" to="/employees">Pegawai</Link>
        </nav>
        <div className="mt-8 text-xs">Login sebagai: {user?.role}</div>
        <button className="mt-3 bg-white text-maroon px-3 py-2 rounded" onClick={logout}>Logout</button>
      </aside>
      <main className="flex-1 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
