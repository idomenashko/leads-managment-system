// frontend/src/components/Technicians.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Technicians() {
  const [technicians, setTechnicians] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    basePercentage: 35,
    color: '#ffffff',
  });

  useEffect(() => {
    fetchTechs();
  }, []);

  const fetchTechs = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/technicians');
      setTechnicians(res.data);
    } catch (error) {
      console.error('Error fetching technicians:', error);
      alert('Failed to fetch technicians');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/technicians', formData);
      alert('Technician added successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        basePercentage: 35,
        color: '#ffffff',
      });
      fetchTechs();
    } catch (error) {
      console.error('Error adding technician:', error);
      alert('Failed to add technician');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/technicians/${id}`);
      setTechnicians(prev => prev.filter(t => t._id !== id));
    } catch (error) {
      console.error('Error deleting technician:', error);
      alert('Failed to delete technician');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Technicians</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-3">
          <label className="form-label">Name</label>
          <input name="name" className="form-control" value={formData.name} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Email</label>
          <input name="email" className="form-control" value={formData.email} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Phone</label>
          <input name="phone" className="form-control" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Base %</label>
          <input type="number" name="basePercentage" className="form-control" value={formData.basePercentage} onChange={handleChange} />
        </div>
        <div className="col-md-3">
          <label className="form-label">Color</label>
          <input type="color" name="color" className="form-control form-control-color" value={formData.color} onChange={handleChange} />
        </div>
        <div className="col-12">
          <button className="btn btn-success">Add Technician</button>
        </div>
      </form>

      {technicians.length === 0 ? (
        <p>No technicians found.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Base %</th>
              <th>Color</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {technicians.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td>{t.basePercentage}</td>
                <td>
                  <div style={{ width: 30, height: 20, backgroundColor: t.color }} />
                </td>
                <td>
                  <button onClick={() => handleDelete(t._id)} className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Technicians;
