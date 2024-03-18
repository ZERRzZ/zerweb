import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import initializeMocks from './mocks/initialize';
import App from './pages/App';

// TODO: mock条件使用自定义env
if (import.meta.env.MODE === 'development') {
  initializeMocks();
}

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <Router>
    <App />
  </Router>
);
