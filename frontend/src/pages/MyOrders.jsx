import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(e => console.log(e))
      .finally(() => setLoading(false));
  }, []);

  const statusColors = { PENDING: 'warning', CONFIRMED: 'info', IN_TRANSIT: 'primary', DELIVERED: 'success' };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-danger"></div></div>;

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">My Orders</h3>
      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam text-muted" style={{ fontSize: '4rem' }}></i>
          <p className="text-muted mt-3">You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-danger">Start Shopping</Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map(o => (
            <div key={o._id} className="col-12">
              <div className="card shadow-sm border-0 rounded-3">
                <div className="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                  <div className="d-flex gap-3 align-items-center">
                    <img src={o.productImage} style={{ width: 80, height: 80, objectFit: 'cover' }} className="rounded border" alt="p" />
                    <div>
                      <h6 className="fw-bold mb-1">{o.productName}</h6>
                      <p className="mb-0 small text-muted">Order ID: #{o._id.slice(-6).toUpperCase()}</p>
                      <p className="mb-0 small text-muted">Qty: {o.quantity} | Total: <span className="text-danger fw-bold">৳{o.totalPrice}</span></p>
                    </div>
                  </div>
                  <div className="text-end">
                    <span className={`badge bg-${statusColors[o.status]} mb-2 px-3 py-2`}>
                      {o.status.replace('_', ' ')}
                    </span>
                    {o.courierName && <p className="small text-muted mb-0">Courier: {o.courierName}</p>}
                    <p className="small text-muted mb-0 mt-1">Date: {new Date(o.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}