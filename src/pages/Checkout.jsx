import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../store';
import { createOrder } from '../services/orderService';
import { formatCurrency } from '../utils/format';

export default function Checkout() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    paymentMethodId: 1
  });

  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        shippingFee: 30000,
        discountAmount: 0,
        taxRate: 0,
        items: items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity
        }))
      };
      const order = await createOrder(payload);
      dispatch(clearCart());
      setMessage(`Order created: ${order.orderCode}`);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Unable to create order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <section className="card">
        <h2>Checkout</h2>
        <p>Cart của bạn đang trống.</p>
      </section>
    );
  }

  return (
    <section className="card checkout-layout">
      <form className="stack" onSubmit={submit}>
        <h2>Checkout</h2>
        <input placeholder="Customer name" value={form.customerName} onChange={(event) => setForm({ ...form, customerName: event.target.value })} />
        <input placeholder="Email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        <input placeholder="Phone" value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
        <textarea placeholder="Address" value={form.address} onChange={(event) => setForm({ ...form, address: event.target.value })} />
        <button className="primary-btn" disabled={loading} type="submit">
          {loading ? 'Submitting...' : 'Place order'}
        </button>
        {message ? <p>{message}</p> : null}
      </form>

      <aside className="summary-panel">
        <h3>Summary</h3>
        <p>Subtotal: {formatCurrency(subtotal)}</p>
        <p>Shipping: {formatCurrency(30000)}</p>
        <strong>Total: {formatCurrency(subtotal + 30000)}</strong>
      </aside>
    </section>
  );
}
