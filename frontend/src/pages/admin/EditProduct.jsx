import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

export default function EditProduct() {
  const { id } = useParams(); // URL থেকে প্রোডাক্টের আইডি নেয়
  const nav = useNavigate();
  
  const [form, setForm] = useState({
    name: '', specification: '', mainCategory: 'three_piece', subCategory: '', 
    price: '', discount: '', stockType: 'IN_STOCK', status: 'NORMAL'
  });
  const [oldImages, setOldImages] = useState([]); // আগের ছবি দেখানোর জন্য
  const [newImages, setNewImages] = useState(null); // নতুন ছবি আপলোডের জন্য
  const [loading, setLoading] = useState(false);

  // ১. পেজ লোড হলে পুরোনো ডাটা নিয়ে আসা
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(res => {
        const p = res.data;
        setForm({
          name: p.name || '', specification: p.specification || '', mainCategory: p.mainCategory || 'three_piece',
          subCategory: p.subCategory || '', price: p.price || '', discount: p.discount || '',
          stockType: p.stockType || 'IN_STOCK', status: p.status || 'NORMAL'
        });
        setOldImages(p.images || []);
      })
      .catch(err => alert('Failed to load product'));
  }, [id]);

  // ২. ফর্ম সাবমিট (আপডেট করা)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('specification', form.specification);
    formData.append('mainCategory', form.mainCategory);
    formData.append('subCategory', form.subCategory);
    formData.append('price', form.price);
    formData.append('discount', form.discount);
    formData.append('stockType', form.stockType);
    formData.append('status', form.status);
    
    // যদি নতুন ছবি আপলোড করে থাকেন
    if (newImages && newImages.length > 0) {
      for (let i = 0; i < newImages.length; i++) {
        formData.append('images', newImages[i]);
      }
    }

    try {
      // এখানে PUT রিকোয়েস্ট পাঠানো হচ্ছে (আপডেটের জন্য)
      await api.put(`/products/admin/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product Updated Successfully!');
      nav('/admin/products');
    } catch (err) {
      alert('Error updating product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <div className="card shadow border-0 rounded-4 p-4">
        <h3 className="fw-bold mb-4">Edit Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label>Product Name</label>
              <input required className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Price (৳)</label>
              <input type="number" required className="form-control" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Main Category</label>
              <select className="form-select" value={form.mainCategory} onChange={e => setForm({ ...form, mainCategory: e.target.value })}>
                <option value="three_piece">Three Piece</option>
                <option value="kurti">Kurti</option>
                <option value="crochet">Crochet</option>
                <option value="bag">Bag</option>
                <option value="ornaments">Ornaments</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Sub Category</label>
              <input className="form-control" value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Discount (%)</label>
              <input type="number" className="form-control" value={form.discount} onChange={e => setForm({ ...form, discount: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="NORMAL">Normal</option>
                <option value="NEW_ARRIVAL">New Arrival</option>
                <option value="TOP_SELLING">Top Selling</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Stock Type</label>
              <select className="form-select" value={form.stockType} onChange={e => setForm({ ...form, stockType: e.target.value })}>
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
            
            {/* পুরোনো ছবি দেখানোর জন্য */}
            <div className="col-12">
              <label>Current Images</label>
              <div className="d-flex gap-2">
                {oldImages.map((img, i) => (
                  <img key={i} src={img} alt="old" style={{ width: 60, height: 60, objectFit: 'cover' }} className="rounded border" />
                ))}
              </div>
            </div>

            <div className="col-md-6">
              <label>Upload New Images (Optional)</label>
              <input type="file" multiple accept="image/*" className="form-control" onChange={e => setNewImages(e.target.files)} />
            </div>
            
            <div className="col-12">
              <label>Specification</label>
              <textarea className="form-control" rows="3" value={form.specification} onChange={e => setForm({ ...form, specification: e.target.value })}></textarea>
            </div>
          </div>
          <button disabled={loading} className="btn btn-warning text-dark mt-4 w-100 fw-bold">
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </div>
  );
}