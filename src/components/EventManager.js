import React, { useState } from 'react';
import './EventManager.css';

const EventManager = ({ events, setEvents, loading, onRefresh }) => {
  const [editingEvent, setEditingEvent] = useState(null);
  const [message, setMessage] = useState(null);

  const handleEdit = (event) => {
    setEditingEvent({
      ...event,
      date_time: event.date_time ? new Date(event.date_time).toISOString().slice(0, 16) : ''
    });
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/events/${editingEvent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editingEvent,
          date_time: editingEvent.date_time ? new Date(editingEvent.date_time).toISOString() : null
        })
      });

      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? updatedEvent : e));
        setEditingEvent(null);
        setMessage({ type: 'success', text: 'Event updated successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to update event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating event' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const response = await fetch(`https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/events/${eventId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        setMessage({ type: 'success', text: 'Event deleted successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to delete event' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Error deleting event' });
    }
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading events...</p>
      </div>
    );
  }

  return (
    <div className="event-manager">
      <div className="manager-header">
        <h2>Event Management</h2>
        <button className="refresh-btn" onClick={onRefresh}>
          Refresh
        </button>
      </div>

      {message && <div className={`message ${message.type}`}>{message.text}</div>}

      <div className="events-table">
        <table>
          <thead>
            <tr>
              <th>Event Name</th>
              <th>Presenter</th>
              <th>Type</th>
              <th>Date & Time</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map(event => (
              <tr key={event.id}>
                <td>{event.event_name}</td>
                <td>{event.presenter}</td>
                <td>{event.event_type}</td>
                <td>{event.date_time ? new Date(event.date_time).toLocaleString() : 'Not set'}</td>
                <td>{event.invite_location}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(event)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => handleDelete(event.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingEvent && (
        <div className="edit-modal">
          <div className="modal-content">
            <h3>Edit Event</h3>
            <div className="form-group">
              <label>Event Name:</label>
              <input
                type="text"
                value={editingEvent.event_name}
                onChange={(e) => setEditingEvent(prev => ({...prev, event_name: e.target.value}))}
              />
            </div>
            <div className="form-group">
              <label>Presenter:</label>
              <input
                type="text"
                value={editingEvent.presenter}
                onChange={(e) => setEditingEvent(prev => ({...prev, presenter: e.target.value}))}
              />
            </div>
            <div className="form-group">
              <label>Event Type:</label>
              <select
                value={editingEvent.event_type}
                onChange={(e) => setEditingEvent(prev => ({...prev, event_type: e.target.value}))}
              >
                <option value="Code Club">Code Club</option>
                <option value="LearniX Bootcamp">LearniX Bootcamp</option>
              </select>
            </div>
            <div className="form-group">
              <label>Date & Time:</label>
              <input
                type="datetime-local"
                value={editingEvent.date_time}
                onChange={(e) => setEditingEvent(prev => ({...prev, date_time: e.target.value}))}
              />
            </div>
            <div className="form-group">
              <label>Location:</label>
              <select
                value={editingEvent.invite_location}
                onChange={(e) => setEditingEvent(prev => ({...prev, invite_location: e.target.value}))}
              >
                <option value="Palnadu">Palnadu</option>
                <option value="Mantri">Mantri</option>
                <option value="VAM Towers">VAM Towers</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>
            <div className="form-group">
              <label>Invite Link:</label>
              <input
                type="url"
                value={editingEvent.invite_link || ''}
                onChange={(e) => setEditingEvent(prev => ({...prev, invite_link: e.target.value}))}
              />
            </div>
            <div className="modal-actions">
              <button className="save-btn" onClick={handleSave}>Save</button>
              <button className="cancel-btn" onClick={() => setEditingEvent(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;