// frontend/src/components/NewLead.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewLead() {
  const [technicians, setTechnicians] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
    parts: 0,
    status: 'pending',
    assignedTechnician: '',
    technicianPercentage: 0,
    scheduledDate: '',
    jobType: '',
    payments: [],
  });

  const [paymentObj, setPaymentObj] = useState({
    method: '',
    amount: 0,
    overrideFee: null,
  });

  useEffect(() => {
    axios.get('http://localhost:5001/api/technicians')
      .then(res => setTechnicians(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5001/api/payment-methods')
      .then(res => setPaymentMethods(res.data))
      .catch(err => console.error(err));

    axios.get('http://localhost:5001/api/job-types')
      .then(res => setJobTypes(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addPayment = () => {
    if (!paymentObj.method) return alert('Select a payment method');
    setFormData(prev => ({
      ...prev,
      payments: [...prev.payments, {
        ...paymentObj,
        amount: Number(paymentObj.amount)
      }]
    }));
    setPaymentObj({ method: '', amount: 0, overrideFee: null });
  };

  const removePayment = (idx) => {
    setFormData(prev => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/leads', formData);
      alert('Lead created successfully!');
      setFormData({
        name: '',
        phone: '',
        address: '',
        notes: '',
        parts: 0,
        status: 'pending',
        assignedTechnician: '',
        technicianPercentage: 0,
        scheduledDate: '',
        jobType: '',
        payments: [],
      });
    } catch (error) {
      console.error('Error creating lead:', error);
      alert('Failed to create lead');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Create New Lead</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Customer Name</label>
          <input
            name="name"
            className="form-control"
            value={formData.name}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            className="form-control"
            value={formData.phone}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Address</label>
          <input
            name="address"
            className="form-control"
            value={formData.address}
            onChange={handleFormChange}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            value={formData.notes}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Parts (Cost)</label>
          <input
            type="number"
            name="parts"
            className="form-control"
            value={formData.parts}
            onChange={handleFormChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Technician % (override)</label>
          <input
            type="number"
            name="technicianPercentage"
            className="form-control"
            value={formData.technicianPercentage}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Assigned Technician</label>
          <select
            name="assignedTechnician"
            className="form-select"
            value={formData.assignedTechnician}
            onChange={handleFormChange}
          >
            <option value="">None</option>
            {technicians.map(t => (
              <option key={t._id} value={t._id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Scheduled Date</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            className="form-control"
            value={formData.scheduledDate}
            onChange={handleFormChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Job Type</label>
          <select
            name="jobType"
            className="form-select"
            value={formData.jobType}
            onChange={handleFormChange}
          >
            <option value="">Select Type</option>
            {jobTypes.map(jt => (
              <option key={jt._id} value={jt._id}>
                {jt.name}
              </option>
            ))}
          </select>
        </div>

        {/* Payments */}
        <div className="col-12">
          <h5>Payments</h5>
          <div className="row g-2 mb-2">
            <div className="col-md-3">
              <select
                className="form-select"
                value={paymentObj.method}
                onChange={e => setPaymentObj(prev => ({ ...prev, method: e.target.value }))}
              >
                <option value="">Select Method</option>
                {paymentMethods.map(pm => (
                  <option key={pm._id} value={pm._id}>
                    {pm.name} (Fee {pm.feePercentage}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <input
                type="number"
                placeholder="Amount"
                className="form-control"
                value={paymentObj.amount}
                onChange={e => setPaymentObj(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>
            <div className="col-md-3">
              <input
                type="number"
                placeholder="Override Fee (%)"
                className="form-control"
                value={paymentObj.overrideFee || ''}
                onChange={e => {
                  const val = e.target.value;
                  setPaymentObj(prev => ({
                    ...prev,
                    overrideFee: val === '' ? null : Number(val)
                  }));
                }}
              />
            </div>
            <div className="col-md-3">
              <button type="button" className="btn btn-secondary w-100" onClick={addPayment}>
                Add Payment
              </button>
            </div>
          </div>

          {formData.payments.length > 0 && (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Override Fee</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {formData.payments.map((p, idx) => {
                  const pm = paymentMethods.find(m => m._id === p.method);
                  return (
                    <tr key={idx}>
                      <td>{pm ? pm.name : 'Unknown'}</td>
                      <td>{p.amount}</td>
                      <td>{p.overrideFee !== null ? p.overrideFee : (pm ? pm.feePercentage : 0)}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => removePayment(idx)}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary">Create Lead</button>
        </div>
      </form>
    </div>
  );
}

export default NewLead;
