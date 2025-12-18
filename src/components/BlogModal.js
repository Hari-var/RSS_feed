import React, { useState, useEffect } from 'react';
import './BlogModal.css';

const BlogModal = ({ post, isOpen, onClose, isSelected, onToggleSelect }) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [iframeError, setIframeError] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  useEffect(() => {
    if (isOpen && post) {
      setIframeError(false);
      setShowFallback(false);
      
      // Auto-redirect problematic domains
      const problematicDomains = ['infoq.com', 'machinelearning.apple.com', 'apple.com', 'technologyreview.com','mckinsey.com'];
      const isProblematic = problematicDomains.some(domain => post.blog_url.includes(domain));
      
      if (isProblematic) {
        setTimeout(() => {
          window.open(post.blog_url, '_blank');
          onClose();
        }, 100);
        return;
      }
      
      // Show fallback after 5 seconds if iframe doesn't load
      const timer = setTimeout(() => {
        setShowFallback(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, post, onClose]);

  if (!isOpen || !post) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={`modal-content ${isMaximized ? 'maximized' : ''}`} onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <button className="maximize-btn" onClick={() => setIsMaximized(!isMaximized)} title={isMaximized ? "Restore" : "Maximize"}>
          {isMaximized ? '🗗' : '🗖'}
        </button>
        {/* <div className="modal-header">
          <input 
            type="checkbox" 
            className="modal-checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            title="Select this post"
          />
        </div> */}
        {!iframeError ? (
          <div className="iframe-container">
            <iframe 
              src={post.blog_url} 
              className="blog-iframe"
              title={post.title}
              onLoad={() => setShowFallback(false)}
            />
            {showFallback && (
              <div className="fallback-overlay">
                <p>Having trouble loading? </p>
                <a href={post.blog_url} target="_blank" rel="noopener noreferrer" className="fallback-btn">
                  Open in New Tab
                </a>
              </div>
            )}
          </div>
        ) : (
          <div className="iframe-fallback">
            <h2>Content Blocked</h2>
            <p>This content cannot be displayed in an embedded frame.</p>
            <a href={post.blog_url} target="_blank" rel="noopener noreferrer" className="external-link">
              Open in New Tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogModal;