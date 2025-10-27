import React from 'react';
import './App.css';
import { Button, Card, Input, Badge } from './designSystem';

function App() {
  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="app-header__content">
          <h1 className="app-header__title">Bluebash Micro-Frontend POC</h1>
          <div className="app-header__subtitle">
            Modular Architecture with Independent React Applications
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        <Card title="Welcome to the Micro-Frontend Architecture Demo">
          <p style={{ marginBottom: '20px', lineHeight: '1.6' }}>
            This project demonstrates a micro-frontend architecture with three independent applications.
            Each application runs on its own port and can be developed, deployed, and scaled independently.
          </p>

          <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <Card hoverable>
                <h3 style={{ marginBottom: '10px' }}>💬 Chat Application</h3>
                <p style={{ marginBottom: '15px', color: '#6b7280' }}>
                  Real-time messaging interface with conversations, search, and notifications.
                </p>
                <div style={{ marginTop: '15px' }}>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => window.open('https://chat-seven-psi-63.vercel.app', '_blank')}
                  >
                    Open Chat App →
                  </Button>
                </div>
              </Card>
            </div>

            <div style={{ flex: 1, minWidth: '250px' }}>
              <Card hoverable>
                <h3 style={{ marginBottom: '10px' }}>📧 Email Application</h3>
                <p style={{ marginBottom: '15px', color: '#6b7280' }}>
                  Full-featured email client with inbox, compose, and filtering capabilities.
                </p>
                <div style={{ marginTop: '15px' }}>
                  <Button
                    variant="primary"
                    fullWidth
                    onClick={() => window.open('https://mail-sable.vercel.app', '_blank')}
                  >
                    Open Email App →
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Card>

        <Card title="Shared Design System Components">
          <p style={{ marginBottom: '20px' }}>
            All micro-frontends use the same design system to ensure consistency. Here are some examples:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {/* Buttons */}
            <div>
              <h4 style={{ marginBottom: '10px' }}>Buttons</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Button variant="primary">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="success">Success</Button>
                <Button variant="danger">Danger</Button>
                <Button variant="outline">Outline</Button>
              </div>
            </div>

            {/* Badges */}
            <div>
              <h4 style={{ marginBottom: '10px' }}>Badges</h4>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Badge variant="default">Default</Badge>
                <Badge variant="primary">Primary</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </div>

            {/* Input */}
            <div>
              <h4 style={{ marginBottom: '10px' }}>Input Fields</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
                <Input label="Email" placeholder="Enter your email" />
                <Input label="Password" type="password" placeholder="Enter password" />
                <Input label="With Error" error="This field is required" />
              </div>
            </div>
          </div>
        </Card>

        <Card title="Architecture Overview">
          <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.8' }}>
            <div>📦 <strong>Host Application</strong></div>
            <div style={{ paddingLeft: '20px' }}>├─ Design System & Shared Components</div>
            <div style={{ paddingLeft: '20px' }}>├─ Documentation & Demo</div>
            <div style={{ paddingLeft: '20px' }}>└─ Links to Micro-Frontends</div>
            <br />
            <div>💬 <strong>Chat Micro-Frontend</strong></div>
            <div style={{ paddingLeft: '20px' }}>├─ Independent React App</div>
            <div style={{ paddingLeft: '20px' }}>├─ Consumes Design System from Host</div>
            <div style={{ paddingLeft: '20px' }}>└─ Chat Features & State</div>
            <br />
            <div>📧 <strong>Email Micro-Frontend</strong></div>
            <div style={{ paddingLeft: '20px' }}>├─ Independent React App</div>
            <div style={{ paddingLeft: '20px' }}>├─ Consumes Design System from Host</div>
            <div style={{ paddingLeft: '20px' }}>└─ Email Features & State</div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Built with React + Vite</p>
        <p className="app-footer__tech">
          <span>Host: modulararchitecutr-react.vercel.app</span>
          <span>Chat: chat-seven-psi-63.vercel.app</span>
          <span>Email: mail-sable.vercel.app</span>
        </p>
      </footer>
    </div>
  );
}

export default App;
