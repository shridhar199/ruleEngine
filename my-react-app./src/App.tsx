import  { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import LandingPage from './landing';
import DashboardLayout from './Dashboard';
import KeycloakService from './keycloak';
import Setting from './Setting';
import CopilotkitSidebar from './page/CopilotChatbot.tsx'
import profile from './Profile.tsx'
class App extends Component<{}, { isAuthenticated: boolean; isInitialized: boolean }> {
  state = {
    isAuthenticated: false,
    isInitialized: false
  };

  async componentDidMount() {
    const keycloak = KeycloakService.getKeycloak();
    await keycloak.init({ onLoad: 'check-sso'});
    this.setState({
      isAuthenticated: keycloak.authenticated || false,
      isInitialized: true
    });
    console.log("componentDidMount",keycloak.token)
    localStorage.setItem('token',keycloak.token)
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
                    <Route path="/dashboard/Setting" component={Setting} />
                    <Route path="/dashboard/profile" component={profile} />
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
