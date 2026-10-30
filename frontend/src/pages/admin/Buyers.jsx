import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Buyers() {
  const [buyers, setBuyers] = useState([]);
  useEffect(() => { api.get('/users/admin/buyers').then(r => setBuyers(r.data)); }, []);

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Buyer List</h2>
      <div className="table-responsive bg-white rounded-3 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th> {/* 🔴 নতুন কলাম */}
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {buyers.map(b => (
              <tr key={b._id}>
                <td className="fw-bold">{b.name}</td>
                <td>{b.phone || 'N/A'}</td>
                <td>{b.email || 'N/A'}</td> {/* 🔴 ইমেইল */}
                <td>{b.address || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}