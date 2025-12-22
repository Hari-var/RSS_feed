import React, { useState, useEffect } from 'react';
import './PostManager.css';

const PostManager = () => {
  const [sources, setSources] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [editingSource, setEditingSource] = useState(null);
  const [newSource, setNewSource] = useState({ name: '', url: '' });

  useEffect(() => {
    fetchSources();
  }, []);

  const fetchSources = async () => {
    try {
      const response = await fetch('http://localhost:8000/sources/');
      console.log('Response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched sources:', data);
        setSources(data.sources || {});
      } else {
        console.error('Failed to fetch sources, status:', response.status);
        setSources({});
      }
    } catch (error) {
      console.error('Failed to fetch sources:', error);
      setSources({});
    } finally {
      setLoading(false);
    }
  };

  const handleAddSource = async () => {
    if (!newSource.name || !newSource.url) return;

    try {
      const response = await fetch('http://localhost:8000/sources/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSource.name, url: newSource.url })
      });

      if (response.ok) {
        setSources(prev => ({ ...prev, [newSource.name]: newSource.url }));
        setNewSource({ name: '', url: '' });
        setMessage({ type: 'success', text: 'Source added successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to add source' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error adding source' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleEditSource = (name, url) => {
    setEditingSource({ oldName: name, name, url });
  };

  const handleUpdateSource = async () => {
  try {
    const response = await fetch(`http://localhost:8000/sources/${editingSource.oldName}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        name: editingSource.name, 
        url: editingSource.url 
      })
    });

    if (response.ok) {
      const newSources = { ...sources };
      delete newSources[editingSource.oldName];
      newSources[editingSource.name] = editingSource.url;
      setSources(newSources);
      setEditingSource(null);
      setMessage({ type: 'success', text: 'Source updated successfully!' });
    } else {
      setMessage({ type: 'error', text: 'Failed to update source' });
    }
  } catch (error) {
    setMessage({ type: 'error', text: 'Error updating source' });
  }
  setTimeout(() => setMessage(null), 3000);
};


  const handleDeleteSource = async (name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`http://localhost:8000/sources/${name}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const newSources = { ...sources };
        delete newSources[name];
        setSources(newSources);
        setMessage({ type: 'success', text: 'Source deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete source' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting source' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading sources...</p>
      </div>
    );
  }

  return (
    <div className="post-manager">
      <div className="manager-header">
        <h2>RSS Source Management</h2>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="add-source-section">
        <h3>Add New Source</h3>
        <div className="add-source-form">
          <input
            type="text"
            placeholder="Source Name"
            value={newSource.name}
            onChange={(e) => setNewSource(prev => ({...prev, name: e.target.value}))}
          />
          <input
            type="url"
            placeholder="RSS Feed URL"
            value={newSource.url}
            onChange={(e) => setNewSource(prev => ({...prev, url: e.target.value}))}
          />
          <button onClick={handleAddSource} disabled={!newSource.name || !newSource.url}>
            Add Source
          </button>
        </div>
      </div>

      <div className="sources-table">
        <p>Sources count: {Object.keys(sources).length}</p>
        <table>
          <thead>
            <tr>
              <th>Source Name</th>
              <th>RSS Feed URL</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sources && typeof sources === 'object' && Object.entries(sources).map(([name, url]) => (
              <tr key={name}>
                <td>{String(name)}</td>
                <td>
                  <a href={String(url)} target="_blank" rel="noopener noreferrer">
                    {String(url)}
                  </a>
                </td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditSource(name, url)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteSource(name)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingSource && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit Source</h3>
            <div className="form-group">
              <label>Source Name:</label>
              <input
                type="text"
                value={editingSource.name}
                onChange={(e) => setEditingSource(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="form-group">
              <label>RSS Feed URL:</label>
              <input
                type="url"
                value={editingSource.url}
                onChange={(e) => setEditingSource(prev => ({...prev, url: e.target.value}))}
              />
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleUpdateSource}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingSource(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostManager;