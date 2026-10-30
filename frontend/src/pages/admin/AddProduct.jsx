import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    name: '', specification: '', mainCategory: 'three_piece', subCategory: '', price: '', discount: '', stockType: 'IN_STOCK', status: 'NORMAL'
  });
  const [images, setImages] = useState(null);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    api.get('/categories/all').then(r => {
      setCategories(r.data);
      // ডিফল্টভাবে প্রথম ক্যাটাগরির সাব-ক্যাটাগরি সেট করা
      if (r.data.length > 0) {
        const firstCat = r.data.find(c => c.name.toLowerCase().replace(/ /g, '_') === 'three_piece');
        if (firstCat) setSubCategories(firstCat.subCategories || []);
      }
    });
  }, []);

  const handleMainCategoryChange = (e) => {
    const selectedCat = e.target.value;
    setForm({ ...form, mainCategory: selectedCat, subCategory: '' });
    
    // মেইন ক্যাটাগরি পরিবর্তন হলে সাব-ক্যাটাগরি আপডেট হবে
    const catData = categories.find(c => c.name.toLowerCase().replace(/ /g, '_') === selectedCat);
    setSubCategories(catData ? catData.subCategories : []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!images || images.length === 0) return alert('Please select at least one image!');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('specification', form.specification);
    formData.append('mainCategory', form.mainCategory);
    formData.append('subCategory', form.subCategory);
    formData.append('price', form.price);
    formData.append('discount', form.discount || 0);
    formData.append('stockType', form.stockType);
    formData.append('status', form.status);

    for (let i = 0; i < images.length; i++) {
      formData.append('images', images[i]);
    }
    if (video) formData.append('video', video);

    try {
      await api.post('/products/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Product Added Successfully!');
      nav('/admin/products');
    } catch (err) {
      alert('Error adding product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: 800 }}>
      <div className="card shadow border-0 rounded-4 p-4">
        <h3 className="fw-bold mb-4">Add New Product</h3>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label>Product Name</label>
              <input required className="form-control" onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Price (৳)</label>
              <input type="number" required className="form-control" onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            
            {/* মেইন ক্যাটাগরি ড্রপডাউন */}
            <div className="col-md-6">
              <label>Main Category</label>
              <select className="form-select" value={form.mainCategory} onChange={handleMainCategoryChange}>
                {categories.map(cat => (
                  <option key={cat._id} value={cat.name.toLowerCase().replace(/ /g, '_')}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* সাব ক্যাটাগরি ড্রপডাউন */}
            <div className="col-md-6">
              <label>Sub Category</label>
              <select className="form-select" value={form.subCategory} onChange={e => setForm({ ...form, subCategory: e.target.value })}>
                <option value="">Select Sub Category</option>
                {subCategories.map(sub => (
                  <option key={sub} value={sub.toLowerCase()}>{sub}</option>
                ))}
              </select>
            </div>

            <div className="col-md-6">
              <label>Discount (%)</label>
              <input type="number" className="form-control" onChange={e => setForm({ ...form, discount: e.target.value })} />
            </div>
            <div className="col-md-6">
              <label>Status</label>
              <select className="form-select" onChange={e => setForm({ ...form, status: e.target.value })}>
                <option value="NORMAL">Normal</option>
                <option value="NEW_ARRIVAL">New Arrival</option>
                <option value="TOP_SELLING">Top Selling</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Stock Type</label>
              <select className="form-select" onChange={e => setForm({ ...form, stockType: e.target.value })}>
                <option value="IN_STOCK">In Stock</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Upload Images (Max 5)</label>
              <input type="file" multiple accept="image/*" required className="form-control" onChange={e => setImages(e.target.files)} />
            </div>
            <div className="col-md-6">
              <label>Upload Video (Optional)</label>
              <input type="file" accept="video/*" className="form-control" onChange={e => setVideo(e.target.files[0])} />
            </div>
            <div className="col-12">
              <label>Specification</label>
              <textarea className="form-control" rows="3" onChange={e => setForm({ ...form, specification: e.target.value })}></textarea>
            </div>
          </div>
          <button disabled={loading} className="btn btn-danger mt-4 w-100 fw-bold">
            {loading ? 'Uploading...' : 'Save Product'}
          </button>
        </form>
      </div>
    </div>
  );
}