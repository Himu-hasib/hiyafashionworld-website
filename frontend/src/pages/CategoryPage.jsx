import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';

export default function CategoryPage() {
  const { cat } = useParams();
  const [products, setProducts] = useState([]);
  const query = new URLSearchParams(useLocation().search);
  const sub = query.get('sub');

  useEffect(() => {
    api.get(`/products/category/${cat}`).then(r => {
      let data = r.data;
      if (sub) data = data.filter(p => p.subCategory?.toLowerCase() === sub);
      setProducts(data);
    }).catch(e => console.log(e));
  }, [cat, sub]);

  return (
    <div className="container py-5">
      <h3 className="fw-bold text-danger mb-4 text-capitalize">{cat.replace('_', ' ')} {sub && `- ${sub}`}</h3>
      <div className="row g-4">
        {products.map(p => <div key={p._id} className="col-6 col-md-4 col-lg-3"><ProductCard product={p} /></div>)}
      </div>
      {products.length === 0 && <p className="text-muted">No products found.</p>}
    </div>
  );
}