import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { setAuth, clearAuth } from '../store';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: 'admin@footballshoe.shop', password: 'Admin123!' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const data = await login(form.email, form.password);
      dispatch(setAuth({
        token: data.token,
        user: {
          userId: data.userId,
          email: data.email,
          fullName: data.fullName,
          role: data.role
        }
      }));
      setMessage('Login successful');
      navigate('/dashboard');
    } catch (error) {
      dispatch(clearAuth());
      setMessage(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="card login-card">
      <h2>Staff / Admin Login</h2>
      <p>Demo account: admin@footballshoe.shop / Admin123!</p>
      <form className="stack" onSubmit={submit}>
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
        />
        <button className="primary-btn" type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
      {message ? <p>{message}</p> : null}
    </section>
  );
}
