import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../store';
import { formatCurrency } from '../utils/format';
import { getProduct, getProductReviews } from '../services/productService';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      const [productData, reviewData] = await Promise.all([
        getProduct(id),
        getProductReviews(id)
      ]);

      if (mounted) {
        setProduct(productData);
        setReviews(reviewData);
        setSelectedVariant(productData.variants?.[0] || null);
      }
    }

    load().catch(() => {
      if (mounted) {
        setProduct(null);
      }
    });

    return () => {
      mounted = false;
    };
  }, [id]);

  if (!product) {
    return (
      <section className="card">
        <h2>Product not found</h2>
        <p>Quay lại <Link to="/shop">shop</Link>.</p>
      </section>
    );
  }

  const addToCart = () => {
    if (!selectedVariant) {
      return;
    }

    dispatch(addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      productName: product.name,
      variantSku: selectedVariant.sku,
      size: selectedVariant.size,
      color: selectedVariant.color,
      price: Number(product.price) + Number(selectedVariant.priceAdjustment || 0),
      quantity: 1,
      imageUrl: product.imageUrl
    }));
  };

  return (
    <section className="card product-detail">
      <img src={product.imageUrl} alt={product.name} className="hero-image" />
      <div>
        <span className="pill">{product.brandName}</span>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <strong>{formatCurrency(product.price)}</strong>

        <div className="variant-grid">
          {product.variants?.map((variant) => (
            <button
              key={variant.id}
              className={selectedVariant?.id === variant.id ? 'variant-chip active' : 'variant-chip'}
              onClick={() => setSelectedVariant(variant)}
              type="button"
            >
              {variant.size} / {variant.color} / {variant.stockQuantity} in stock
            </button>
          ))}
        </div>

        <button className="primary-btn" type="button" onClick={addToCart} disabled={!selectedVariant}>
          Add to cart
        </button>
      </div>

      <div className="review-panel">
        <h3>Reviews</h3>
        {reviews.length === 0 ? <p>No reviews yet.</p> : null}
        <div className="stack">
          {reviews.map((review) => (
            <article key={review.id} className="review-card">
              <strong>{review.customerName}</strong>
              <p>{'★'.repeat(review.ratingStar)}</p>
              <p>{review.comment}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
