import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import BraceletBuilder from './components/BraceletBuilder';
import './index.css';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error:', error);
    console.error('Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message || 'An unexpected error occurred'}</p>
          <button onClick={() => window.location.reload()}>
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const container = document.getElementById('root');
if (!container) {
  throw new Error('Failed to find root element');
}

const root = createRoot(container);
root.render(
  <StrictMode>
    <ErrorBoundary>
      <div className="w-screen h-screen overflow-hidden bg-gray-100">
        <BraceletBuilder />
      </div>
    </ErrorBoundary>
  </StrictMode>
);
