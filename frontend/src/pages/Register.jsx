import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ 
    name: '', email: '', phone: '', birthDate: '', password: '', confirmPassword: '' 
  });
  const [err, setErr] = useState('');
  const [showPass, setShowPass] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if(form.password !== form.confirmPassword) return setErr("Passwords do not match!");
    if (form.phone.length !== 11) return setErr("Phone number must be 11 digits!");
    
    try {
      const { data } = await api.post('/auth/register', form);
      alert(data.message); 
      nav('/login'); 
    } catch (e) {
      setErr(e.response?.data?.message || 'Registration failed');
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
              <img src="/register-bg.png" alt="Register Illustration" />
            </div>

            {err && <div className="alert alert-danger py-2 text-center" style={{ fontSize: '14px' }}>{err}</div>}

            <form onSubmit={submit} className="auth-form row g-2">
              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-person"></i>
                  <input type="text" placeholder="Name *" onChange={e => setForm({ ...form, name: e.target.value })} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-telephone"></i>
                  <input type="text" placeholder="Phone No *" maxLength="11" onChange={e => setForm({ ...form, phone: e.target.value })} required />
                </div>
              </div>
              
              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-envelope"></i>
                  <input type="email" placeholder="Email *" onChange={e => setForm({ ...form, email: e.target.value })} required />
                </div>
              </div>
              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-calendar"></i>
                  <input type="date" placeholder="Birth of Date *" onChange={e => setForm({ ...form, birthDate: e.target.value })} required style={{ color: '#888' }} />
                </div>
              </div>

              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-lock"></i>
                  <input type={showPass ? "text" : "password"} placeholder="Password *" onChange={e => setForm({ ...form, password: e.target.value })} required />
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} auth-eye`} onClick={() => setShowPass(!showPass)}></i>
                </div>
              </div>
              <div className="col-md-6">
                <div className="auth-input-group">
                  <i className="bi bi-lock"></i>
                  <input type={showPass ? "text" : "password"} placeholder="Confirm Password *" onChange={e => setForm({ ...form, confirmPassword: e.target.value })} required />
                  <i className={`bi ${showPass ? 'bi-eye-slash' : 'bi-eye'} auth-eye`} onClick={() => setShowPass(!showPass)}></i>
                </div>
              </div>

              <div className="col-12 mt-2">
                <button type="submit" className="auth-btn">CREATE ACCOUNT</button>
              </div>
            </form>

            <p className="auth-footer-text text-center text-md-start mt-2">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>

        <div className="auth-image-side d-none d-lg-flex">
          <img src="/register-bg.png" alt="Register Illustration" />
        </div>
      </div>
    </div>
  );
}