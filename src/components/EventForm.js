import React, { useState } from 'react';
import DateTimePicker from './DateTimePicker';
import './EventForm.css';

const EventForm = ({ onAddEvent, onNavigateToEvents }) => {
  const [formData, setFormData] = useState({
    event_name: '',
    presenter: '',
    event_type: '',
    date_time: '',
    invite_location: '',
    invite_link: '',
    description: '',
    event_images: null,
    presenter_images: null
  });

  const [dragActive, setDragActive] = useState({
    event: false,
    presenter: false
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDrag = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(prev => ({ ...prev, [type]: true }));
    } else if (e.type === 'dragleave') {
      setDragActive(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(prev => ({ ...prev, [type]: false }));
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0], type);
    }
  };

  const handleFileUpload = (file, type) => {
    const fieldName = type === 'event' ? 'event_images' : 'presenter_images';
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.event_name || !formData.event_images) {
      alert('Event name and event image are required');
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('event_name', formData.event_name);
      formDataToSend.append('presenter', formData.presenter);
      formDataToSend.append('event_type', formData.event_type);
      formDataToSend.append('date_time', formData.date_time);
      formDataToSend.append('invite_location', formData.invite_location);
      formDataToSend.append('invite_link', formData.invite_link);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('event_images', formData.event_images);
      if (formData.presenter_images) {
        formDataToSend.append('presenter_images', formData.presenter_images);
      }

      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/events', {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const newEvent = await response.json();
        onAddEvent(newEvent);
        setFormData({
          event_name: '',
          presenter: '',
          event_type: '',
          date_time: '',
          invite_location: '',
          invite_link: '',
          description: '',
          event_images: null,
          presenter_images: null
        });
        onNavigateToEvents();
      }
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  return (
    <div className="event-form">
      <form onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-column">
            <div className="form-group">
              <label>Event Name *</label>
              <input
                type="text"
                name="event_name"
                value={formData.event_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Presenter</label>
              <input
                type="text"
                name="presenter"
                value={formData.presenter}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Event Type</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
              >
                <option value="">Select Type</option>
                <option value="Code Club">Code Club</option>
                <option value="LearniX Bootcamp">LearniX Bootcamp</option>
              </select>
            </div>
          </div>

          <div className="form-column">
            <div className="form-group">
              <label>Date & Time</label>
              <DateTimePicker
                value={formData.date_time}
                onChange={(value) => setFormData(prev => ({ ...prev, date_time: value }))}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <select
                name="invite_location"
                value={formData.invite_location}
                onChange={handleInputChange}
              >
                <option value="">Select Location</option>
                <option value="Palnadu">Palnadu</option>
                <option value="Mantri">Mantri</option>
                <option value="VAM Towers">VAM Towers</option>
                <option value="Virtual">Virtual</option>
              </select>
            </div>

            <div className="form-group">
              <label>Event Link</label>
              <input
                type="url"
                name="invite_link"
                value={formData.invite_link}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            placeholder="Enter event description..."
          />
        </div>

        <div className="image-uploads">
          <div className="image-upload-group">
            <label>Event Image *</label>
            <div
              className={`drop-zone-small ${dragActive.event ? 'drag-over' : ''} ${formData.event_images ? 'has-image' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'event')}
              onDragLeave={(e) => handleDrag(e, 'event')}
              onDragOver={(e) => handleDrag(e, 'event')}
              onDrop={(e) => handleDrop(e, 'event')}
            >
              {formData.event_images ? (
                <div className="image-preview">
                  <img src={URL.createObjectURL(formData.event_images)} alt="Event" />
                  <div className="image-overlay">
                    <div className="image-info">Event Image</div>
                  </div>
                </div>
              ) : (
                <div className="drop-content-small">
                  <span>📷</span>
                  <p>Drag & drop event image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'event')}
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          </div>

          <div className="image-upload-group">
            <label>Presenter Image</label>
            <div
              className={`drop-zone-small ${dragActive.presenter ? 'drag-over' : ''} ${formData.presenter_images ? 'has-image' : ''}`}
              onDragEnter={(e) => handleDrag(e, 'presenter')}
              onDragLeave={(e) => handleDrag(e, 'presenter')}
              onDragOver={(e) => handleDrag(e, 'presenter')}
              onDrop={(e) => handleDrop(e, 'presenter')}
            >
              {formData.presenter_images ? (
                <div className="image-preview">
                  <img src={URL.createObjectURL(formData.presenter_images)} alt="Presenter" />
                  <div className="image-overlay">
                    <div className="image-info">Presenter Image</div>
                  </div>
                </div>
              ) : (
                <div className="drop-content-small">
                  <span>👤</span>
                  <p>Drag & drop presenter image</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0], 'presenter')}
                style={{ pointerEvents: 'auto' }}
              />
            </div>
          </div>
        </div>

        <button type="submit" className="add-event-btn">
          Add Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;