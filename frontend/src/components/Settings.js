// frontend/src/components/Settings.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function Settings() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [pmForm, setPmForm] = useState({ name: '', feePercentage: 0 });

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = () => {
    axios.get('http://localhost:5001/api/payment-methods')
      .then(res => setPaymentMethods(res.data))
      .catch(err => console.error(err));
  };

  const handlePmChange = (e) => {
    setPmForm({ ...pmForm, [e.target.name]: e.target.value });
  };

  const handlePmSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5001/api/payment-methods', pmForm)
      .then(() => {
        setPmForm({ name: '', feePercentage: 0 });
        fetchPaymentMethods();
      })
      .catch(err => console.error(err));
  };

  const deleteMethod = (id) => {
    axios.delete(`http://localhost:5001/api/payment-methods/${id}`)
      .then(() => fetchPaymentMethods())
      .catch(err => console.error(err));
  };

  return (
    <div>
      <h2 className="mb-4">Settings</h2>

      <div className="mb-4">
        <h4>Payment Methods</h4>
        <form onSubmit={handlePmSubmit} className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label">Name</label>
            <input
              name="name"
              className="form-control"
              value={pmForm.name}
              onChange={handlePmChange}
            />
          </div>
          <div className="col-md-4">
            <label className="form-label">Fee %</label>
            <input
              type="number"
              name="feePercentage"
              className="form-control"
              value={pmForm.feePercentage}
              onChange={handlePmChange}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100">Add</button>
          </div>
        </form>

        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Fee %</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {paymentMethods.map(pm => (
              <tr key={pm._id}>
                <td>{pm.name}</td>
                <td>{pm.feePercentage}</td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMethod(pm._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paymentMethods.length === 0 && (
              <tr><td colSpan="3">No payment methods yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Settings;
