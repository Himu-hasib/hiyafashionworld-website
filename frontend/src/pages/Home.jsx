import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [announcements, setAnnouncements] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [topSelling, setTopSelling] = useState([]);

  useEffect(() => {
    api.get('/announcements/all').then(r => setAnnouncements(r.data)).catch(e => console.log(e));
    api.get('/products/status/NEW_ARRIVAL').then(r => setNewArrivals(r.data)).catch(e => console.log(e));
    api.get('/products/status/TOP_SELLING').then(r => setTopSelling(r.data)).catch(e => console.log(e));
  }, []);

  return (
    <div className="container-fluid py-4" style={{ paddingLeft: '20px', paddingRight: '20px', maxWidth: '100%' }}>
      
      {announcements.length > 0 && (
        <div id="annSlider" className="carousel slide mb-5 rounded-3 overflow-hidden shadow-sm" data-bs-ride="carousel">
          <div className="carousel-inner">
            {announcements.map((a, i) => (
              <div key={a._id} className={`carousel-item ${i === 0 ? 'active' : ''}`}>
                <img 
                  src={a.image} 
                  className="d-block w-100" 
                  style={{ height: 'auto', maxHeight: '400px', objectFit: 'cover' }} 
                  alt="Announcement" 
                />
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" data-bs-target="#annSlider" data-bs-slide="prev">
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button className="carousel-control-next" data-bs-target="#annSlider" data-bs-slide="next">
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      )}

      <h4 className="fw-bold text-danger mb-3">✨ New Arrivals</h4>
      {/* 🔴 এখানে col-xl-3 বাড়িয়ে দেওয়া হলো যাতে বড় স্ক্রিনে কার্ডগুলো ছোট ও সুন্দর দেখায় */}
      <div className="row mb-5">
        {newArrivals.map(p => (
          <div key={p._id} className="col-6 col-md-4 col-lg-3 col-xl-2 product-card-col">
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      <h4 className="fw-bold text-danger mb-3">🔥 Top Selling</h4>
      <div className="row">
        {topSelling.map(p => (
          <div key={p._id} className="col-6 col-md-4 col-lg-3 col-xl-2 product-card-col">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
          
    </div>
  );
}