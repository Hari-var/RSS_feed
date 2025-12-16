import React, { useState } from 'react';
import './SelectedFooter.css';

const SelectedFooter = ({ selectedPosts, onRemovePost, onSendEmail, sidebarCollapsed, posts, sending }) => {
  const [imageErrors, setImageErrors] = useState({});
  const selectedData = posts.filter(post => selectedPosts.includes(post.id));

  const handleImageError = (postId) => {
    setImageErrors(prev => ({ ...prev, [postId]: true }));
  };

  if (selectedPosts.length === 0) return null;

  return (
    <div className={`selected-footer ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="selected-tiles">
        {selectedData.map(post => (
          <div key={post.id} className="selected-tile">
            <button className="remove-btn" onClick={() => onRemovePost(post.id)}>×</button>
            {!imageErrors[post.id] && (post.image_url || post.event_images) ? (
              <img 
                src={post.image_url || post.event_images} 
                alt={post.title || post.event_name}
                onError={() => handleImageError(post.id)}
              />
            ) : (
              <div className="footer-fallback">
                {post.title || post.event_name}
              </div>
            )}
            <div className="footer-title">
              <span className="scrolling-text">{post.title || post.event_name}</span>
            </div>
          </div>
        ))}
      </div>
      <button className="send-email-btn" onClick={onSendEmail} disabled={sending}>
        {sending ? 'Sending...' : 'Send Email'}
      </button>
    </div>
  );
};

export default SelectedFooter;