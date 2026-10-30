import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const location = useLocation();
  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔴 Notification Load (Pagination)
  const fetchNotifications = async (pageNum = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/notifications/admin/all?page=${pageNum}&limit=15`);
      
      // 🔴 page 1 হলে রিপ্লেস, না হলে আগের সাথে নতুন যোগ হবে
      if (pageNum === 1) {
        setNotifications(data.data);
      } else {
        setNotifications(prev => [...prev, ...data.data]); 
      }
      
      setHasMore(data.hasMore);
      setPage(data.currentPage);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const { data } = await api.get('/notifications/admin/unread-count');
      setUnreadCount(data.count);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchNotifications(1);
    fetchUnreadCount();
  }, []);

  const handleBellClick = async () => {
    if (unreadCount > 0) {
      try {
        await api.put('/notifications/admin/read-all');
        setUnreadCount(0); 
      } catch (error) {
        console.log(error);
      }
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin', icon: 'bi-grid' },
    { name: 'Add Product', path: '/admin/add-product', icon: 'bi-plus-circle' },
    { name: 'Product List', path: '/admin/products', icon: 'bi-list-ul' },
    { name: 'Pending Orders', path: '/admin/orders', icon: 'bi-box-seam' },
    { name: 'Buyers', path: '/admin/buyers', icon: 'bi-people' },
    { name: 'Announcements', path: '/admin/announcements', icon: 'bi-megaphone' }
  ];

  return (
    <header className="bg-dark text-white shadow-sm sticky-top py-2">
      <div className="container-fluid px-4 d-flex align-items-center justify-content-between flex-wrap gap-2">
        
        <Link to="/admin" className="text-decoration-none text-white d-flex align-items-center gap-2">
          <i className="bi bi-shield-lock fs-4 text-warning"></i>
          <h5 className="mb-0 fw-bold">Admin Panel</h5>
        </Link>

        <div className="d-flex align-items-center gap-2 overflow-auto pb-1 pb-md-0" style={{ maxWidth: '100%' }}>
          {menuItems.map(item => (
            <Link 
              key={item.path} 
              to={item.path}
              className={`btn btn-sm d-flex align-items-center gap-1 ${location.pathname === item.path ? 'btn-warning text-dark fw-bold' : 'btn-outline-light'}`}
            >
              <i className={`bi ${item.icon}`}></i>
              <span className="d-none d-md-inline">{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="d-flex align-items-center gap-3">
          <span className="small d-none d-lg-block text-light">Welcome, {user?.name}</span>
          
          <div className="dropdown">
            <button 
              className="btn btn-dark position-relative" 
              data-bs-toggle="dropdown" 
              onClick={handleBellClick}
            >
              <i className="bi bi-bell fs-5"></i>
              {unreadCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {unreadCount}
                </span>
              )}
            </button>
            
            <ul className="dropdown-menu dropdown-menu-end shadow" style={{ width: '320px', maxHeight: '400px', overflowY: 'auto' }}>
              <li className="px-3 py-2 border-bottom fw-bold text-dark d-flex justify-content-between align-items-center">
                Notifications
              </li>
              
              {notifications.length === 0 ? (
                <li className="p-3 text-center text-muted">No new notifications</li>
              ) : (
                notifications.map((n, i) => (
                  <li key={i} className="p-2 border-bottom" style={{ backgroundColor: n.isRead ? '#f8f9fa' : '#fff' }}>
                    <small className="text-muted">{new Date(n.createdAt).toLocaleString()}</small>
                    <p className="mb-0 fw-medium text-dark" style={{ fontSize: '14px' }}>{n.message}</p>
                  </li>
                ))
              )}

              {/* 🔴 See More বাটন (সব মেসেজ রাখবে) */}
              {hasMore && (
                <li className="text-center p-2 border-top">
                  <button 
                    className="btn btn-sm btn-link text-decoration-none fw-bold" 
                    onClick={() => fetchNotifications(page + 1)}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'See More'}
                  </button>
                </li>
              )}
            </ul>
          </div>

          <button className="btn btn-sm btn-danger" onClick={() => { logout(); nav('/login'); }}>
            <i className="bi bi-box-arrow-right"></i> Logout
          </button>
        </div>
      </div>
    </header>
  );
}