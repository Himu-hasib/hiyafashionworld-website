import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalBuyers: 0,
    totalOrders: 0,
    pending: 0,
    confirmed: 0,
    inTransit: 0,
    delivered: 0,
    totalSale: 0
  });

  const fetchStats = () => {
    api.get('/products/admin/count').then(r => setStats(prev => ({ ...prev, totalProducts: r.data.totalProducts }))).catch(() => {});
    api.get('/users/admin/count').then(r => setStats(prev => ({ ...prev, totalBuyers: r.data.totalBuyers }))).catch(() => {});
    api.get('/orders/admin/stats').then(r => setStats(prev => ({ ...prev, ...r.data }))).catch(() => {});
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-5">
        <h2 className="fw-bold">Dashboard Overview</h2>
        <button className="btn btn-outline-dark btn-sm" onClick={fetchStats}>
          <i className="bi bi-arrow-clockwise"></i> Refresh Data
        </button>
      </div>

      {/* ১. মেইন স্ট্যাটস কার্ড সেকশন */}
      <div className="row g-4 mb-5">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-primary text-white rounded-4">
            <h3 className="fw-bold mb-1">{stats.totalProducts}</h3>
            <small className="fw-medium">Total Products</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-info text-white rounded-4">
            <h3 className="fw-bold mb-1">{stats.totalBuyers}</h3>
            <small className="fw-medium">Total Buyers</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-success text-white rounded-4">
            <h3 className="fw-bold mb-1">৳{stats.totalSale}</h3>
            <small className="fw-medium">Total Sale (Delivered)</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-dark text-white rounded-4">
            <h3 className="fw-bold mb-1">{stats.totalOrders}</h3>
            <small className="fw-medium">Total Orders</small>
          </div>
        </div>
      </div>

      {/* ২. অর্ডার স্ট্যাটাস কার্ড সেকশন */}
      <h5 className="fw-bold mb-4 text-secondary border-bottom pb-2">Order Status Overview</h5>
      <div className="row g-4">
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-warning text-dark rounded-4">
            <h4 className="fw-bold mb-1">{stats.pending}</h4>
            <small className="fw-medium">Pending Orders</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 rounded-4" style={{ backgroundColor: '#e3f2fd', color: '#0d47a1' }}>
            <h4 className="fw-bold mb-1">{stats.confirmed}</h4>
            <small className="fw-medium">Confirmed Orders</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 rounded-4" style={{ backgroundColor: '#f3e5f5', color: '#4a148c' }}>
            <h4 className="fw-bold mb-1">{stats.inTransit}</h4>
            <small className="fw-medium">In Transit</small>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card border-0 shadow-sm text-center p-4 bg-success text-white rounded-4">
            <h4 className="fw-bold mb-1">{stats.delivered}</h4>
            <small className="fw-medium">Delivered Products</small>
          </div>
        </div>
      </div>
    </div>
  );
}