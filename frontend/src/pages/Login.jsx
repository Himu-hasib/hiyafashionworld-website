import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [err, setErr] = useState('');
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(form.phone, form.password);
      if (data.role === 'ADMIN') nav('/admin'); 
      else nav('/'); 
    } catch (e) {
      setErr(e.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-fullpage">
      <div className="auth-side-design">
        <div className="bar purple-dark"></div>
        <div className="bar purple-light"></div>
        <div className="bar pink"></div>
      </div>

      <div className="auth-content-wrapper">
        <div className="auth-form-side">
          <div className="auth-form-inner">
            
            <div className="auth-header">
              <h1 className="auth-logo">Hiya</h1>
              <h4 className="auth-subtitle">Fashion World</h4>
              <p className="auth-tagline">Be Bold, Be beautiful, Be You.</p>
            </div>

            <div className="mobile-image d-lg-none">
              <img src="/login-bg.png" alt="Login Illustration" />
            </div>

            {err && <div className="alert alert-danger py-2 text-center" style={{ fontSize: '14px' }}>{err}</div>}

            <form onSubmit={submit} className="auth-form">
              <div className="auth-input-group">
                <i className="bi bi-telephone"></i>
                <input type="text" placeholder="Phone No" onChange={e => setForm({ ...form, phone: e.target.value })} required />
              </div>
              
              <div className="auth-input-group">
                <i className="bi bi-lock"></i>
                <input type={showPass ? "text" : "password"} placeholder="Password" onChange={e => setForm({ ...form, password: e.target.value })} required />
                <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} auth-eye`} onClick={() => setShowPass(!showPass)}></i>
              </div>

              <button type="submit" className="auth-btn mt-3">LOGIN</button>
            </form>

            <p className="auth-footer-text text-center text-md-start">
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>

        <div className="auth-image-side d-none d-lg-flex">
          <img src="/login-bg.png" alt="Login Illustration" />
        </div>
      </div>
    </div>
  );
}