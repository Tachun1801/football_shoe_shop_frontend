import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store';
import { listProducts } from '../services/productService';
import { formatCurrency } from '../utils/format';

export default function Shop() {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const data = await listProducts(search);
      if (mounted) {
        setProducts(data);
        setLoading(false);
      }
    }

    setLoading(true);
    load().catch(() => {
      if (mounted) {
        setProducts([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [search]);

  return (
    <section className="stack">
      <div className="card row">
        <div>
          <h2>Shop</h2>
          <p>Danh sách sản phẩm lấy từ backend.</p>
        </div>
        <input
          className="search-input"
          placeholder="Search product"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {loading ? <div className="card">Loading products...</div> : null}

      <div className="grid product-grid">
        {products.map((product) => {
          const firstVariant = product.variants?.[0];
          const price = Number(product.price || 0) + Number(firstVariant?.priceAdjustment || 0);

          return (
            <article key={product.id} className="card product-card">
              <img src={product.imageUrl} alt={product.name} className="product-image" />
              <span className="pill">{product.brandName}</span>
              <h3>{product.name}</h3>
              <p>{product.featured ? 'Featured product' : 'Standard product'}</p>
              <strong>{formatCurrency(price)}</strong>
              <div className="actions-row">
                <Link className="ghost-btn inline-btn" to={`/product/${product.id}`}>View detail</Link>
                <button
                  className="primary-btn"
                  type="button"
                  onClick={() => {
                    if (!firstVariant) return;
                    dispatch(addItem({
                      variantId: firstVariant.id,
                      productId: product.id,
                      productName: product.name,
                      variantSku: firstVariant.sku,
                      size: firstVariant.size,
                      color: firstVariant.color,
                      price,
                      quantity: 1,
                      imageUrl: product.imageUrl
                    }));
                  }}
                  disabled={!firstVariant}
                >
                  Add quick
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
