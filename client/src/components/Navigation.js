import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Components.css';
import { apiUrl } from '../services/api';

const Navigation = ({ user }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [newNotificationCount, setNewNotificationCount] = useState(0);

  const refreshNotificationBadge = async () => {
    try {
      const response = await fetch(apiUrl('/api/notifications'));
      const data = await response.json();
      if (!response.ok || !Array.isArray(data)) return;

      const latestSeen = localStorage.getItem('notifications_last_seen_at');
      if (!latestSeen) {
        setNewNotificationCount(0);
        return;
      }

      const latestSeenMs = new Date(latestSeen).getTime();
      const count = data.filter((item) => new Date(item.createdAt).getTime() > latestSeenMs).length;
      setNewNotificationCount(count);
    } catch (err) {
      // Ignore badge polling errors silently.
    }
  };

  useEffect(() => {
    const initializeSeenState = async () => {
      const seen = localStorage.getItem('notifications_last_seen_at');
      if (seen) {
        refreshNotificationBadge();
        return;
      }

      try {
        const response = await fetch(apiUrl('/api/notifications'));
        const data = await response.json();
        if (response.ok && Array.isArray(data) && data.length > 0) {
          localStorage.setItem('notifications_last_seen_at', data[0].createdAt);
        }
      } catch (err) {
        // Ignore initialization errors.
      }
    };

    initializeSeenState();

    const intervalId = setInterval(refreshNotificationBadge, 30000);
    const syncBadge = () => refreshNotificationBadge();
    window.addEventListener('notificationsSeenUpdated', syncBadge);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('notificationsSeenUpdated', syncBadge);
    };
  }, []);

  const navigateAndClose = (path) => {
    if (path === '/notifications') {
      localStorage.setItem('notifications_last_seen_at', new Date().toISOString());
      setNewNotificationCount(0);
      window.dispatchEvent(new Event('notificationsSeenUpdated'));
    }
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navigation">
      <div className="nav-left">
        <h2 className="logo">Textile 2k24</h2>
      </div>

      <button
        className="hamburger-btn"
        onClick={() => setIsMenuOpen((prev) => !prev)}
        aria-label="Toggle menu"
        aria-expanded={isMenuOpen}
      >
        <i className={`bi ${isMenuOpen ? 'bi-x-lg' : 'bi-list'}`} aria-hidden="true"></i>
      </button>

      <div className={`nav-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="nav-center">
          <button onClick={() => navigateAndClose('/')} className="nav-btn icon-btn" title="Home" aria-label="Home">
            <i className="bi bi-house-door-fill" aria-hidden="true"></i>
          </button>
          <button onClick={() => navigateAndClose('/search')} className="nav-btn icon-btn" title="Search" aria-label="Search">
            <i className="bi bi-search" aria-hidden="true"></i>
          </button>
          <button onClick={() => navigateAndClose('/notifications')} className="nav-btn icon-btn with-badge" title="Notifications" aria-label="Notifications">
            <i className="bi bi-bell-fill" aria-hidden="true"></i>
            {newNotificationCount > 0 && <span className="notification-badge">{newNotificationCount > 9 ? '9+' : newNotificationCount}</span>}
          </button>
          <button onClick={() => navigateAndClose('/qa')} className="nav-btn icon-btn" title="Q&A" aria-label="Q&A">
            <i className="bi bi-chat-left-dots-fill" aria-hidden="true"></i>
          </button>
          <a
            href="https://t.me/te24bot"
            target="_blank"
            rel="noreferrer"
            className="nav-btn icon-btn telegram-btn"
            title="Telegram Bot"
            aria-label="Telegram Bot"
          >
            <i className="bi bi-telegram" aria-hidden="true"></i>
          </a>
          {user?.isAdmin && (
            <button onClick={() => navigateAndClose('/admin')} className="nav-btn admin icon-btn" title="Admin" aria-label="Admin">
              <i className="bi bi-shield-lock-fill" aria-hidden="true"></i>
            </button>
          )}
        </div>

        <div className="nav-right">
          {user ? (
            <div className="user-profile">
              <p>{user?.name}</p>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          ) : (
            <div className="guest-actions">
              <button onClick={() => navigateAndClose('/login')} className="login-btn">Login</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
