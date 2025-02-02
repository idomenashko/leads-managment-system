// frontend/src/components/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Lead Management</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {token && (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><Link className="nav-link" to="/">Dashboard</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/new-lead">New Lead</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/technicians">Technicians</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/payment-methods">Payment Methods</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/reports">Reports</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/search">Search Leads</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/all-leads">All Leads</Link></li>

              {role === 'admin' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/users-admin">Manage Users</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/job-types">Job Types</Link>
                  </li>
                </>
              )}

              <li className="nav-item">
                <button className="btn btn-secondary nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
