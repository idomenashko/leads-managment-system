// frontend/src/components/JobTypes.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function JobTypes() {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetchTypes();
  }, []);

  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  const fetchTypes = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/job-types', { headers });
      setTypes(res.data);
    } catch (error) {
      console.error('Error fetching job types:', error);
      alert('Failed to fetch job types');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/job-types', { name }, { headers });
      setName('');
      fetchTypes();
    } catch (error) {
      console.error('Error creating job type:', error);
      alert('Failed to create job type (maybe not admin?)');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job type?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/job-types/${id}`, { headers });
      fetchTypes();
    } catch (error) {
      console.error('Error deleting job type:', error);
      alert('Failed to delete job type');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Job Types</h2>
      <form onSubmit={handleAdd} className="row g-3 mb-4" style={{ maxWidth: 400 }}>
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Job Type Name"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <button className="btn btn-primary w-100">Add</button>
        </div>
      </form>

      {types.length === 0 ? (
        <p>No job types found.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Name</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {types.map(t => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t._id)}>
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

export default JobTypes;
