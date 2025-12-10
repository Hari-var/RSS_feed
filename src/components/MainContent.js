import React, { useState, useEffect } from 'react';
import PostGrid from './PostGrid';
import SelectedFooter from './SelectedFooter';
import './MainContent.css';

const MainContent = ({ activeSection, sidebarCollapsed }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const fetchRSSData = async () => {
      const timeout = setTimeout(() => {
        setLoading(false);
        setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
      }, 30000);

      try {
        const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/rss-updates');
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
        clearTimeout(timeout);
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to load posts' });
        clearTimeout(timeout);
      } finally {
        setLoading(false);
      }
    };

    fetchRSSData();
  }, []);

  const handleSendEmail = async () => {
    setSending(true);
    const selectedData = posts.filter(post => selectedPosts.includes(post.id));
    const payload = {
      posts: selectedData.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        image_url: post.image_url,
        link: post.blog_url,
        source: post.source,
        published: post.published_at
      }))
    };

    const timeout = setTimeout(() => {
      setSending(false);
      setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
      setTimeout(() => setMessage(null), 3000);
    }, 30000);

    try {
      const response = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      clearTimeout(timeout);
      if (response.ok) {
        setMessage({ type: 'success', text: 'Newsletter sent successfully!' });
        setSelectedPosts([]);
      } else {
        setMessage({ type: 'error', text: 'Failed to send newsletter' });
      }
    } catch (error) {
      clearTimeout(timeout);
      setMessage({ type: 'error', text: 'Error sending newsletter' });
    } finally {
      setSending(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <h1>TSC Weekly Byte - {activeSection === 'posts' ? 'Posts' : 'Events'}</h1>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading posts...</p>
        </div>
      ) : activeSection === 'posts' ? (
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
          sending={sending}
        />
      )}
    </div>
  );
};

export default MainContent;