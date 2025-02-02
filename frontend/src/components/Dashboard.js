// frontend/src/components/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import moment from 'moment';

function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      // קבלת לידים עם status=pending (ודא populate ל-jobType, assignedTechnician)
      const res = await axios.get('http://localhost:5001/api/leads?status=pending');
      setLeads(res.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
      alert('Failed to fetch leads');
    }
  };

  // מחשב את "Time Open" בשעות כמספר בלבד
  const getTimeOpen = (lead) => {
    const start = lead.scheduledDate ? new Date(lead.scheduledDate) : new Date(lead.createdAt);
    const diffHours = moment().diff(moment(start), 'hours');
    return diffHours.toString();
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard (Pending Jobs)</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>JobRef</th>
            <th>Job Type</th>
            <th>Name</th>
            <th>Address</th>
            <th>Technician</th>
            <th>Time Open (h)</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => {
            // נשנה: נשתמש במשתנה bg שישמש לכל תא
            const bg = lead.assignedTechnician && lead.assignedTechnician.color
              ? lead.assignedTechnician.color
              : '#fff';
            return (
              <tr key={lead._id}>
                <td style={{ background: bg }}>{lead.jobRef}</td>
                <td style={{ background: bg }}>{lead.jobType ? lead.jobType.name : ''}</td>
                <td style={{ background: bg }}>{lead.name}</td>
                <td style={{ background: bg }}>{lead.address}</td>
                <td style={{ background: bg }}>{lead.assignedTechnician ? lead.assignedTechnician.name : 'None'}</td>
                <td style={{ background: bg }}>{getTimeOpen(lead)}</td>
                <td style={{ background: bg }}>
                  <Link to={`/leads/${lead._id}`} className="btn btn-primary btn-sm">
                    View
                  </Link>
                </td>
              </tr>
            );
          })}
          {leads.length === 0 && (
            <tr>
              <td colSpan="7">No pending leads found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
