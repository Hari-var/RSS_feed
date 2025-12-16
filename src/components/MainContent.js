import React, { useState, useEffect } from 'react';
import PostGrid from './PostGrid';
import SelectedFooter from './SelectedFooter';
import EventForm from './EventForm';
import EventGrid from './EventGrid';
import './MainContent.css';

const MainContent = ({ activeSection, sidebarCollapsed, setActiveSection }) => {
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postsError, setPostsError] = useState(false);
  const [eventsError, setEventsError] = useState(false);
  const [sending, setSending] = useState(false);
  const [isStructuredView, setIsStructuredView] = useState(() => {
    return localStorage.getItem('isStructuredView') === 'true';
  });
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const fetchRSSData = async () => {
      const timeout = setTimeout(() => {
        setLoading(false);
        setMessage({ type: 'error', text: 'Request timeout. Please try again.' });
      }, 30000);

      try {
        const postsResponse = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/rss-updates');
        const eventsResponse = await fetch('https://rss-feed-backend-e6gvd8bnfugscucb.canadacentral-01.azurewebsites.net/events');
        
        if (!postsResponse.ok) {
          setPostsError(true);
        } else {
          const postsData = await postsResponse.json();
          const formattedPosts = postsData.updates.map(update => ({
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
        
        if (!eventsResponse.ok) {
          setEventsError(true);
        } else {
          const eventsData = await eventsResponse.json();
          setEvents(eventsData.events);
        }
        
        clearTimeout(timeout);
      } catch (error) {
        setPostsError(true);
        setEventsError(true);
        clearTimeout(timeout);
      } finally {
        setLoading(false);
      }
    };

    fetchRSSData();
  }, []);

  const handleSendEmail = async () => {
    setSending(true);
    const selectedPostsData = posts.filter(post => selectedPosts.includes(post.id));
    const selectedEventsData = events.filter(event => selectedEvents.includes(event.id));
    
    const payload = {
      posts: selectedPostsData.map(post => ({
        id: post.id,
        title: post.title,
        description: post.description,
        image_url: post.image_url,
        link: post.blog_url,
        source: post.source,
        published: post.published_at
      })),
      events: selectedEventsData.map(event => ({
        id: event.id,
        event_name: event.event_name,
        presenter: event.presenter,
        event_type: event.event_type,
        date_time: event.date_time,
        invite_location: event.invite_location,
        invite_link: event.invite_link,
        event_images: event.event_images,
        presenter_images: event.presenter_images
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
        setSelectedEvents([]);
        setSelectedItems([]);
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

  const handleAddEvent = (eventData) => {
    setEvents(prev => [...prev, eventData]);
    setMessage({ type: 'success', text: 'Event added successfully!' });
    setTimeout(() => setMessage(null), 3000);
  };

  const updateSelectedItems = (type, ids) => {
    const items = type === 'posts' ? posts : events;
    const selectedFromType = items.filter(item => ids.includes(item.id)).map(item => ({...item, type}));
    const otherType = type === 'posts' ? 'events' : 'posts';
    const otherItems = selectedItems.filter(item => item.type === otherType);
    setSelectedItems([...otherItems, ...selectedFromType]);
  };

  const handleRemoveItem = (id) => {
    const item = selectedItems.find(item => item.id === id);
    if (item?.type === 'posts') {
      setSelectedPosts(prev => prev.filter(postId => postId !== id));
    } else {
      setSelectedEvents(prev => prev.filter(eventId => eventId !== id));
    }
    setSelectedItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={`main-content ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="header-section">
        <h1>TSC Weekly Byte - {activeSection === 'posts' ? 'Posts' : activeSection === 'events' ? 'Events' : 'Add Events'}</h1>
        {(activeSection === 'posts' || activeSection === 'events') && (
          <div className="view-switch">
            <span className={`switch-label ${!isStructuredView ? 'active' : ''}`}>Overlay</span>
            <div className="switch-container" onClick={() => {
              const newView = !isStructuredView;
              setIsStructuredView(newView);
              localStorage.setItem('isStructuredView', newView.toString());
            }}>
              <div className={`switch-slider ${isStructuredView ? 'active' : ''}`}></div>
            </div>
            <span className={`switch-label ${isStructuredView ? 'active' : ''}`}>Structured</span>
          </div>
        )}
      </div>
      {message && <div className={`message ${message.type}`}>{message.text}</div>}
      {activeSection === 'posts' && postsError && (
        <div className="message error">Failed to load posts</div>
      )}
      {activeSection === 'events' && eventsError && (
        <div className="message error">Failed to load events</div>
      )}
      {activeSection === 'posts' ? (
        loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading posts...</p>
          </div>
        ) : (
          <PostGrid selectedPosts={selectedPosts} setSelectedPosts={(updater) => {
            const newIds = typeof updater === 'function' ? updater(selectedPosts) : updater;
            setSelectedPosts(newIds);
            updateSelectedItems('posts', newIds);
          }} posts={posts} isStructuredView={isStructuredView} />
        )
      ) : activeSection === 'add-events' ? (
        <EventForm 
          onAddEvent={handleAddEvent} 
          onNavigateToEvents={() => setActiveSection('events')}
        />
      ) : (
        loading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading events...</p>
          </div>
        ) : (
          <EventGrid events={events} isStructuredView={isStructuredView} selectedEvents={selectedEvents} setSelectedEvents={(updater) => {
            const newIds = typeof updater === 'function' ? updater(selectedEvents) : updater;
            setSelectedEvents(newIds);
            updateSelectedItems('events', newIds);
          }} />
        )
      )}

      {selectedItems.length > 0 && (
        <SelectedFooter 
          selectedPosts={selectedItems.map(item => item.id)}
          onRemovePost={handleRemoveItem}
          onSendEmail={handleSendEmail}
          sidebarCollapsed={sidebarCollapsed}
          posts={selectedItems}
          sending={sending}
        />
      )}
    </div>
  );
};

export default MainContent;