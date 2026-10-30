import { Link, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

export default function Header() {
  const { user, setUser, logout } = useAuth();
  const [q, setQ] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileCatOpen, setMobileCatOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [categories, setCategories] = useState([]);
  
  const nav = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (user) api.get('/cart/my').then(r => setCartCount(r.data.length)).catch(() => {});
    api.get('/categories/all').then(r => setCategories(r.data)).catch(() => {});

    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [user]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (q.trim()) nav(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const { data } = await api.put('/users/me', { profilePic: reader.result });
        setUser(data);
      } catch (err) {
        alert('Failed to update picture');
      }
    };
    reader.readAsDataURL(file);
  };

  const firstLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <header className="shadow-sm sticky-top bg-white">
      <div className="container-fluid header-container-fluid d-flex align-items-center justify-content-between flex-wrap gap-3">
        
        {/* Left: Logo & Categories */}
        <div className="d-flex align-items-center gap-4">
          
          {/* 🔴 এখানে আপনার লোগো বসানোর জায়গা (frontend/public/logo.png) */}
          <Link to="/" className="text-decoration-none d-flex align-items-center gap-2">
            <img 
              src="/logo.png" 
              alt="Company Logo" 
              style={{ height: '80px', width: 'auto', objectFit: 'contain' }} 
            />
          </Link>
          
          <div className="d-flex align-items-center gap-2 ms-3">
            <div 
              className="position-relative"
              onMouseEnter={() => setMobileCatOpen(true)}
              onMouseLeave={() => setMobileCatOpen(false)}
            >
              <button className="btn category-btn fw-bold px-3 py-2 shadow-none d-flex align-items-center gap-2 fs-5">
                <i className="las la-bars fs-3"></i> Categories
              </button>
              
              {mobileCatOpen && (
                <div className="mobile-menu shadow border bg-white rounded p-2 position-absolute" style={{ width: '240px', zIndex: 1000, top: '100%', left: 0 }}>
                  {categories.map((cat) => (
                    <div key={cat._id} className="position-relative category-item-mobile">
                      <Link to={`/category/${cat.name.toLowerCase().replace(/ /g, ' ')}`} className="d-block py-2 text-decoration-none text-dark border-bottom category-link">
                        {cat.name}
                      </Link>
                      {cat.subCategories?.length > 0 && (
                        <div className="mobile-submenu shadow border bg-white">
                          {cat.subCategories.map(sub => (
                            <Link key={sub} to={`/category/${cat.name.toLowerCase().replace(/ /g, ' ')}?sub=${sub.toLowerCase()}`} className="d-block py-2 px-3 text-decoration-none text-dark border-bottom submenu-link">
                              {sub}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Middle: Search */}
        <form onSubmit={handleSearch} className="d-flex flex-grow-1 order-3 order-lg-2 mx-lg-4 search-form">
          <input
            value={q} onChange={e => setQ(e.target.value)}
            className="form-control form-control-lg shadow-none"
            placeholder="Search in Hiya Fashion World"
            style={{ borderColor: '#f85606', borderRadius: '4px 0 0 4px', borderRight: 'none', fontSize: '1.1rem' }}
          />
          <button className="btn text-white fw-bold px-4 fs-5" style={{ backgroundColor: '#f85606', borderRadius: '0 4px 4px 0' }}>
            Search
          </button>
        </form>

        {/* Right: Login/Cart/Profile */}
        <div className="d-flex align-items-center gap-2 gap-lg-4 order-2 order-lg-3">
          {!user ? (
            <Link to="/login" className="btn text-white fw-bold px-4 fs-5" style={{ backgroundColor: '#f85606' }}>
              Login
            </Link>
          ) : (
            <>
              <Link to="/my-orders" className="btn my-orders-btn fw-bold border-0 px-2 px-lg-3 py-2">
                <i className="las la-box fs-3 me-lg-1"></i> 
                <span className="d-none d-lg-inline fs-5">My Orders</span>
              </Link>

              <Link to="/cart" className="btn position-relative">
                <i className="las la-shopping-cart fs-1"></i>
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger fs-6">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="position-relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn rounded-circle p-0 border d-flex align-items-center justify-content-center overflow-hidden"
                  style={{ width: 45, height: 45, backgroundColor: '#f85606', color: 'white', fontWeight: 'bold', fontSize: '1.2rem' }}
                >
                  {user.profilePic ? (
                    <img src={user.profilePic} alt="Profile" className="w-100 h-100" style={{ objectFit: 'cover' }} />
                  ) : (
                    firstLetter
                  )}
                </button>

                {dropdownOpen && (
                  <div className="position-absolute end-0 mt-2 bg-white shadow border rounded-3" style={{ width: '220px', zIndex: 1000 }}>
                    <div className="p-3 border-bottom">
                      <p className="mb-0 fw-bold">{user.name}</p>
                      <small className="text-muted">{user.email}</small>
                    </div>
                    <Link to="/profile" className="dropdown-item p-3" onClick={() => setDropdownOpen(false)}>
                      <i className="las la-user me-2"></i> Edit Profile
                    </Link>
                    <label className="dropdown-item p-3 mb-0" style={{ cursor: 'pointer' }}>
                      <i className="las la-camera me-2"></i> Upload Picture
                      <input type="file" accept="image/*" className="d-none" onChange={handleFileUpload} />
                    </label>
                    {user.role === 'ADMIN' && (
                      <Link to="/admin" className="dropdown-item p-3 text-primary fw-bold" onClick={() => setDropdownOpen(false)}>
                        <i className="las la-shield-alt me-2"></i> Admin Panel
                      </Link>
                    )}
                    <button className="dropdown-item p-3 text-danger w-100 text-start border-top" onClick={() => { logout(); setDropdownOpen(false); nav('/login'); }}>
                      <i className="las la-sign-out-alt me-2"></i> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}