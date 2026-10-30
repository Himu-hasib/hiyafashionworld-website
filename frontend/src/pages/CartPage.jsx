import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  
  useEffect(() => {
    api.get('/cart/my').then(r => setCart(r.data)).catch(e => console.log(e)).finally(() => setLoading(false));
  }, []);

  const removeItem = async (e, index) => {
    e.stopPropagation(); // প্যারেন্ট লিংকে ক্লিক আটকাতে
    await api.delete(`/cart/remove/${index}`);
    setCart(cart.filter((_, i) => i !== index));
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">My Shopping Cart</h3>
      
      {cart.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-cart-x text-muted" style={{ fontSize: '4rem' }}></i>
          <p className="text-muted mt-3">Your cart is empty.</p>
          <Link to="/" className="btn btn-danger">Continue Shopping</Link>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-md-8">
            {cart.map((item, i) => (
              // 🔴 কার্ডে ক্লিক করলে সরাসরি অর্ডার পেজে যাবে
              <div key={i} className="card mb-3 border-0 shadow-sm rounded-3 hover-card"
                onClick={() => nav(`/order/${item.productId}`)}
                style={{ cursor: 'pointer' }}
              >
                <div className="card-body d-flex align-items-center gap-3">
                  <img src={item.image} alt={item.name} style={{ width: 90, height: 90, objectFit: 'cover' }} className="rounded border" />
                  <div className="flex-grow-1">
                    <h6 className="fw-bold mb-1">{item.name}</h6>
                    <p className="text-muted small mb-2">Quantity: {item.quantity}</p>
                    <p className="text-danger fw-bold mb-0 fs-5">৳{item.price * item.quantity}</p>
                  </div>
                  <button className="btn btn-sm btn-outline-danger" onClick={(e) => removeItem(e, i)}>
                    <i className="bi bi-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 p-4 sticky-top" style={{ top: '100px' }}>
              <h5 className="fw-bold mb-4">Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Total Items</span>
                <span>{cart.reduce((acc, item) => acc + item.quantity, 0)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-muted">Subtotal</span>
                <span className="fw-bold fs-5 text-danger">৳{cart.reduce((acc, item) => acc + item.price * item.quantity, 0)}</span>
              </div>
              <hr />
              <button className="btn text-white w-100 fw-bold py-2" style={{ backgroundColor: '#f85606' }}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}