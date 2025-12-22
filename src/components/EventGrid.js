import React, { useState } from 'react';
import './PostGrid.css';

const EventGrid = ({ events, isStructuredView, selectedEvents, setSelectedEvents }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };
  const toggleEvent = (id) => {
    setSelectedEvents(prev => 
      prev.includes(id) 
        ? prev.filter(eventId => eventId !== id)
        : [...prev, id]
    );
  };

  // Debug logging
  console.log('EventGrid Debug - Events:', events);
  events.forEach(event => {
    console.log(`Event ${event.id} image path:`, event.event_images);
    console.log(`Full URL would be:`, event.event_images ? `url(${event.event_images})` : 'url(/img13.jpg)');
    
    // Test if URL is accessible
    if (event.event_images) {
      const testImg = new Image();
      testImg.onload = () => console.log(`✅ Image loaded successfully: ${event.event_images}`);
      testImg.onerror = () => console.log(`❌ Image failed to load: ${event.event_images}`);
      testImg.src = event.event_images;
    }
  });

  if (events.length === 0) {
    return (
      <div className="no-events-container">
        <div className="no-events-content">
          <div className="no-events-icon">📅</div>
          <h3>No Events Yet</h3>
          <p>Start by creating your first event to see it appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`post-grid ${isStructuredView ? 'structured' : ''}`}>
        {events.map(event => {
          return (
          <div key={event.id} className={`post-card ${isStructuredView ? 'structured' : ''}`} onClick={() => handleEventClick(event)}>
            {isStructuredView ? (
              <>
                <div 
                  className="post-image-structured"
                  style={{
                    backgroundImage: event.event_images ? `url("${event.event_images}")` : undefined
                  }}
                  onClick={() => handleEventClick(event)}
                >
                  {!event.event_images && (
                    <div className="fallback-content">
                      <div className="tech-pattern">
                        <div className="code-lines">
                          <span>const event = {'{'}</span>
                          <span>  name: "{event.event_name ? event.event_name.substring(0, 20) : 'Event'}...",</span>
                          <span>  presenter: "{event.presenter || 'TBD'}",</span>
                          <span>{'};'}</span>
                        </div>
                      </div>
                      <div className="source-badge">{event.event_type}</div>
                    </div>
                  )}
                  {event.presenter_images && (
                    <div className="presenter-avatar">
                      <img src={event.presenter_images} alt={event.presenter} />
                    </div>
                  )}
                  <input 
                    type="checkbox" 
                    className="post-checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEvent(event.id)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
                <div className="post-content">
                  <h4 className="post-title">{event.event_name}</h4>
                  <p className="post-description">by {event.presenter}</p>
                  <div className="post-meta">
                    <span className="source-info">{event.event_type}</span>
                    <span className="published-date">{new Date(event.date_time).toLocaleDateString()}</span>
                  </div>
                </div>
              </>
            ) : (
              <div 
                className="post-image"
                style={{
                  backgroundImage: event.event_images ? `url("${event.event_images}")` : undefined
                }}
                onClick={() => handleEventClick(event)}
              >
                {!event.event_images && (
                  <div className="fallback-content">
                    <div className="tech-pattern">
                      <div className="code-lines">
                        <span>const event = {'{'}</span>
                        <span>  name: "{event.event_name ? event.event_name.substring(0, 20) : 'Event'}...",</span>
                        <span>  presenter: "{event.presenter || 'TBD'}",</span>
                        <span>{'};'}</span>
                      </div>
                    </div>
                    <div className="source-badge">{event.event_type}</div>
                  </div>
                )}
                {event.presenter_images && (
                  <div className="presenter-avatar-overlay">
                    <img src={event.presenter_images} alt={event.presenter} />
                  </div>
                )}
                <div className="post-overlay">
                  <h4 className="post-title">{event.event_name}</h4>
                  <p className="post-description">by {event.presenter}</p>
                  <div className="post-meta">
                    <span className="source-info">{event.event_type}</span>
                    {event.date_time && (
                      <span className="published-date">{new Date(event.date_time).toLocaleDateString()}</span>
                    )}
                  </div>
                  {event.invite_location && (
                    <div className="event-location">{event.invite_location}</div>
                  )}
                </div>
                <input 
                  type="checkbox" 
                  className="post-checkbox"
                  checked={selectedEvents.includes(event.id)}
                  onChange={() => toggleEvent(event.id)}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            )}
          </div>
          );
        })}
      </div>
      
      {showModal && selectedEvent && (
        <div className="event-modal-backdrop" onClick={closeModal}>
          <div className="event-modal" onClick={e => e.stopPropagation()}>
            <button className="event-modal-close" onClick={closeModal}>×</button>
            
            <div className="event-modal-header">
              <h1>{selectedEvent.event_name}</h1>
              {selectedEvent.event_type && (
                <span className="event-type-badge">{selectedEvent.event_type}</span>
              )}
            </div>
            
            {selectedEvent.event_images && (
              <div className="event-modal-image">
                <img src={selectedEvent.event_images} alt={selectedEvent.event_name} />
              </div>
            )}
            
            <div className="event-modal-content">
              {selectedEvent.presenter && (
                <div className="event-field">
                  <strong>Presenter:</strong> {selectedEvent.presenter}
                </div>
              )}
              {selectedEvent.date_time && (
                <div className="event-field">
                  <strong>Date & Time:</strong> {new Date(selectedEvent.date_time).toLocaleString()}
                </div>
              )}
              {selectedEvent.invite_location && (
                <div className="event-field">
                  <strong>Location:</strong> {selectedEvent.invite_location}
                </div>
              )}
              {selectedEvent.invite_link && (
                <div className="event-field">
                  <strong>Link:</strong> 
                  <a href={selectedEvent.invite_link} target="_blank" rel="noopener noreferrer">
                    Open Event
                  </a>
                </div>
              )}
              {selectedEvent.description && (
                <div className="event-field description">
                  <strong>Description:</strong>
                  <p>{selectedEvent.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventGrid;