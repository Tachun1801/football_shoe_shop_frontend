import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart, removeItem, setItemQuantity } from '../store';
import { formatCurrency } from '../utils/format';

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <section className="card">
        <h2>Cart is empty</h2>
        <p>Đi tới <Link to="/shop">shop</Link> để thêm sản phẩm.</p>
      </section>
    );
  }

  return (
    <section className="card stack">
      <div className="row">
        <h2>Cart</h2>
        <button className="ghost-btn" type="button" onClick={() => dispatch(clearCart())}>Clear cart</button>
      </div>

      {items.map((item) => (
        <article className="cart-row" key={item.variantId}>
          <img src={item.imageUrl} alt={item.productName} className="thumb" />
          <div className="grow">
            <strong>{item.productName}</strong>
            <p>{item.size} / {item.color}</p>
            <p>{formatCurrency(item.price)}</p>
          </div>
          <input
            className="quantity-input"
            type="number"
            min="1"
            value={item.quantity}
            onChange={(event) => dispatch(setItemQuantity({ variantId: item.variantId, quantity: Number(event.target.value) }))}
          />
          <button className="ghost-btn" type="button" onClick={() => dispatch(removeItem(item.variantId))}>Remove</button>
        </article>
      ))}

      <div className="row summary-row">
        <strong>Total</strong>
        <strong>{formatCurrency(total)}</strong>
      </div>
      <Link to="/checkout" className="primary-btn inline-btn">Proceed to checkout</Link>
    </section>
  );
}
