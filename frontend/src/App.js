// frontend/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import NewLead from './components/NewLead';
import LeadDetails from './components/LeadDetails';
import Technicians from './components/Technicians';
import PaymentMethods from './components/PaymentMethods';
import Reports from './components/Reports';
import SearchLeads from './components/SearchLeads';
import AllLeads from './components/AllLeads';
import UsersAdmin from './components/UsersAdmin';
import JobTypes from './components/JobTypes';

function App() {
  return (
    <Router>
      <Routes>
        {/* מסך התחברות פתוח לכולם */}
        <Route path="/login" element={<Login />} />

        {/* שאר האתר מוגן */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <ProtectedLayout />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new-lead" element={<NewLead />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/technicians" element={<Technicians />} />
          <Route path="/payment-methods" element={<PaymentMethods />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/search" element={<SearchLeads />} />
          <Route path="/all-leads" element={<AllLeads />} />
          <Route path="/users-admin" element={<UsersAdmin />} />
          <Route path="/job-types" element={<JobTypes />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
