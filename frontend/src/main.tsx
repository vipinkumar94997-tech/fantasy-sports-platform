import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from "@react-oauth/google";
import store from "./redux/store";
import App from "./App";
import AuthProvider from "./components/auth/AuthProvider";
import ErrorBoundary from "./components/common/ErrorBoundary";
import { GOOGLE_CLIENT_ID } from "./utils/constants";
import "./index.css";

console.log(import.meta.env.VITE_GOOGLE_CLIENT_ID);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </GoogleOAuthProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);
