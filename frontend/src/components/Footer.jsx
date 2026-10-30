import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer-wrapper">
      
      <div className="footer-container">
        {/* Top Section: 4 Columns */}
        <div className="footer-top row g-4">
          
          {/* Column 1: Logo & About */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <div className="footer-brand">
              <h1 className="footer-logo">Hiya</h1>
              <h4 className="footer-subtitle">Fashion World</h4>
              <p className="footer-tagline">Be Bold, Be beautiful, Be You.</p>
            </div>
            <p className="footer-desc">
              Discover your style with Hiya Fashion World. Trendy outfits, premium quality and unbeatable comfort – all in one place.
            </p>
            <div className="footer-socials">
              <a href="https://www.facebook.com/fashionshop.hiya" target="_blank" rel="noreferrer" className="social-circle"><i className="bi bi-facebook"></i></a>
              <a href="https://www.instagram.com/hiyaonlineshop2023/" target="_blank" rel="noreferrer" className="social-circle"><i className="bi bi-instagram"></i></a>
              <a href="https://wa.me/qr/PIP6N3FLNTHGF1" target="_blank" rel="noreferrer" className="social-circle">
  <i className="lab la-whatsapp"></i>
</a>
              
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5 className="footer-heading">Quick Links</h5>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/">New Arrivals</Link></li>
              <li><Link to="/top-sell">Top Sell</Link></li>
              <li><Link to="/best-sellers">Best Sellers</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div className="col-lg-2 col-md-6 col-6 mb-4 mb-lg-0">
            <h5 className="footer-heading">Customer Service</h5>
            <ul className="footer-links">
              <li><Link to="/faq">FAQs</Link></li>
              <li><Link to="/return-policy">Return & Refund Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Contact Us & Newsletter */}
          <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
            <h5 className="footer-heading">Contact Us</h5>
            <ul className="footer-contact mb-4">
              <li><i className="bi bi-geo-alt"></i> B-17,Arambagh Abhasik,Mirpur-7,Dhaka, Bangladesh</li>
              <li><i className="bi bi-telephone"></i> +880 1749099869</li>
              <li><i className="bi bi-envelope"></i> support@hiyafashionworld.com</li>
            </ul>

            <h5 className="footer-heading">Newsletter</h5>
            <p className="footer-desc small mb-3">Get the latest updates on new arrivals, exclusive offers and more.</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Your email address" required />
              <button type="submit"><i className="bi bi-send"></i></button>
            </form>
          </div>
        </div>
      </div>

      {/* 🔴 Bottom Section: Copyright & Payments */}
      <div className="footer-bottom-wrapper">
        <div className="footer-container">
          <div className="row align-items-center">
            
            <div className="col-md-5 text-center text-md-start mb-3 mb-md-0">
              <p className="mb-0" style={{ color: '#fff', fontSize: '13px' }}>© 2025 Hiya Fashion World. All rights reserved.</p>
            </div>
            
            <div className="col-md-7 d-flex flex-column flex-md-row justify-content-center justify-content-md-end align-items-center gap-3">
              
              {/* 🔴 লোকাল ফোল্ডার থেকে পেমেন্ট মেথডের ছবি */}
                            {/* 🔴 পেমেন্ট মেথডের ছবি (uploads ফোল্ডার থেকে) */}
              <div className="payment-methods">
                <img src="/public/visa.png" alt="Visa" />
                <img src="/public/mastercard.png" alt="Mastercard" />
                <img src="/public/bkash.png" alt="Bkash" />
                <img src="/public/nagad.png" alt="Nagad" />
              </div>
              <div className="ssl-secure" style={{ color: '#fff' }}>
                <i className="bi bi-shield-check"></i>
                <span>SSL<br/>SECURE</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Decorative Bottom Wave */}
      <div className="footer-wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path fill="#4a148c" d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </footer>
  );
}