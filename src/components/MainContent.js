import React, { useState, useEffect } from 'react';
import PostGrid from './PostGrid';
import SelectedFooter from './SelectedFooter';
import './MainContent.css';
import rssData from '../data/RSS_feed.json';

const MainContent = ({ activeSection, sidebarCollapsed }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState(rssData);

  useEffect(() => {
    const fetchRSSData = async () => {
      try {
        const response = await fetch('http://localhost:8000/rss-updates');
        if (response.ok) {
          const data = await response.json();
          const formattedPosts = data.updates.map(update => ({
            id: update.id,
            title: update.title,
            description: update.description,
            image_url: update.image_url,
            blog_url: update.link,
            source: update.source,
            published_at: update.published
          }));
          setPosts(formattedPosts);
        }
      } catch (error) {
        console.log('Using fallback data:', error);
      }
    };

    fetchRSSData();
  }, []);

  const handleSendEmail = () => {
    console.log('Sending email with selected posts:', selectedPosts);
    // Email functionality would go here
  };

  return (
    <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <h1>TSC Weekly Byte - {activeSection === 'posts' ? 'Posts' : 'Events'}</h1>
      {activeSection === 'posts' ? (
        <PostGrid selectedPosts={selectedPosts} setSelectedPosts={setSelectedPosts} posts={posts} />
      ) : (
        <div className="content-area">
          <p>Upcoming events will appear here...</p>
        </div>
      )}
      {activeSection === 'posts' && (
        <SelectedFooter 
          selectedPosts={selectedPosts}
          onRemovePost={(id) => setSelectedPosts(prev => prev.filter(postId => postId !== id))}
          onSendEmail={handleSendEmail}
          sidebarCollapsed={sidebarCollapsed}
          posts={posts}
        />
      )}
    </div>
  );
};

export default MainContent;