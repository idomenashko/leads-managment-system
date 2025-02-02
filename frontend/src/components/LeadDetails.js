// frontend/src/components/LeadDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [technicians, setTechnicians] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [paymentObj, setPaymentObj] = useState({
    method: '',
    amount: 0,
    overrideFee: null,
  });

  useEffect(() => {
    axios.get(`http://localhost:5001/api/leads/${id}`)
      .then(res => setLead(res.data))
      .catch(err => console.log(err));

    axios.get('http://localhost:5001/api/technicians')
      .then(res => setTechnicians(res.data))
      .catch(err => console.log(err));

    axios.get('http://localhost:5001/api/payment-methods')
      .then(res => setPaymentMethods(res.data))
      .catch(err => console.log(err));

    axios.get('http://localhost:5001/api/job-types')
      .then(res => setJobTypes(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    if (!lead) return;
    const { name, value } = e.target;
    setLead(prev => ({ ...prev, [name]: value }));
  };

  const addPayment = () => {
    if (!paymentObj.method) return alert('Select a payment method');
    setLead(prev => ({
      ...prev,
      payments: [...prev.payments, {
        ...paymentObj,
        amount: Number(paymentObj.amount)
      }]
    }));
    setPaymentObj({ method: '', amount: 0, overrideFee: null });
  };

  const removePayment = (idx) => {
    if (!lead) return;
    setLead(prev => ({
      ...prev,
      payments: prev.payments.filter((_, i) => i !== idx)
    }));
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`http://localhost:5001/api/leads/${id}`, lead);
      setLead(res.data);
      alert('Lead updated!');
    } catch (error) {
      console.error('Error updating lead:', error);
      alert('Failed to update lead');
    }
  };

  if (!lead) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Edit Lead</h2>
      <div className="row g-3">
        <div className="col-md-4">
          <label className="form-label">Name</label>
          <input
            name="name"
            className="form-control"
            value={lead.name || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            className="form-control"
            value={lead.phone || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Address</label>
          <input
            name="address"
            className="form-control"
            value={lead.address || ''}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            value={lead.notes || ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Parts (Cost)</label>
          <input
            type="number"
            name="parts"
            className="form-control"
            value={lead.parts || 0}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Technician % (override)</label>
          <input
            type="number"
            name="technicianPercentage"
            className="form-control"
            value={lead.technicianPercentage || 0}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            name="status"
            className="form-select"
            value={lead.status}
            onChange={handleChange}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Assigned Technician</label>
          <select
            name="assignedTechnician"
            className="form-select"
            value={lead.assignedTechnician || ''}
            onChange={handleChange}
          >
            <option value="">None</option>
            {technicians.map(t => (
              <option key={t._id} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <label className="form-label">Scheduled Date</label>
          <input
            type="datetime-local"
            name="scheduledDate"
            className="form-control"
            value={lead.scheduledDate ? lead.scheduledDate.slice(0,16) : ''}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label className="form-label">Job Type</label>
          <select
            name="jobType"
            className="form-select"
            value={lead.jobType || ''}
            onChange={handleChange}
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
          <table className="table table-bordered mb-2">
            <thead>
              <tr>
                <th>Method</th>
                <th>Amount</th>
                <th>Override Fee</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lead.payments.map((p, idx) => {
                const pm = p.method; // לאחר populate
                const feeDisplay = (p.overrideFee !== null && p.overrideFee !== undefined)
                  ? p.overrideFee
                  : pm ? pm.feePercentage : 0;
                return (
                  <tr key={idx}>
                    <td>{pm ? pm.name : 'Unknown'}</td>
                    <td>{p.amount}</td>
                    <td>{feeDisplay}</td>
                    <td>
                      <button
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

          <div className="row g-2">
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
                placeholder="Override Fee"
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
              <button
                type="button"
                className="btn btn-secondary w-100"
                onClick={addPayment}
              >
                Add Payment
              </button>
            </div>
          </div>
        </div>

        <div className="col-12">
          <label>Created At: </label>
          {lead.createdAt ? new Date(lead.createdAt).toLocaleString() : ''}
        </div>

        <div className="col-12">
          <button onClick={handleUpdate} className="btn btn-primary">Save</button>
        </div>
      </div>
    </div>
  );
}

export default LeadDetails;
