import React, { useState, useEffect } from 'react';
import { Badge } from '../designSystem';
import eventBus from '../designSystem/eventBus';
import './NotificationSystem.css';
import {
  MdNotifications,
  MdCheck,
  MdInfo,
  MdWarning,
  MdClose
} from 'react-icons/md';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
}

const NotificationSystem: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appStatus, setAppStatus] = useState({
    chat: { opened: 0, active: false },
    email: { opened: 0, active: false }
  });

  useEffect(() => {
    // Subscribe to app opened events
    const unsubscribeChatOpened = eventBus.on('chat:opened', () => {
      addNotification('Chat application opened', 'info');
      setAppStatus(prev => ({
        ...prev,
        chat: { opened: prev.chat.opened + 1, active: true }
      }));
    });

    const unsubscribeEmailOpened = eventBus.on('email:opened', () => {
      addNotification('Email application opened', 'info');
      setAppStatus(prev => ({
        ...prev,
        email: { opened: prev.email.opened + 1, active: true }
      }));
    });

    // Subscribe to app closed events
    const unsubscribeChatClosed = eventBus.on('chat:closed', () => {
      addNotification('Chat application closed', 'success');
      setAppStatus(prev => ({
        ...prev,
        chat: { ...prev.chat, active: false }
      }));
    });

    const unsubscribeEmailClosed = eventBus.on('email:closed', () => {
      addNotification('Email application closed', 'success');
      setAppStatus(prev => ({
        ...prev,
        email: { ...prev.email, active: false }
      }));
    });

    // Subscribe to custom events
    const unsubscribeCustom = eventBus.on('notification', (data: any) => {
      addNotification(data.message, data.type || 'info');
    });

    return () => {
      unsubscribeChatOpened();
      unsubscribeEmailOpened();
      unsubscribeChatClosed();
      unsubscribeEmailClosed();
      unsubscribeCustom();
    };
  }, []);

  const addNotification = (message: string, type: Notification['type']) => {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: new Date()
    };

    setNotifications(prev => [...prev, notification]);

    // Auto remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(notification.id);
    }, 5000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const testEventBus = () => {
    eventBus.emit('notification', {
      message: 'Test notification from EventBus!',
      type: 'success'
    });
  };

  return (
    <div className="notification-system">
      {/* App Status Bar */}
      <div className="app-status-bar">
        <div className="status-section">
          <span className="status-label">Micro-Frontend Status:</span>
          <div className="status-badges">
            <div className="status-item">
              <span className={`status-indicator ${appStatus.chat.active ? 'active' : ''}`}></span>
              <span>Chat</span>
              <Badge variant={appStatus.chat.active ? 'success' : 'default'}>
                {appStatus.chat.opened} opens
              </Badge>
            </div>
            <div className="status-item">
              <span className={`status-indicator ${appStatus.email.active ? 'active' : ''}`}></span>
              <span>Email</span>
              <Badge variant={appStatus.email.active ? 'success' : 'default'}>
                {appStatus.email.opened} opens
              </Badge>
            </div>
          </div>
        </div>
        <div className="status-actions">
          <button onClick={testEventBus} className="test-button" title="Test EventBus" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MdNotifications size={16} /> Test EventBus
          </button>
          {notifications.length > 0 && (
            <button onClick={clearAllNotifications} className="clear-button">
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Notification Toast Container */}
      <div className="notification-container">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`notification notification--${notification.type}`}
            onClick={() => removeNotification(notification.id)}
          >
            <div className="notification-icon">
              {notification.type === 'success' && <MdCheck size={18} />}
              {notification.type === 'info' && <MdInfo size={18} />}
              {notification.type === 'warning' && <MdWarning size={18} />}
              {notification.type === 'error' && <MdClose size={18} />}
            </div>
            <div className="notification-content">
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <button
              className="notification-close"
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
            >
              <MdClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationSystem;
