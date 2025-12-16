import React, { useState } from 'react';
import './DateTimePicker.css';

const DateTimePicker = ({ value, onChange, min }) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : new Date());
  const [hours, setHours] = useState(value ? new Date(value).getHours() : new Date().getHours());
  const [minutes, setMinutes] = useState(value ? new Date(value).getMinutes() : new Date().getMinutes());

  const formatDateTime = (date, h, m) => {
    const formatted = new Date(date);
    formatted.setHours(h, m);
    return formatted.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleConfirm = () => {
    if (!selectedDate || isNaN(selectedDate.getTime())) {
      alert('Please select a valid date');
      return;
    }
    const newDateTime = new Date(selectedDate);
    newDateTime.setHours(hours, minutes);
    onChange(newDateTime.toISOString().slice(0, 16));
    setShowPicker(false);
  };



  return (
    <div className="datetime-picker">
      <div className="datetime-display" onClick={() => setShowPicker(true)}>
        <div className="datetime-value">
          {value ? formatDateTime(selectedDate, hours, minutes) : 'Select date and time'}
        </div>
        <div className="datetime-icon">🕐</div>
      </div>
      
      {showPicker && (
        <div className="datetime-modal">
          <div className="datetime-content">
            <div className="picker-header">
              <h3>Set date & time</h3>
            </div>
            
            <div className="date-section">
              <input
                type="date"
                value={selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                min={min ? new Date(min).toISOString().split('T')[0] : undefined}
                className="date-input"
              />
            </div>

            <div className="time-section">
              <div className="time-display">
                <span className="time-text">{String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}</span>
              </div>
              
              <div className="time-pickers">
                <div className="time-picker">
                  <label>Hour</label>
                  <div className="picker-wheel">
                    {Array.from({length: 24}, (_, i) => (
                      <div
                        key={i}
                        className={`picker-item ${hours === i ? 'selected' : ''}`}
                        onClick={() => setHours(i)}
                      >
                        {String(i).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="time-picker">
                  <label>Minute</label>
                  <div className="picker-wheel">
                    {Array.from({length: 4}, (_, i) => i * 15).map(minute => (
                      <div
                        key={minute}
                        className={`picker-item ${minutes === minute ? 'selected' : ''}`}
                        onClick={() => setMinutes(minute)}
                      >
                        {String(minute).padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="picker-actions">
              <button className="cancel-btn" onClick={() => setShowPicker(false)}>Cancel</button>
              <button className="confirm-btn" onClick={handleConfirm}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;