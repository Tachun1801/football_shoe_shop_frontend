import { NavLink, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Login from './pages/Login';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Dashboard from './pages/Dashboard';

export default function App() {
  const cartCount = useSelector((state) => state.cart.items.reduce((total, item) => total + item.quantity, 0));
  const token = useSelector((state) => state.auth.token);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Football Shoe Shop</p>
          <h1>Football Shoe Shop</h1>
        </div>
        <nav className="nav">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/shop">Shop</NavLink>
          <NavLink to="/cart">Cart ({cartCount})</NavLink>
          <NavLink to="/checkout">Checkout</NavLink>
          <NavLink to="/login">Login</NavLink>
          {token ? <NavLink to="/dashboard">Dashboard</NavLink> : null}
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
