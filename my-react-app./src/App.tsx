// src/App.js
// import { useKeycloak } from '@react-keycloak/web';

// function App() {
//   const { keycloak, initialized } = useKeycloak();

//   if (!initialized) return <div>Loading...</div>;

//   return (
//     <div>
//       {keycloak.authenticated ? (
//         <>
//           <h1>Welcome, {keycloak.tokenParsed?.preferred_username}</h1>
//           <button onClick={() => keycloak.logout()}>Logout</button>
//         </>
//       ) : (
//         <button onClick={() => keycloak.login()}>Login</button>
//       )}
//     </div>
//   );
// }

// export default App;

import  { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LandingPage from './landing';
import DashboardLayout from './Dashboard';
import Rules from './Rules';
import KeycloakService from './keycloak';
import Setting from './Setting';
import CopilotkitSidebar from './page/CopilotChatbot.tsx'

class App extends Component<{}, { isAuthenticated: boolean; isInitialized: boolean }> {
  state = {
    isAuthenticated: false,
    isInitialized: false
  };

  async componentDidMount() {
    const keycloak = KeycloakService.getKeycloak();
    await keycloak.init({ onLoad: 'check-sso', silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html' });
    this.setState({
      isAuthenticated: keycloak.authenticated || false,
      isInitialized: true
    });
    console.log("componentDidMount")
  }

  render() {
    const { isAuthenticated, isInitialized } = this.state;
    console.log("isAuthenticated",isAuthenticated)
    if (!isInitialized) return null;

    return (
      <Router>
        <Switch>
          <Route exact path="/" render={(props) => <LandingPage {...props} />} />
          <Route
            path="/dashboard"
            render={() =>
              isAuthenticated ? (
                <DashboardLayout>
                  <Switch>
                    <Route path="/dashboard/chatbot" component={CopilotkitSidebar} />
                    <Route path="/dashboard/rules" component={Rules} />
                    <Route path="/dashboard/Setting" component={Setting} />
                  </Switch>
                </DashboardLayout>
              ) : (
                <Redirect to="/" />
              )
            }
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
