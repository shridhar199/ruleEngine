// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )


// src/index.js or src/main.jsx
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import keycloak from './keycloak';

// import { ReactKeycloakProvider } from '@react-keycloak/web';

// const initOptions = {
//   onLoad: 'login-required', // or 'check-sso'
//   checkLoginIframe: false,
// };

// const root = ReactDOM.createRoot(document.getElementById('root')!);
// root.render(
//   <ReactKeycloakProvider authClient={keycloak} initOptions={initOptions}>
//     <App />
//   </ReactKeycloakProvider>
// );

import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
