import { useState } from 'react';
import './App.css';
import { Button, Card, Badge } from './designSystem';
import eventBus from './designSystem/eventBus';
import DesignSystemDocs from './components/DesignSystemDocs';
import FederatedWrapper from './components/FederatedWrapper';
import NotificationSystem from './components/NotificationSystem';
import {
  MdChat,
  MdEmail,
  MdLightbulb,
  MdRocket,
  MdPalette,
  MdNotifications,
  MdViewQuilt,
  MdCode,
  MdSettings,
  MdSync,
  MdInventory
} from 'react-icons/md';

function App() {
  const chatUrl = import.meta.env.VITE_CHAT_URL || 'http://localhost:5175';
  const emailUrl = import.meta.env.VITE_EMAIL_URL || 'http://localhost:5176';

  const [activeModal, setActiveModal] = useState<'chat' | 'email' | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'docs'>('overview');

  const trackWindowClose = (windowRef: Window | null, appName: 'chat' | 'email') => {
    if (!windowRef) return;

    const checkInterval = setInterval(() => {
      if (windowRef.closed) {
        clearInterval(checkInterval);
        eventBus.emit(`${appName}:closed`);
      }
    }, 1000); // Check every second
  };

  const handleOpenChat = (embedded: boolean = false) => {
    if (embedded) {
      setActiveModal('chat');
      eventBus.emit('chat:opened');
    } else {
      const newWindow = window.open(chatUrl, '_blank');
      eventBus.emit('chat:opened');
      trackWindowClose(newWindow, 'chat');
    }
  };

  const handleOpenEmail = (embedded: boolean = false) => {
    if (embedded) {
      setActiveModal('email');
      eventBus.emit('email:opened');
    } else {
      const newWindow = window.open(emailUrl, '_blank');
      eventBus.emit('email:opened');
      trackWindowClose(newWindow, 'email');
    }
  };

  const handleCloseModal = () => {
    if (activeModal) {
      eventBus.emit(`${activeModal}:closed`);
    }
    setActiveModal(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-header__title">Bluebash Micro-Frontend POC</h1>
          <div className="app-header__subtitle">
            Professional Modular Architecture with TypeScript
          </div>
        </div>
        <div className="app-header__nav">
          <Button
            variant={viewMode === 'overview' ? 'primary' : 'outline'}
            onClick={() => setViewMode('overview')}
            size="small"
          >
            Overview
          </Button>
          <Button
            variant={viewMode === 'docs' ? 'primary' : 'outline'}
            onClick={() => setViewMode('docs')}
            size="small"
          >
            Design System Docs
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Notification System */}
        <NotificationSystem />

        {viewMode === 'overview' ? (
          <>
            {/* Welcome Section */}
            <Card title="Welcome to the Micro-Frontend Architecture Demo">
              <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
                This project demonstrates a professional micro-frontend architecture with three independent
                TypeScript applications. Features include EventBus communication, iframe embedding with
                postMessage, and a complete design system documentation.
              </p>

              <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {/* Chat Card */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Card hoverable>
                    <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdChat size={20} /> Chat Application
                    </h3>
                    <p style={{ marginBottom: '15px', color: '#6b7280' }}>
                      Real-time messaging interface with conversations, search, and notifications.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleOpenChat(true)}
                      >
                        Open (Module Federation)
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => handleOpenChat(false)}
                      >
                        Open in New Tab
                      </Button>
                    </div>
                  </Card>
                </div>

                {/* Email Card */}
                <div style={{ flex: 1, minWidth: '250px' }}>
                  <Card hoverable>
                    <h3 style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MdEmail size={20} /> Email Application
                    </h3>
                    <p style={{ marginBottom: '15px', color: '#6b7280' }}>
                      Full-featured email client with inbox, compose, and filtering capabilities.
                    </p>
                    <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                      <Button
                        variant="primary"
                        fullWidth
                        onClick={() => handleOpenEmail(true)}
                      >
                        Open (Module Federation)
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => handleOpenEmail(false)}
                      >
                        Open in New Tab
                      </Button>
                    </div>
                  </Card>
                </div>
              </div>

              <div style={{
                background: '#f0f9ff',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #bfdbfe'
              }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: '#1e40af', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MdLightbulb size={16} style={{ flexShrink: 0 }} />
                  <span><strong>Pro Tip:</strong> Click "Open (Module Federation)" to see runtime module loading.
                  The micro-frontends are loaded dynamically at runtime using Webpack Module Federation!</span>
                </p>
              </div>
            </Card>

            {/* Features Section */}
            <Card title={<span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><MdRocket size={20} /> Professional Features Implemented</span>}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div className="feature-item">
                  <div className="feature-icon"><MdPalette size={24} /></div>
                  <h4>Design System Docs</h4>
                  <p>Storybook-like component showcase with live examples, prop tables, and copy-to-clipboard code snippets.</p>
                  <Badge variant="success">Interactive</Badge>
                </div>

                <div className="feature-item">
                  <div className="feature-icon"><MdNotifications size={24} /></div>
                  <h4>EventBus Notifications</h4>
                  <p>Real-time notifications using pub/sub pattern. Track micro-frontend opens, closes, and custom events.</p>
                  <Badge variant="primary">Live Updates</Badge>
                </div>

                <div className="feature-item">
                  <div className="feature-icon"><MdViewQuilt size={24} /></div>
                  <h4>Module Federation</h4>
                  <p>Runtime micro-frontend loading using Webpack Module Federation for seamless integration.</p>
                  <Badge variant="secondary">Dynamic Modules</Badge>
                </div>

                <div className="feature-item">
                  <div className="feature-icon"><MdCode size={24} /></div>
                  <h4>TypeScript</h4>
                  <p>Fully typed application with interfaces, type safety, and excellent IDE support.</p>
                  <Badge variant="success">Type-Safe</Badge>
                </div>

                <div className="feature-item">
                  <div className="feature-icon"><MdSettings size={24} /></div>
                  <h4>Environment Config</h4>
                  <p>Smart URL routing based on environment (localhost in dev, Vercel URLs in production).</p>
                  <Badge variant="warning">Auto-Switch</Badge>
                </div>

                <div className="feature-item">
                  <div className="feature-icon"><MdSync size={24} /></div>
                  <h4>Shared Design System</h4>
                  <p>Single source of truth for UI components consumed by all micro-frontends via Module Federation.</p>
                  <Badge variant="primary">Consistent</Badge>
                </div>
              </div>
            </Card>

            {/* Architecture Overview */}
            <Card title="Architecture Overview">
              <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdInventory size={16} /> <strong>Host Application</strong>
                </div>
                <div style={{ paddingLeft: '20px' }}>├─ Design System (Exposed via Module Federation)</div>
                <div style={{ paddingLeft: '20px' }}>├─ EventBus (Pub/Sub Communication)</div>
                <div style={{ paddingLeft: '20px' }}>├─ Notification System</div>
                <div style={{ paddingLeft: '20px' }}>├─ Federated Module Loader</div>
                <div style={{ paddingLeft: '20px' }}>└─ Design System Documentation</div>
                <br />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdChat size={16} /> <strong>Chat Micro-Frontend</strong>
                </div>
                <div style={{ paddingLeft: '20px' }}>├─ Independent TypeScript React App</div>
                <div style={{ paddingLeft: '20px' }}>├─ Consumes Design System via Module Federation</div>
                <div style={{ paddingLeft: '20px' }}>├─ Exposes App Component</div>
                <div style={{ paddingLeft: '20px' }}>└─ Standalone & Dynamically Loadable</div>
                <br />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdEmail size={16} /> <strong>Email Micro-Frontend</strong>
                </div>
                <div style={{ paddingLeft: '20px' }}>├─ Independent TypeScript React App</div>
                <div style={{ paddingLeft: '20px' }}>├─ Consumes Design System via Module Federation</div>
                <div style={{ paddingLeft: '20px' }}>├─ Exposes App Component</div>
                <div style={{ paddingLeft: '20px' }}>└─ Standalone & Dynamically Loadable</div>
              </div>
            </Card>
          </>
        ) : (
          <DesignSystemDocs />
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with React + TypeScript + Vite</p>
        <p className="app-footer__tech">
          <Badge variant="primary">TypeScript</Badge>
          <Badge variant="success">React 18</Badge>
          <Badge variant="secondary">Vite 5</Badge>
          <Badge variant="warning">Micro-Frontends</Badge>
        </p>
      </footer>

      {/* Federated Micro-Frontend */}
      {activeModal && (
        <FederatedWrapper
          app={activeModal}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

export default App;
