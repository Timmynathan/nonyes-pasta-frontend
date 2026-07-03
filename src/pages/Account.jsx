import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';

const STATUS_LABELS = {
  pending: 'Pending Payment',
  paid: 'Paid',
  preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function Account() {
  const { user, logout, loading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!loading && !user) navigate('/login');
  }, [user, loading]);

  useEffect(() => {
    if (user) {
      api.get('/orders/mine/').then((res) => setOrders(res.data));
    }
  }, [user]);

  if (loading || !user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome, {user.first_name || user.username}!</h1>
          <p className="text-brand-dark/60">Loyalty Points: <span className="font-semibold text-brand-orange">{user.loyalty_points} pts</span></p>
        </div>
        <button onClick={() => { logout(); navigate('/'); }} className="border border-brand-dark rounded-full px-4 py-1.5 text-sm hover:bg-brand-dark hover:text-white transition">
          Logout
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
      {orders.length === 0 && (
        <p className="text-brand-dark/60">No orders yet. <Link to="/" className="text-brand-red underline">Browse the menu</Link></p>
      )}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-xl p-4 bg-white shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-bold">#{order.order_number}</p>
                <p className="text-sm text-brand-dark/60">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {STATUS_LABELS[order.status] || order.status}
              </span>
            </div>
            <p className="mt-2 font-semibold text-brand-red">₦{Number(order.total).toLocaleString()}</p>
            <Link to={`/track/${order.order_number}`} className="text-sm text-brand-dark/60 hover:underline">
              Track order →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
