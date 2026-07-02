import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await login(form.username, form.password);
      navigate('/account');
    } catch {
      setError('Invalid username or password.');
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input name="username" value={form.username} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border rounded-lg px-4 py-2" />
        </div>
        <button type="submit" className="w-full bg-brand-red text-white font-bold py-3 rounded-full hover:bg-brand-orange transition">
          Login
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Don't have an account? <Link to="/register" className="text-brand-red font-semibold">Register</Link>
      </p>
    </div>
  );
}
