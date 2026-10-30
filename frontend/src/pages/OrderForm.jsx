import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function OrderForm() {
  const { productId } = useParams();
  const { user } = useAuth();
  const nav = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({ customerName: '', phone: '', secondPhone: '', address: '', quantity: 1 });
  const [showPopup, setShowPopup] = useState(false); // পপ-আপ স্টেট

  useEffect(() => {
    api.get(`/products/${productId}`).then(r => setProduct(r.data));
    if(user) setForm(f => ({ ...f, customerName: user.name || '', address: user.address || '', phone: user.phone || '' }));
  }, [productId, user]);

  if (!product) return <div className="text-center mt-5">Loading...</div>;
  const offer = product.price - (product.price * product.discount / 100);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post('/orders/place', {
      productId: product._id,
      productName: product.name,
      productImage: product.images[0],
      unitPrice: offer,
      ...form
    });
    setShowPopup(true); // অর্ডার সফল হলে পপ-আপ দেখাবে
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 rounded-4">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-4 text-center">Checkout Form</h4>
              <div className="d-flex gap-3 mb-4 bg-light p-3 rounded">
                <img src={product.images[0]} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded" alt="p" />
                <div>
                  <h6 className="fw-bold mb-1">{product.name}</h6>
                  <span className="text-danger fw-bold">৳{offer} / piece</span>
                </div>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label>Name</label>
                  <input required className="form-control" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label>Phone</label>
                    <input required className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label>2nd Phone (Optional)</label>
                    <input className="form-control" value={form.secondPhone} onChange={e => setForm({ ...form, secondPhone: e.target.value })} />
                  </div>
                </div>
                <div className="mb-3">
                  <label>Address</label>
                  <textarea required className="form-control" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
                </div>
                <div className="mb-4">
                  <label>Quantity</label>
                  <input type="number" min="1" required className="form-control" value={form.quantity} onChange={e => setForm({ ...form, quantity: Number(e.target.value) })} />
                </div>
                <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-danger text-white rounded">
                  <h5 className="mb-0">Total Price:</h5>
                  <h4 className="mb-0 fw-bold">৳{(offer * form.quantity).toFixed(0)}</h4>
                </div>
                <button className="btn btn-danger w-100 btn-lg fw-bold">Confirm Order</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* 🔴 কাস্টম পপ-আপ (মোডাল) */}
      {showPopup && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box text-center">
            <i className="las la-check-circle text-success" style={{ fontSize: '50px' }}></i>
            <h4 className="fw-bold mt-3 mb-2">Thanks for Order!</h4>
            <p className="text-muted mb-4">Happy Shopping</p>
            <button className="btn btn-danger px-4 fw-bold" onClick={() => nav('/')}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}