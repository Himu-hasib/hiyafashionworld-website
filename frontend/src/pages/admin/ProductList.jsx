import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { Link } from 'react-router-dom';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const load = () => api.get('/products/all').then(r => setProducts(r.data));
  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    await api.delete(`/products/admin/${id}`);
    load();
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between mb-4">
        <h2 className="fw-bold">Product List</h2>
        <Link to="/admin/add-product" className="btn btn-danger fw-bold">+ Add New</Link>
      </div>
      <div className="table-responsive bg-white rounded-3 shadow-sm p-3">
        <table className="table table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td><img src={p.images?.[0]} style={{ width: 50, height: 50, objectFit: 'cover' }} className="rounded border" alt="p" /></td>
                <td className="fw-medium">{p.name}</td>
                <td>৳{p.price}</td>
                <td>{p.stockType === 'IN_STOCK' ? <span className="badge bg-success">In</span> : <span className="badge bg-danger">Out</span>}</td>
                <td className="text-center">
                  <Link to={`/admin/edit-product/${p._id}`} className="btn btn-sm btn-outline-primary me-2">
                    <i className="bi bi-pencil"></i> Edit
                  </Link>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(p._id)}>
                    <i className="bi bi-trash"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}