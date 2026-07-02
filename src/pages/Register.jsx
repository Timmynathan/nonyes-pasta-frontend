import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    first_name: '', last_name: '', phone: '', address: '',
    is_subscribed_newsletter: false,
  });
  const [error, setError] = useState('');

  function handleChange(e) {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((f) => ({ ...f, [e.target.name]: val }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    try {
      await register(form);
      navigate('/account');
    } catch (err) {
      setError(JSON.stringify(err.response?.data || 'Registration failed.'));
    }
  }

  return (
    <div className="max-w-sm mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {[
          { name: 'first_name', label: 'First Name' },
          { name: 'last_name', label: 'Last Name' },
          { name: 'username', label: 'Username' },
          { name: 'email', label: 'Email', type: 'email' },
          { name: 'password', label: 'Password', type: 'password' },
          { name: 'phone', label: 'Phone Number' },
          { name: 'address', label: 'Delivery Address (Lagos)' },
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block text-sm font-semibold mb-1">{label}</label>
            <input
              type={type || 'text'}
              name={name}
              value={form[name]}
              onChange={handleChange}
              required={['username', 'email', 'password'].includes(name)}
              className="w-full border rounded-lg px-4 py-2"
            />
          </div>
        ))}
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_subscribed_newsletter" checked={form.is_subscribed_newsletter} onChange={handleChange} />
          Subscribe to newsletter
        </label>
        <button type="submit" className="w-full bg-brand-red text-white font-bold py-3 rounded-full hover:bg-brand-orange transition">
          Register
        </button>
      </form>
      <p className="text-center mt-4 text-sm">
        Already have an account? <Link to="/login" className="text-brand-red font-semibold">Login</Link>
      </p>
    </div>
  );
}
