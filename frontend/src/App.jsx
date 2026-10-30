import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AdminHeader from './components/AdminHeader';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import ProductDetail from './pages/ProductDetail';
import CategoryPage from './pages/CategoryPage';
import SearchPage from './pages/SearchPage';
import OrderForm from './pages/OrderForm';
import CartPage from './pages/CartPage'; 
import MyOrders from './pages/MyOrders';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AddProduct from './pages/admin/AddProduct';
import PendingOrders from './pages/admin/PendingOrders';
import ProductList from './pages/admin/ProductList';
import Buyers from './pages/admin/Buyers';
import Announcements from './pages/admin/Announcements';
import EditProduct from './pages/admin/EditProduct';

export default function App() {
  const location = useLocation();
  
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  // 🔴 জাভাস্ক্রিপ্ট দিয়ে সরাসরি body-তে overflow hidden করা হচ্ছে
  useEffect(() => {
    if (isAuthPage) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    }
    
    // ক্লিনআপ ফাংশন
    return () => {
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
    };
  }, [isAuthPage]);

  return (
    <div className={isAuthPage ? "" : "d-flex flex-column min-vh-100"}>
      
      {!isAuthPage && (isAdminPage ? <AdminHeader /> : <Header />)}
      
      <main className={isAuthPage ? "" : "flex-grow-1"}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/category/:cat" element={<CategoryPage />} />
          <Route path="/search" element={<SearchPage />} />
          
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
          <Route path="/order/:productId" element={<ProtectedRoute><OrderForm /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute admin><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/add-product" element={<ProtectedRoute admin><AddProduct /></ProtectedRoute>} />
          <Route path="/admin/edit-product/:id" element={<ProtectedRoute admin><EditProduct /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute admin><PendingOrders /></ProtectedRoute>} />
          <Route path="/admin/products" element={<ProtectedRoute admin><ProductList /></ProtectedRoute>} />
          <Route path="/admin/buyers" element={<ProtectedRoute admin><Buyers /></ProtectedRoute>} />
          <Route path="/admin/announcements" element={<ProtectedRoute admin><Announcements /></ProtectedRoute>} />
        </Routes>
      </main>
      
      {!isAuthPage && !isAdminPage && <Footer />}
    </div>
  );
}