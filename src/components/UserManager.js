import React, { useState, useEffect } from 'react';
import './UserManager.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'user' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async () => {
    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        const user = await response.json();
        setUsers(prev => [...prev, user]);
        setNewUser({ username: '', password: '', role: 'user' });
        setMessage({ type: 'success', text: 'User added successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding user' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUsers(prev => prev.filter(u => u.id !== userId));
        setMessage({ type: 'success', text: 'User deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete user' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting user' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading users...</p>
      </div>
    );
  }

  return (
    <div className="user-manager">
      <div className="manager-header">
        <h2>User Management</h2>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="add-user-section">
        <h3>Add New User</h3>
        <div className="add-user-form">
          <input
            type="text"
            placeholder="Username"
            value={newUser.username}
            onChange={(e) => setNewUser(prev => ({...prev, username: e.target.value}))}
          />
          <input
            type="password"
            placeholder="Password"
            value={newUser.password}
            onChange={(e) => setNewUser(prev => ({...prev, password: e.target.value}))}
          />
          <select
            value={newUser.role}
            onChange={(e) => setNewUser(prev => ({...prev, role: e.target.value}))}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={handleAddUser} disabled={!newUser.username || !newUser.password}>
            Add User
          </button>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDeleteUser(user.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManager;