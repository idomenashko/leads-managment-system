// frontend/src/components/PaymentMethods.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [formData, setFormData] = useState({ name: '', feePercentage: 0 });

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/payment-methods');
      setMethods(res.data);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      alert('Failed to fetch payment methods');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/payment-methods', formData);
      alert('Payment method added successfully!');
      setFormData({ name: '', feePercentage: 0 });
      fetchMethods();
    } catch (error) {
      console.error('Error adding payment method:', error);
      alert('Failed to add payment method');
    }
  };

  const handleDelete = async (id, name) => {
    // לא ניתן למחוק אם השם הוא "Cash" או "מזומן"
    if (name.toLowerCase() === 'cash' || name === 'מזומן') {
      alert('Cannot delete Cash payment method.');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this method?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/payment-methods/${id}`);
      setMethods(prev => prev.filter(m => m._id !== id));
    } catch (error) {
      console.error('Error deleting payment method:', error);
      alert('Failed to delete payment method');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div>
      <h2 className="mb-4">Payment Methods</h2>
      <form onSubmit={handleSubmit} className="row g-3 mb-4">
        <div className="col-md-6">
          <label className="form-label">Method Name</label>
          <input name="name" className="form-control" value={formData.name} onChange={handleChange} />
        </div>
        <div className="col-md-6">
          <label className="form-label">Fee Percentage</label>
          <input
            type="number"
            name="feePercentage"
            className="form-control"
            value={formData.feePercentage}
            onChange={handleChange}
          />
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Add Method</button>
        </div>
      </form>

      {methods.length === 0 ? (
        <p>No payment methods found.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th>Fee %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {methods.map(m => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.feePercentage}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(m._id, m.name)}
                  >
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

export default PaymentMethods;
