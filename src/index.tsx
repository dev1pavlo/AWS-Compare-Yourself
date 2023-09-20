import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Amplify } from 'aws-amplify';
import App from './App';
import awsmobile from './aws-exports';

Amplify.configure(awsmobile)

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

