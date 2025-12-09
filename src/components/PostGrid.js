import React, { useState } from 'react';
import BlogModal from './BlogModal';
import './PostGrid.css';

const PostGrid = ({ selectedPosts, setSelectedPosts, posts }) => {
  const [modalPost, setModalPost] = useState(null);

  const truncateDescription = (text) => {
    const words = text.split(' ');
    if (words.length <= 30) return text;
    return words.slice(0, 30).join(' ') + '...';
  };

  const togglePost = (id) => {
    setSelectedPosts(prev => 
      prev.includes(id) 
        ? prev.filter(postId => postId !== id)
        : [...prev, id]
    );
  };

  const openModal = (post) => {
    setModalPost(post);
  };

  const closeModal = () => {
    setModalPost(null);
  };

  return (
    <>
      <div className="post-grid">
        {posts.map(post => (
          <div key={post.id} className="post-card">
            <div 
              className="post-image" 
              onClick={() => openModal(post)}
              style={{
                backgroundImage: post.image_url ? `url(${post.image_url})` : 'none',
                backgroundColor: post.image_url ? 'transparent' : '#f5f5f5'
              }}
            >
              <input 
                type="checkbox" 
                className="post-checkbox"
                checked={selectedPosts.includes(post.id)}
                onChange={() => togglePost(post.id)}
                onClick={e => e.stopPropagation()}
              />
              <div className="content-overlay">
                <h4>{post.title}</h4>
                <p>{truncateDescription(post.description)}</p>
                <div className="post-meta">
                  <span className="source-info">{post.source || 'NVIDIA Blog'}</span>
                  <span className="published-date">{new Date(post.published_at || post.published).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <BlogModal 
        post={modalPost}
        isOpen={!!modalPost}
        onClose={closeModal}
        isSelected={modalPost && selectedPosts.includes(modalPost.id)}
        onToggleSelect={() => modalPost && togglePost(modalPost.id)}
      />
    </>
  );
};

export default PostGrid;