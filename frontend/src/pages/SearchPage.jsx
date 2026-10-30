import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function SearchPage() {
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search).get('q');

  useEffect(() => {
    if (query) api.get(`/products/search?q=${query}`).then(r => setProducts(r.data)).catch(e => console.log(e));
  }, [query]);

  return (
    <div className="container py-5">
      <h3 className="fw-bold mb-4">Search Results for "{query}"</h3>
      <div className="row g-4">
        {products.map(p => <div key={p._id} className="col-6 col-md-4 col-lg-3"><ProductCard product={p} /></div>)}
      </div>
      {products.length === 0 && <p className="text-muted">No products matched your search.</p>}
    </div>
  );
}