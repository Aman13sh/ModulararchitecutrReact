import React, { useEffect, useRef } from 'react';
import './MicroFrontendModal.css';
import { MdChat, MdEmail, MdClose } from 'react-icons/md';

interface MicroFrontendModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
  title: string;
  app: 'chat' | 'email';
}

const MicroFrontendModal: React.FC<MicroFrontendModalProps> = ({
  isOpen,
  onClose,
  url,
  title,
  app
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [messageLog, setMessageLog] = React.useState<string[]>([]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY;

      // Lock scroll
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        // Restore scroll
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(true);
      setMessageLog([]);
      return;
    }

    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin in production
      // For demo purposes, we'll accept all messages
      if (event.data && event.data.type) {
        const timestamp = new Date().toLocaleTimeString();
        setMessageLog(prev => [
          ...prev,
          `[${timestamp}] ${event.data.type}: ${JSON.stringify(event.data.payload || {})}`
        ]);

        // Handle different message types
        switch (event.data.type) {
          case 'APP_LOADED':
            console.log(`${app} app loaded successfully`);
            break;
          case 'USER_ACTION':
            console.log(`User performed action in ${app}:`, event.data.payload);
            break;
          default:
            console.log('Unknown message type:', event.data);
        }
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen, app]);

  const handleIframeLoad = () => {
    setIsLoading(false);

    // Send a message to the iframe when it loads
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        {
          type: 'HOST_CONNECTED',
          payload: {
            hostApp: 'Bluebash Host',
            timestamp: new Date().toISOString()
          }
        },
        '*' // In production, specify the exact origin
      );
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="modal-icon">
              {app === 'chat' ? <MdChat size={24} /> : <MdEmail size={24} />}
            </span>
            <h2>{title}</h2>
          </div>
          <div className="modal-actions">
            {/* <Button variant="outline" size="small" onClick={sendTestMessage}>
              Send Test Message
            </Button> */}
            <button className="modal-close" onClick={onClose}>
              <MdClose size={20} />
            </button>
          </div>
        </div>

        <div className="modal-body">
          {isLoading && (
            <div className="iframe-loader">
              <div className="loader-spinner"></div>
              <p>Loading {app} application...</p>
            </div>
          )}
          <iframe
            ref={iframeRef}
            src={url}
            className="micro-frontend-iframe"
            title={title}
            onLoad={handleIframeLoad}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
        </div>

        {messageLog.length > 0 && (
          <div className="modal-footer">
            <details className="message-log">
              <summary>
                PostMessage Communication Log ({messageLog.length} messages)
              </summary>
              <div className="message-log-content">
                {messageLog.map((msg, index) => (
                  <div key={index} className="log-entry">
                    {msg}
                  </div>
                ))}
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
};

export default MicroFrontendModal;
