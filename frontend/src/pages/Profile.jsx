import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '' });

  useEffect(() => {
    if(user) setForm({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
  }, [user]);

  const updateInfo = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/me', form);
      setUser(data);
      alert('Profile Updated Successfully!');
    } catch (err) {
      alert('Failed to update profile');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/me/password', passForm);
      alert('Password Updated Successfully!');
      setPassForm({ oldPassword: '', newPassword: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to change password');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          
          {/* প্রোফাইল আপডেট কার্ড */}
          <div className="card shadow border-0 rounded-4 text-center p-4 mb-4">
            {user?.profilePic ? (
              <img src={user.profilePic} className="rounded-circle mx-auto mb-3 border" style={{ width: 120, height: 120, objectFit: 'cover' }} alt="Profile" />
            ) : (
              <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center text-white fw-bold fs-1 shadow-sm" style={{ width: 120, height: 120, backgroundColor: '#f85606' }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h5 className="fw-bold">{user?.name}</h5>
            <p className="text-muted mb-4">{user?.email}</p>
            <hr />
            <h6 className="fw-bold text-start mb-3">Update Profile</h6>
            <form onSubmit={updateInfo} className="text-start">
              <div className="mb-3">
                <label className="small text-muted mb-1">Full Name</label>
                <input className="form-control" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="mb-3">
                <label className="small text-muted mb-1">Phone</label>
                <input className="form-control" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="mb-4">
                <label className="small text-muted mb-1">Address</label>
                <textarea className="form-control" rows="2" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}></textarea>
              </div>
              <button className="btn btn-danger w-100 fw-bold py-2">Save Changes</button>
            </form>
          </div>

          {/* পাসওয়ার্ড চেঞ্জ কার্ড */}
          <div className="card shadow border-0 rounded-4 p-4">
            <h6 className="fw-bold mb-3">Change Password</h6>
            <form onSubmit={handleChangePassword}>
              <div className="mb-3">
                <label className="small text-muted mb-1">Current Password</label>
                <input type="password" className="form-control" onChange={e => setPassForm({...passForm, oldPassword: e.target.value})} required />
              </div>
              <div className="mb-4">
                <label className="small text-muted mb-1">New Password</label>
                <input type="password" className="form-control" onChange={e => setPassForm({...passForm, newPassword: e.target.value})} required />
              </div>
              <button className="btn btn-warning w-100 fw-bold text-dark py-2">Update Password</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}