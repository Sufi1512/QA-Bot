import React from 'react';
import ReactDOM from 'react-dom';
import AuthProvider from "./utils/SessionProvider";
import App from "./App"; // Adjust the path as necessary

ReactDOM.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>,
  document.getElementById('root')
);