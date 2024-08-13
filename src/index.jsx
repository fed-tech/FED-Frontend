import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import reportWebVitals from './reportWebVitals';
import { Analytics } from "@vercel/analytics/react";
import RecoveryContextProvider from "./context/RecoveryContext.jsx";
import "./index.scss";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthContextProvider>
      <RecoveryContextProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_CLIENT_ID}>
          <BrowserRouter>
            <Analytics />
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </RecoveryContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);

reportWebVitals();