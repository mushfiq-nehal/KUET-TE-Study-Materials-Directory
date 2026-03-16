import React, { useState, useEffect } from 'react';
import '../styles/Notifications.css';
import { apiUrl } from '../services/api';

const NotificationsPage = ({ user }) => {
  const [notifications, setNotifications] = useState([]);

  const syncSeenTimestamp = (items) => {
    if (!Array.isArray(items) || items.length === 0) return;
    localStorage.setItem('notifications_last_seen_at', items[0].createdAt);
    window.dispatchEvent(new Event('notificationsSeenUpdated'));
  };

  useEffect(() => {
    fetch(apiUrl('/api/notifications'))
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        syncSeenTimestamp(data);
      })
      .catch(err => console.error('Error fetching notifications:', err));
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    if (!user) return;
    try {
      const response = await fetch(apiUrl(`/api/notifications/${notificationId}/read`), {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setNotifications(notifications.map(n => n._id === notificationId ? data : n));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    if (!user?.isAdmin) return;
    if (!window.confirm('Delete this notification?')) return;

    try {
      const response = await fetch(apiUrl(`/api/notifications/${notificationId}`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Delete failed');
      }

      const updated = notifications.filter((item) => item._id !== notificationId);
      setNotifications(updated);
      syncSeenTimestamp(updated);
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  return (
    <div className="notifications-container">
      <h1>🔔 Notifications</h1>

      <div className="notifications-list">
        {notifications.map((notification) => (
          <div key={notification._id} className={`notification-item ${notification.type}`}>
            <div className="notification-header">
              <h3>{notification.title}</h3>
              <span className="notification-type">{notification.type}</span>
            </div>
            <p>{notification.message}</p>
            <div className="notification-footer">
              <small>By {notification.createdBy?.name}</small>
              <div className="notification-actions">
                {user && (
                  <button onClick={() => handleMarkAsRead(notification._id)}>
                    Mark as Read
                  </button>
                )}
                {user?.isAdmin && (
                  <button className="danger-btn" onClick={() => handleDeleteNotification(notification._id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPage;
