import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PendingOrders() {
  const [orders, setOrders] = useState([]);

  const load = () => api.get('/orders/admin/all').then(r => setOrders(r.data));
  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    let courierName = '';
    if (status === 'IN_TRANSIT') {
      courierName = prompt('Enter Courier Name (e.g. Pathao, Steadfast):');
      if (!courierName) return;
    }
    await api.put(`/orders/admin/status/${id}`, { status, courierName });
    load();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Manage Orders</h2>
      <div className="table-responsive bg-white rounded-3 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Order ID</th> {/* 🔴 নতুন কলাম */}
              <th>Customer</th>
              <th>Product</th>
              <th>Qty & Total</th>
              <th>Address</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id}>
                <td className="fw-bold text-primary">#{o._id.slice(-6).toUpperCase()}</td> {/* 🔴 Order ID */}
                <td><strong>{o.customerName}</strong><br/><small>{o.phone}</small></td>
                <td>{o.productName}</td>
                <td>Qty: {o.quantity} <br/> <strong>৳{o.totalPrice}</strong></td>
                <td style={{ maxWidth: 150 }}><small>{o.address}</small></td>
                <td><span className={`badge bg-${o.status === 'PENDING' ? 'warning' : o.status === 'DELIVERED' ? 'success' : 'primary'}`}>{o.status}</span></td>
                <td>
                  <select className="form-select form-select-sm" value={o.status} onChange={(e) => updateStatus(o._id, e.target.value)}>
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="IN_TRANSIT">In Transit</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}