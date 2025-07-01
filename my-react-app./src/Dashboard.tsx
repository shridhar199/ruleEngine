import React, { Component, type ReactNode } from 'react';
// Removed all react-router-dom imports to resolve compilation errors
// import { BrowserRouter, Link, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  alpha // Import alpha for translucent colors
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

import { purple } from '@mui/material/colors'; // Import purple colors for theme consistency
import KeycloakService from './keycloak';

interface Props {
  children: ReactNode;
  // `location` prop removed as `useLocation` is no longer used directly
}

const drawerWidth = 240;

// This Dashboard component is now self-contained for styling purposes.
// It uses standard HTML <a> tags for navigation which will cause full page reloads.
// You will need to integrate this component within your application's routing
// (e.g., BrowserRouter, Routes/Switch, etc.) if you need client-side navigation.
class Dashboard extends Component<Props> {
  handleLogout = () => {
    KeycloakService.logout();
  };

  render() {
    const { children } = this.props;

    const tokenData = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    const [header, payload] = tokenData.split('.');

    const decodedHeader = JSON.parse(atob(header));
    const decodedPayload = JSON.parse(atob(payload));

    console.log('Header:', decodedHeader);
    console.log('Payload:', decodedPayload);
    const isAdmin = decodedPayload['user-groups']?.includes("admin")
    console.log("isAdmin",isAdmin)
    // `currentLocationPath` logic is removed as `useLocation` is no longer available directly.
    // To enable 'selected' state, you would need to manually apply the 'Mui-selected' class
    // based on `window.location.pathname` or pass a `selected` prop from a parent routing context.

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
              // Updated background gradient for the sidebar to match landing page theme
              background: `linear-gradient(180deg, ${purple[800]} 0%, ${purple[900]} 100%)`,
              color: 'white',
              boxShadow: '4px 0px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
              borderRight: 'none', // Remove default border
            },
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          <Box
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: '100%', // Ensure content stretches
            }}
          >
            {/* RuleMaster AI Brand/Logo (Aligned with landing page theme) */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
              <Box
                sx={{
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: purple[300], // Lighter purple for accent dot
                  mr: 1,
                  boxShadow: `0px 0px 8px ${alpha(purple[300], 0.6)}`, // Soft glow
                }}
              />
              <Typography
                variant="h6"
                gutterBottom={false} // Remove default gutterBottom margin to align with flex item
                sx={{ fontWeight: 'bold', color: 'white', letterSpacing: '0.05em' }}
              >
                RuleMaster AI
              </Typography>
            </Box>

            {/* Navigation List */}
            <List sx={{ flexGrow: 1, pt: 0 }}> {/* pt:0 to remove extra padding from Toolbar */}
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  // Using standard href for navigation, will cause full page reloads.
                  // You should wrap this Dashboard in BrowserRouter and use `Link` for client-side routing.
                  component={Link}
                    to="/dashboard/chatbot"
                  // `selected` prop styling is here, but its activation needs external logic (e.g., based on window.location.pathname)
                  sx={{
                    borderRadius: '8px', // Rounded corners for buttons
                    '&:hover': {
                      backgroundColor: alpha(purple[300], 0.2), // Light hover effect with alpha
                    },
                    '&.Mui-selected': { // Style for the selected state
                        backgroundColor: alpha(purple[300], 0.3), // Slightly darker if active
                    },
                    py: 1.2, // More vertical padding for taller buttons
                  }}
                >
                  <ListItemText
                    primary="Chatbot"
                    primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1rem' }}
                  />
                </ListItemButton>
              </ListItem>
              {/* <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                    to="/dashboard/Setting"
                  sx={{
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: alpha(purple[300], 0.2),
                    },
                    '&.Mui-selected': {
                        backgroundColor: alpha(purple[300], 0.3),
                    },
                    py: 1.2,
                  }}
                >
                  <ListItemText
                    primary="Setting"
                    primaryTypographyProps={{ fontWeight: 'medium', fontSize: '1rem' }}
                  />
                </ListItemButton>
              </ListItem> */}
              {isAdmin && (
              <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  component={Link}
                  to="/dashboard/Setting"
                  sx={{
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: alpha(purple[300], 0.2),
                    },
                    '&.Mui-selected': {
                      backgroundColor: alpha(purple[300], 0.3),
                    },
                    py: 1.2,
                  }}
                >
                  <ListItemText
                    primary="Setting"
                    primaryTypographyProps={{
                      fontWeight: 'medium',
                      fontSize: '1rem',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            )}
            </List>
          </Box>
          <Box sx={{ flexGrow: 1 }} /> {/* This pushes the logout button to the bottom */}
          <Box sx={{ p: 2 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={this.handleLogout}
              sx={{
                backgroundColor: purple[400], // Lighter purple for logout button
                '&:hover': {
                  backgroundColor: purple[500], // Darker on hover
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Add a subtle shadow on hover
                },
                color: 'white', // Text color
                fontWeight: 'bold',
                borderRadius: '8px', // Rounded corners
                py: 1.2, // Consistent vertical padding
                textTransform: 'none', // Keep original casing (e.g., 'Logout' instead of 'LOGOUT')
                boxShadow: `0px 4px 10px ${alpha(purple[400], 0.4)}`, // Soft initial shadow
              }}
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
          <Toolbar /> {/* Spacer for content below where an AppBar would be */}
          {children}
        </Box>
      </Box>
    );
  }
}

// Removed the App component and routing setup, as the Dashboard component
// is now provided in isolation to ensure it compiles without react-router-dom errors.
// You will need to integrate this Dashboard component into your main
// application's routing structure.

export default Dashboard;
