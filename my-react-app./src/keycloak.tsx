// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,   // e.g., http://localhost:8080/auth
  realm: import.meta.env.VITE_KEYCLOAK_REALME,
  clientId: import.meta.env.VITE_KEYCLOAK_SECRET_CLIENT_ID,
});

const KeycloakService = {
  login: () => keycloak.login({ redirectUri: window.location.origin + '/dashboard/Setting' }),
  logout: () => keycloak.logout(),
  getToken: () => keycloak.token,
  getKeycloak: () => keycloak
};

export default KeycloakService;
