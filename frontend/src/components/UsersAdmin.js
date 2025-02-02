// frontend/src/components/UsersAdmin.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UsersAdmin() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    email: '',
    password: '',
    role: 'user'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const token = localStorage.getItem('token');
  const headers = { Authorization: 'Bearer ' + token };

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/users', { headers });
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    }
  };

  const handleChange = e => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddUser = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/users/register', form, { headers });
      alert('User created');
      setForm({ email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    }
  };

  const handleDelete = async userId => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`http://localhost:5001/api/users/${userId}`, { headers });
      alert('User deleted');
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div>
      <h2 className="mb-4">Users Admin (Admin Only)</h2>

      <form onSubmit={handleAddUser} className="row g-3 mb-4" style={{ maxWidth: 500 }}>
        <div className="col-md-4">
          <label>Email</label>
          <input
            name="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Password</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-4">
          <label>Role</label>
          <select
            name="role"
            className="form-select"
            value={form.role}
            onChange={handleChange}
          >
            <option value="user">user</option>
            <option value="admin">admin</option>
          </select>
        </div>
        <div className="col-12">
          <button className="btn btn-primary">Add User</button>
        </div>
      </form>

      <h4>Existing Users</h4>
      {users.length === 0 ? (
        <p>No users found or you are not admin.</p>
      ) : (
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Email</th>
              <th>Role</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(u._id)}>
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

export default UsersAdmin;
