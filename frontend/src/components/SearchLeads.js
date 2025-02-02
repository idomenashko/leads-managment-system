// frontend/src/components/SearchLeads.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SearchLeads() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/leads/search', {
        params: { query }
      });
      setResults(res.data);
    } catch (error) {
      console.error('Error searching leads:', error);
      alert('Failed to fetch leads');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/leads/${id}`);
      setResults(prev => prev.filter(lead => lead._id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Search Leads</h2>
      <div className="row g-2 mb-4">
        <div className="col-md-6">
          <input
            className="form-control"
            placeholder="Enter address, phone or jobRef"
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="col-md-2">
          <button className="btn btn-primary w-100" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>JobRef</th>
              <th>Job Type</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Status</th>
              <th>Technician</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {results.map(lead => {
              const rowColor = lead.assignedTechnician?.color || '#fff';
              return (
                <tr key={lead._id} style={{ background: rowColor }}>
                  <td>{lead.jobRef}</td>
                  <td>{lead.jobType ? lead.jobType.name : ''}</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.address}</td>
                  <td>{lead.status}</td>
                  <td>{lead.assignedTechnician ? lead.assignedTechnician.name : 'None'}</td>
                  <td>
                    <Link to={`/leads/${lead._id}`} className="btn btn-secondary btn-sm me-2">
                      View
                    </Link>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(lead._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {results.length === 0 && <p>No results found.</p>}
    </div>
  );
}

export default SearchLeads;
