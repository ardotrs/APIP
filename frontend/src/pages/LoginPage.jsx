import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    try {
      await login(form.username, form.password);
      navigate('/');
    } catch {
      setError('Login gagal, periksa kembali akun Anda.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-maroon to-maroon-dark">
      <form onSubmit={submit} className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 space-y-4">
        <h1 className="text-2xl font-bold text-maroon">SIP-PEDAS</h1>
        <input className="w-full border p-2 rounded" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
        <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full bg-maroon hover:bg-maroon-dark text-white py-2 rounded">Masuk</button>
      </form>
    </div>
  );
};

export default LoginPage;
