import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './AuthContext';

const CLIENT_ID = '13198685413-9kblbm93qnok1aqmhjfan8t4150maqad.apps.googleusercontent.com';


ReactDOM.render(
  <BrowserRouter>
    <AuthProvider>
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <App />
      </GoogleOAuthProvider>
    </AuthProvider>
  </BrowserRouter >,
  document.getElementById('root')
);