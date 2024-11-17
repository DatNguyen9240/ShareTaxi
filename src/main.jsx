import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <StrictMode>
        <GoogleOAuthProvider clientId="77811558296-tt27tjbmupo79j7bajshv93l0gcut5v7.apps.googleusercontent.com">
            <ToastContainer />
            <App />
        </GoogleOAuthProvider>
    </StrictMode>
);
