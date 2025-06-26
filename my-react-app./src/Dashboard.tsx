import React, { Component, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Typography,
  Button,
  CssBaseline,
} from '@mui/material';
import KeycloakService from './keycloak';

interface Props {
  children: ReactNode;
}

const drawerWidth = 240;

class Dashboard extends Component<Props> {
  handleLogout = () => {
    KeycloakService.logout();
  };

  render() {
    return (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: 'border-box',
              backgroundColor: '#1F2937',
              color: 'white',
            },
          }}
        >
          <Toolbar />
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              RuleMaster AI
            </Typography>
            <List>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/chatbot">
                  <ListItemText primary="Chatbot" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/rules">
                  <ListItemText primary="Rules" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={Link} to="/dashboard/Setting">
                  <ListItemText primary="Setting" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              onClick={this.handleLogout}
            >
              Logout
            </Button>
          </Box>
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, bgcolor: '#F9FAFB', minHeight: '100vh' }}
        >
          <Toolbar />
          {this.props.children}
        </Box>
      </Box>
    );
  }
}

export default Dashboard;
