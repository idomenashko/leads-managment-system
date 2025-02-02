// frontend/src/components/AllLeads.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AllLeads() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchAllLeads();
  }, []);

  const fetchAllLeads = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/leads/all');
      setLeads(res.data);
    } catch (error) {
      console.error('Error fetching all leads:', error);
      alert('Failed to fetch leads');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/leads/${id}`);
      setLeads(prev => prev.filter(lead => lead._id !== id));
    } catch (error) {
      console.error('Error deleting lead:', error);
      alert('Failed to delete lead');
    }
  };

  return (
    <div>
      <h2 className="mb-4">All Leads</h2>
      {leads.length === 0 ? (
        <p>No leads found.</p>
      ) : (
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
            {leads.map(lead => {
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
                    <Link to={`/leads/${lead._id}`} className="btn btn-primary btn-sm me-2">
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
    </div>
  );
}

export default AllLeads;
