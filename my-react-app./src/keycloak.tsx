// src/keycloak.js
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: 'http://localhost:9080/',   // e.g., http://localhost:8080/auth
  realm: 'RuleMasterAI',
  clientId: 'react',
});

const KeycloakService = {
  login: () => keycloak.login({ redirectUri: window.location.origin + '/dashboard' }),
  logout: () => keycloak.logout(),
  getToken: () => keycloak.token,
  getKeycloak: () => keycloak
};

export default KeycloakService;
