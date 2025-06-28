// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:8080',   // e.g., http://localhost:8080/auth
  realm: 'Rules',
  clientId: '83093772-4d96-401d-a8af-102df9cfa7b4',
});

const KeycloakService = {
  login: () => keycloak.login({ redirectUri: window.location.origin + '/dashboard' }),
  logout: () => keycloak.logout(),
  getToken: () => keycloak.token,
  getKeycloak: () => keycloak
};

export default KeycloakService;
