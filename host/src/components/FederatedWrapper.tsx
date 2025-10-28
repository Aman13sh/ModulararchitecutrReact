import React, { lazy, Suspense } from 'react';
import './FederatedWrapper.css';

interface FederatedWrapperProps {
  app: 'chat' | 'email';
  onClose: () => void;
}

const FederatedWrapper: React.FC<FederatedWrapperProps> = ({ app, onClose }) => {
  // Dynamically import the federated module
  const FederatedApp = lazy(() => {
    if (app === 'chat') {
      // @ts-ignore - Module Federation import
      return import('chatApp/App');
    } else {
      // @ts-ignore - Module Federation import
      return import('emailApp/App');
    }
  });

  return (
    <div className="federated-overlay" onClick={onClose}>
      <div className="federated-container" onClick={e => e.stopPropagation()}>
        <div className="federated-header">
          <h2>{app === 'chat' ? 'Chat Application' : 'Email Application'}</h2>
          <button className="federated-close" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="federated-body">
          <Suspense fallback={
            <div className="federated-loader">
              <div className="loader-spinner"></div>
              <p>Loading {app} application...</p>
            </div>
          }>
            <FederatedApp />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default FederatedWrapper;
