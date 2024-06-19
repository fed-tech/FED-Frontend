import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import { AuthContextProvider } from './store/AuthContext.jsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

import './index.scss';
const clientId = '1077095174667-l6hai5erjd95lidrdl95k8mt3342vb99.apps.googleusercontent.com';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthContextProvider>
    <GoogleOAuthProvider clientId={clientId}> 
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </GoogleOAuthProvider>
    </AuthContextProvider>

  </React.StrictMode>,
)
