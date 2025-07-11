import { useState } from 'react';
import { Bell, Check, Trash2 } from 'lucide-react';

const UserNotifications = ({ accessToken }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Welcome to Candle Shop!",
      message: "Thank you for joining our community. Enjoy 10% off your first order with code WELCOME10.",
      is_read: false,
      created_at: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      title: "New Product Alert",
      message: "Check out our latest Lavender Dreams Candle - perfect for relaxation!",
      is_read: false,
      created_at: "2024-01-14T15:45:00Z"
    },
    {
      id: 3,
      title: "Order Shipped",
      message: "Your order #12345 has been shipped and is on its way to you.",
      is_read: true,
      created_at: "2024-01-13T09:20:00Z"
    },
    {
      id: 4,
      title: "Special Offer",
      message: "Flash sale! 20% off all vanilla-scented candles for the next 24 hours.",
      is_read: true,
      created_at: "2024-01-12T14:15:00Z"
    }
  ]);

  const markAsRead = (notificationId) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, is_read: true }
        : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      is_read: true
    })));
  };

  const deleteNotification = (notificationId) => {
    setNotifications(notifications.filter(notification => notification.id !== notificationId));
  };

  const unreadCount = notifications.filter(notification => !notification.is_read).length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (notifications.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Bell size={64} style={{ color: '#ccc', marginBottom: '1rem' }} />
        <h2>No notifications</h2>
        <p style={{ color: '#666' }}>
          You're all caught up! Check back later for updates.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Notifications</h1>
        <div>
          {unreadCount > 0 && (
            <button 
              className="btn btn-secondary"
              onClick={markAllAsRead}
              style={{ marginRight: '1rem' }}
            >
              Mark all as read
            </button>
          )}
          <span style={{ 
            backgroundColor: '#667eea', 
            color: 'white', 
            padding: '0.25rem 0.75rem', 
            borderRadius: '12px',
            fontSize: '0.9rem'
          }}>
            {unreadCount} unread
          </span>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Notification</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {notifications.map((notification) => (
              <tr key={notification.id} style={{
                backgroundColor: notification.is_read ? 'transparent' : '#f8f9ff'
              }}>
                <td>
                  <div>
                    <h4 style={{ 
                      margin: '0 0 0.5rem 0',
                      color: notification.is_read ? '#666' : '#333',
                      fontWeight: notification.is_read ? 'normal' : 'bold'
                    }}>
                      {notification.title}
                    </h4>
                    <p style={{ 
                      margin: 0, 
                      color: '#666',
                      fontSize: '0.9rem'
                    }}>
                      {notification.message}
                    </p>
                  </div>
                </td>
                <td style={{ color: '#666', fontSize: '0.9rem' }}>
                  {formatDate(notification.created_at)}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {!notification.is_read && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="btn btn-success"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      title="Delete notification"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserNotifications; 