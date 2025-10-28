import React, { useState, useEffect } from 'react';
// @ts-ignore - Module Federation import
import { Button, Card, Input, Badge } from 'host/designSystem';
import './App.css';
import { MdMail, MdInbox, MdMarkunread, MdStar, MdStarBorder } from 'react-icons/md';

// Email interface
interface Email {
  id: number;
  from: string;
  subject: string;
  preview: string;
  time: string;
  isRead: boolean;
  isStarred: boolean;
  category: string;
  body: string;
}

// Mock email data
const initialEmails: Email[] = [
  {
    id: 1,
    from: 'john.doe@company.com',
    subject: 'Project Update - Q4 2024',
    preview: 'Hi team, I wanted to share the latest updates on our Q4 project...',
    time: '10:30 AM',
    isRead: false,
    isStarred: false,
    category: 'work',
    body: 'Hi team,\n\nI wanted to share the latest updates on our Q4 project. We have made significant progress and are on track to meet our deadlines.\n\nKey achievements:\n- Completed module federation setup\n- Implemented design system\n- All micro-frontends are now communicating\n\nBest regards,\nJohn'
  },
  {
    id: 2,
    from: 'jane.smith@company.com',
    subject: 'Meeting Reminder: Tomorrow at 3 PM',
    preview: 'Just a quick reminder about our meeting scheduled for tomorrow...',
    time: '09:15 AM',
    isRead: false,
    isStarred: true,
    category: 'important',
    body: 'Hi,\n\nJust a quick reminder about our meeting scheduled for tomorrow at 3 PM.\n\nAgenda:\n1. Review project timeline\n2. Discuss resource allocation\n3. Q&A session\n\nSee you there!\nJane'
  },
  {
    id: 3,
    from: 'notifications@github.com',
    subject: '[GitHub] New pull request in your repository',
    preview: 'A new pull request has been opened in your repository...',
    time: 'Yesterday',
    isRead: true,
    isStarred: false,
    category: 'notifications',
    body: 'A new pull request has been opened in your repository:\n\nRepository: bluebash-assignment\nPR #123: Implement micro-frontend architecture\n\nPlease review at your earliest convenience.'
  },
  {
    id: 4,
    from: 'hr@company.com',
    subject: 'Team Building Event - Save the Date',
    preview: 'We are excited to announce our upcoming team building event...',
    time: '2 days ago',
    isRead: true,
    isStarred: false,
    category: 'personal',
    body: 'Hi everyone,\n\nWe are excited to announce our upcoming team building event on December 15th!\n\nLocation: Corporate Retreat Center\nTime: 10 AM - 5 PM\n\nPlease RSVP by December 1st.\n\nLooking forward to seeing you all there!\nHR Team'
  },
  {
    id: 5,
    from: 'newsletter@techblog.com',
    subject: 'Weekly Tech Digest: Micro-Frontends & More',
    preview: "This week's top stories in web development...",
    time: '3 days ago',
    isRead: true,
    isStarred: false,
    category: 'newsletters',
    body: "This week's top stories:\n\n1. Micro-Frontends: The Future of Web Architecture\n2. React 19: What's New\n3. Vite 5.0 Released\n4. TypeScript Best Practices 2024\n\nRead more at techblog.com"
  },
];

function EmailApp() {
  const [emails, setEmails] = useState<Email[]>(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [composeForm, setComposeForm] = useState({ to: '', subject: '', body: '' });
  const [isEmbedded, setIsEmbedded] = useState(false);

  // Check if running inside iframe
  useEffect(() => {
    setIsEmbedded(window.self !== window.top);
  }, []);

  // PostMessage: Listen for messages from HOST
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: In production, verify event.origin
      // if (event.origin !== 'https://host-app.vercel.app') return;

      if (event.data && event.data.type) {
        console.log('[EMAIL] Received message from HOST:', event.data);

        switch (event.data.type) {
          case 'HOST_CONNECTED':
            console.log('[EMAIL] Connected to HOST:', event.data.payload);
            // Acknowledge connection
            if (isEmbedded && window.parent) {
              window.parent.postMessage(
                {
                  type: 'APP_LOADED',
                  payload: { app: 'email', timestamp: new Date().toISOString() }
                },
                '*' // In production: use specific origin
              );
            }
            break;
          case 'TEST_MESSAGE':
            console.log('[EMAIL] Test message received:', event.data.payload);
            break;
          default:
            console.log('[EMAIL] Unknown message type:', event.data.type);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isEmbedded]);

  // Send message to HOST when user performs actions
  const notifyHostOfAction = (action: string, data?: any) => {
    if (isEmbedded && window.parent) {
      window.parent.postMessage(
        {
          type: 'USER_ACTION',
          payload: {
            app: 'email',
            action,
            data,
            timestamp: new Date().toISOString()
          }
        },
        '*' // In production: use specific origin
      );
    }
  };

  const handleEmailClick = (email: Email) => {
    setSelectedEmail(email);
    setIsComposing(false);

    // Mark as read
    if (!email.isRead) {
      setEmails(prev => prev.map(e =>
        e.id === email.id ? { ...e, isRead: true } : e
      ));
      // Notify HOST
      notifyHostOfAction('email_read', { emailId: email.id, subject: email.subject });
    }
  };

  const handleStarToggle = (emailId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const email = emails.find(e => e.id === emailId);
    setEmails(prev => prev.map(email =>
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
    // Notify HOST
    if (email) {
      notifyHostOfAction('email_starred', {
        emailId,
        starred: !email.isStarred,
        subject: email.subject
      });
    }
  };

  const handleCompose = () => {
    setIsComposing(true);
    setSelectedEmail(null);
    setComposeForm({ to: '', subject: '', body: '' });
  };

  const handleSendEmail = () => {
    if (composeForm.to && composeForm.subject) {
      // Notify HOST
      notifyHostOfAction('email_sent', {
        to: composeForm.to,
        subject: composeForm.subject
      });

      alert(`Email sent to ${composeForm.to}!`);
      setIsComposing(false);
      setComposeForm({ to: '', subject: '', body: '' });
    }
  };

  const filteredEmails = emails.filter(email => {
    const matchesSearch =
      email.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.subject.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === 'unread') return !email.isRead && matchesSearch;
    if (filter === 'starred') return email.isStarred && matchesSearch;
    return matchesSearch;
  });

  const unreadCount = emails.filter(e => !e.isRead).length;

  return (
    <div className="email-app">
      <Card title="Email Application">
        <div className="email-container">
          {/* Sidebar */}
          <div className="email-sidebar">
            <Button onClick={handleCompose} variant="primary" fullWidth>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'center' }}>
                <MdMail size={16} /> Compose
              </span>
            </Button>

            <div className="email-filters">
              <button
                className={`filter-button ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MdInbox size={16} /> All Mail
                </span>
                <Badge variant="default">{emails.length}</Badge>
              </button>
              <button
                className={`filter-button ${filter === 'unread' ? 'active' : ''}`}
                onClick={() => setFilter('unread')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MdMarkunread size={16} /> Unread
                </span>
                {unreadCount > 0 && <Badge variant="danger">{unreadCount}</Badge>}
              </button>
              <button
                className={`filter-button ${filter === 'starred' ? 'active' : ''}`}
                onClick={() => setFilter('starred')}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MdStar size={16} /> Starred
                </span>
                <Badge variant="warning">{emails.filter(e => e.isStarred).length}</Badge>
              </button>
            </div>
          </div>

          {/* Email List */}
          <div className="email-list-panel">
            <div className="email-list-header">
              <h3>Inbox</h3>
              <Input
                type="text"
                placeholder="Search emails..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                fullWidth
              />
            </div>

            <div className="email-list">
              {filteredEmails.map(email => (
                <div
                  key={email.id}
                  className={`email-item ${!email.isRead ? 'unread' : ''} ${selectedEmail?.id === email.id ? 'active' : ''}`}
                  onClick={() => handleEmailClick(email)}
                >
                  <div className="email-item-header">
                    <button
                      className={`star-button ${email.isStarred ? 'starred' : ''}`}
                      onClick={(e) => handleStarToggle(email.id, e)}
                    >
                      {email.isStarred ? <MdStar size={18} /> : <MdStarBorder size={18} />}
                    </button>
                    <span className="email-from">{email.from}</span>
                    <span className="email-time">{email.time}</span>
                  </div>
                  <div className="email-subject">{email.subject}</div>
                  <div className="email-preview">{email.preview}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Email View / Compose */}
          <div className="email-view-panel">
            {isComposing ? (
              <div className="email-compose">
                <h3>New Message</h3>
                <div className="compose-form">
                  <Input
                    label="To"
                    type="email"
                    placeholder="recipient@example.com"
                    value={composeForm.to}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComposeForm({...composeForm, to: e.target.value})}
                    fullWidth
                  />
                  <Input
                    label="Subject"
                    type="text"
                    placeholder="Email subject"
                    value={composeForm.subject}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setComposeForm({...composeForm, subject: e.target.value})}
                    fullWidth
                  />
                  <div className="compose-body">
                    <label className="compose-label">Message</label>
                    <textarea
                      className="compose-textarea"
                      placeholder="Write your message..."
                      value={composeForm.body}
                      onChange={(e) => setComposeForm({...composeForm, body: e.target.value})}
                      rows={10}
                    />
                  </div>
                  <div className="compose-actions">
                    <Button onClick={handleSendEmail} variant="primary">Send</Button>
                    <Button onClick={() => setIsComposing(false)} variant="outline">Cancel</Button>
                  </div>
                </div>
              </div>
            ) : selectedEmail ? (
              <div className="email-view">
                <div className="email-view-header">
                  <h3>{selectedEmail.subject}</h3>
                  <div className="email-view-meta">
                    <span className="email-view-from">From: {selectedEmail.from}</span>
                    <span className="email-view-time">{selectedEmail.time}</span>
                  </div>
                </div>
                <div className="email-view-body">
                  {selectedEmail.body.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
                <div className="email-view-actions">
                  <Button variant="primary">Reply</Button>
                  <Button variant="outline">Forward</Button>
                  <Button variant="danger">Delete</Button>
                </div>
              </div>
            ) : (
              <div className="email-empty">
                <h3>Select an email to read</h3>
                <p>or compose a new message</p>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="email-info">
        <p>This is a standalone Email micro-frontend consuming Design System from Host</p>
        <Badge variant="secondary">Micro-Frontend</Badge>
      </div>
    </div>
  );
}

export default EmailApp;
