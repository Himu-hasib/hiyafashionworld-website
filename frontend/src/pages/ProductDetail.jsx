import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { user } = useAuth();
  const [p, setP] = useState(null);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  useEffect(() => {
    api.get(`/products/${id}`).then(r => setP(r.data));
  }, [id]);

  if (!p) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  const offer = p.price - (p.price * p.discount / 100);

  const handleAddToCart = async () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    await api.post('/cart/add', { productId: p._id, name: p.name, price: offer, image: p.images[0], quantity });
    alert('Added to cart successfully!');
  };

  const handleOrderNow = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    nav(`/order/${p._id}`);
  };

  return (
    <div className="container py-4">
      <div className="row g-3">
        
        {/* 🔴 বাম দিক: ইমেজ গ্যালারি */}
        <div className="col-md-5">
          <div className="d-flex flex-column flex-md-row gap-2 justify-content-start align-items-start">
            
            {/* ছোট ছবির লিস্ট */}
            <div className="d-flex flex-row flex-md-column gap-2 order-2 order-md-1">
              {p.images?.map((img, i) => (
                <img 
                  key={i} 
                  src={img} 
                  onClick={() => setActiveImg(i)} 
                  className={`img-fluid rounded border ${activeImg === i ? 'border-danger border-2' : ''}`} 
                  style={{ width: '65px', height: '65px', objectFit: 'cover', cursor: 'pointer' }} 
                  alt="thumb" 
                />
              ))}
            </div>

            {/* বড় ছবির কন্টেইনার */}
            <div className="main-image-container order-1 order-md-2">
              <img src={p.images[activeImg]} className="main-product-image" alt="main" />
            </div>

          </div>
        </div>

        {/* 🔴 ডান দিক: প্রোডাক্ট ডিটেইলস (বাম দিকে সরানো ও বাটন ছোট) */}
        <div className="col-md-7 px-0 px-md-2">
          <h3 className="fw-bold mb-3">{p.name}</h3>
          
          <div className="d-flex align-items-center gap-3 mb-3">
            <h2 className="text-danger fw-bold mb-0">৳{offer.toFixed(0)}</h2>
            {p.discount > 0 && (
              <>
                <span className="text-decoration-line-through text-muted fs-5">৳{p.price}</span>
                <span className="badge bg-warning text-dark fs-6">{p.discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-muted mb-4" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>
            {p.specification}
          </p>

          <div className="mb-4">
            <label className="fw-bold mb-2">Quantity:</label>
            <div className="d-flex align-items-center border rounded" style={{ width: '120px' }}>
              <button className="btn btn-light fw-bold" onClick={() => setQuantity(q => Math.max(1, q - 1))}>-</button>
              <span className="flex-grow-1 text-center fw-bold">{quantity}</span>
              <button className="btn btn-light fw-bold" onClick={() => setQuantity(q => q + 1)}>+</button>
            </div>
          </div>

          <div className="mb-4">
            {p.stockType === 'IN_STOCK' ? 
              <span className="badge bg-success px-3 py-2"><i className="las la-check-circle me-1"></i> In Stock</span> 
              : <span className="badge bg-danger px-3 py-2"><i className="las la-times-circle me-1"></i> Out of Stock</span>
            }
          </div>

          {/* 🔴 বাটনগুলোর প্রস্থ কমানো হলো */}
          <div className="d-flex gap-3 mt-4 button-container">
            <button onClick={handleOrderNow} className="btn btn-lg fw-bold text-white" style={{ backgroundColor: '#ff5722' }} disabled={p.stockType !== 'IN_STOCK'}>
              <i className="las la-bolt me-2"></i> Order Now
            </button>
            <button onClick={handleAddToCart} className="btn btn-lg fw-bold text-white" style={{ backgroundColor: '#0288d1' }} disabled={p.stockType !== 'IN_STOCK'}>
              <i className="las la-cart-plus me-2"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>

      {showLoginPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box text-center">
            <i className="las la-exclamation-circle text-warning" style={{ fontSize: '50px' }}></i>
            <h4 className="fw-bold mt-3 mb-2">Login Required!</h4>
            <p className="text-muted mb-4">For Add to cart or order you need login first.</p>
            <button className="btn btn-danger px-4 fw-bold" onClick={() => nav('/login')}>
              OK, Go to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}