import { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function Announcements() {
  const [items, setItems] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/announcements/all').then(r => setItems(r.data));
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!image) return alert('Please select an image');
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      await api.post('/announcements/admin/add', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setImage(null);
      e.target.reset();
      load();
    } catch (err) {
      alert('Error uploading image');
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    await api.delete(`/announcements/admin/${id}`);
    load();
  };

  return (
    <div className="container py-5">
      <h2 className="fw-bold mb-4">Announcement Slider</h2>
      <form onSubmit={add} className="d-flex gap-2 mb-4">
        <input type="file" accept="image/*" required className="form-control" onChange={e => setImage(e.target.files[0])} />
        <button disabled={loading} className="btn btn-danger px-4">
          {loading ? 'Uploading...' : 'Add'}
        </button>
      </form>
      <div className="row g-3">
        {items.map(a => (
          <div key={a._id} className="col-md-4 position-relative">
            <img src={a.image} className="rounded shadow-sm" style={{ height: 150, width: '100%', objectFit: 'cover' }} alt="ann" />
            <button className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2" onClick={() => del(a._id)}>X</button>
          </div>
        ))}
      </div>
    </div>
  );
}