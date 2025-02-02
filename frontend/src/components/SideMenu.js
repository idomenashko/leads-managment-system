// frontend/src/components/SideMenu.js
import React from 'react';
import { Link } from 'react-router-dom';

function SideMenu() {
  return (
    <div className="bg-blue-900 text-white w-64 p-6 flex flex-col gap-4">
      <h2 className="text-xl font-bold border-b border-white pb-2">
        Lead Management
      </h2>
      <Link className="hover:bg-blue-700 p-2 rounded" to="/">Dashboard</Link>
      <Link className="hover:bg-blue-700 p-2 rounded" to="/new-lead">New Lead</Link>
      <Link className="hover:bg-blue-700 p-2 rounded" to="/reports">Reports</Link>
      <Link className="hover:bg-blue-700 p-2 rounded" to="/technicians">Technicians</Link>
    </div>
  );
}

export default SideMenu;
