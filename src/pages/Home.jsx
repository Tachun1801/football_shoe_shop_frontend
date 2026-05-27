import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="stack">
      <div className="card hero-card">
        <span className="pill">Deploy ready</span>
        <h2>Football Shoe Shop</h2>
        <p>
          Khung frontend đã nối router, store, API service và các trang chính để bạn deploy thẳng.
        </p>
        <div className="actions-row">
          <Link className="primary-btn inline-btn" to="/shop">Browse products</Link>
          <Link className="ghost-btn inline-btn" to="/checkout">Checkout</Link>
        </div>
      </div>

      <div className="grid feature-grid">
        <article className="card feature-card">
          <h3>Catalog</h3>
          <p>Sản phẩm, chi tiết, review và tồn kho từ backend.</p>
        </article>
        <article className="card feature-card">
          <h3>Cart & checkout</h3>
          <p>Giỏ hàng localStorage và checkout guest tạo order thật.</p>
        </article>
        <article className="card feature-card">
          <h3>Staff dashboard</h3>
          <p>Login JWT và dashboard cho admin/staff.</p>
        </article>
      </div>
    </section>
  );
}
