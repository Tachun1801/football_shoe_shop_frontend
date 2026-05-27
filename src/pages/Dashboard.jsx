import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { fetchMe } from '../services/authService';
import { listOrders, updateOrderStatus } from '../services/orderService';
import api from '../services/api';
import { formatCurrency } from '../utils/format';

export default function Dashboard() {
  const token = useSelector((state) => state.auth.token);
  const [me, setMe] = useState(null);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!token) {
      return;
    }

    async function load() {
      const [profile, dashboard, recentOrders] = await Promise.all([
        fetchMe(),
        api.get('/admin/dashboard').then((response) => response.data),
        listOrders()
      ]);
      setMe(profile);
      setStats(dashboard);
      setOrders(recentOrders);
    }

    load().catch(() => {
      setMe(null);
    });
  }, [token]);

  if (!token) {
    return (
      <section className="card">
        <h2>Dashboard</h2>
        <p>Vui lòng đăng nhập staff/admin để xem dashboard.</p>
      </section>
    );
  }

  if (!stats) {
    return (
      <section className="card">
        <h2>Dashboard</h2>
        <p>Loading dashboard...</p>
      </section>
    );
  }

  const refreshStatus = async (orderId, status) => {
    const updated = await updateOrderStatus(orderId, status);
    setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
  };

  return (
    <section className="stack">
      <div className="card">
        <h2>Dashboard</h2>
        <p>{me ? `${me.fullName} (${me.role})` : 'Admin area'}</p>
        <div className="grid stats-grid">
          <div className="metric"><strong>{stats.products}</strong><span>Products</span></div>
          <div className="metric"><strong>{stats.orders}</strong><span>Orders</span></div>
          <div className="metric"><strong>{stats.customers}</strong><span>Customers</span></div>
          <div className="metric"><strong>{formatCurrency(stats.revenue)}</strong><span>Revenue</span></div>
        </div>
      </div>

      <div className="card stack">
        <h3>Top products</h3>
        {stats.topProducts?.map((item) => (
          <div className="row" key={item.productId}>
            <span>{item.productName}</span>
            <span>{item.quantitySold} sold</span>
            <strong>{formatCurrency(item.revenue)}</strong>
          </div>
        ))}
      </div>

      <div className="card stack">
        <h3>Recent orders</h3>
        {orders.slice(0, 5).map((order) => (
          <div key={order.id} className="order-admin-row">
            <div>
              <strong>{order.orderCode}</strong>
              <p>{order.customerName} • {order.status}</p>
            </div>
            <div>
              <strong>{formatCurrency(order.totalAmount)}</strong>
            </div>
            <div className="actions-row">
              <button className="ghost-btn" type="button" onClick={() => refreshStatus(order.id, 'CONFIRMED')}>Confirm</button>
              <button className="ghost-btn" type="button" onClick={() => refreshStatus(order.id, 'SHIPPED')}>Ship</button>
              <button className="ghost-btn" type="button" onClick={() => refreshStatus(order.id, 'DELIVERED')}>Deliver</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
