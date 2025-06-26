import React, { Component } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  Avatar,
  Grid,
  AppBar,
  Toolbar
} from '@mui/material';
import { SmartToy, Tune, Memory, BubbleChart } from '@mui/icons-material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';
import KeycloakService from './keycloak';
import type { RouteComponentProps } from 'react-router-dom';

// --- Create a responsive theme ---
// This remains outside the component as it doesn't depend on component state or props.
let theme = createTheme({
  palette: {
    primary: {
      main: '#673ab7', // A deep purple
    },
    secondary: {
      main: '#f50057', // A vibrant pink for contrast
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h2: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
          },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);

// --- Logo Component (Functional Component) ---
// This can remain a separate functional component for reusability.
const Logo = () => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <BubbleChart color="primary" sx={{ fontSize: 32 }} />
    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
      RuleMaster AI
    </Typography>
  </Box>
);

// --- Feature Card Component (Functional Component) ---
const FeatureCard = ({ icon, title, description }) => (
  <Grid item xs={12} sm={6} md={4}>
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ textAlign: 'center', p: 4 }}>
        <Avatar sx={{ bgcolor: 'primary.main', width: 64, height: 64, margin: '0 auto 16px' }}>
          {icon}
        </Avatar>
        <Typography variant="h5" component="h3" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
);

// --- Main App Component (Class Component) ---
export default class App extends Component<RouteComponentProps> {
  
  // Mock login handler as a class method
  handleLogin = async () => {
    console.log("Login initiated. Navigating to dashboard...");
    await KeycloakService.login();
    this.props.history.push('/dashboard');
  };

  // Features data can be a class property
  features = [
    {
      icon: <SmartToy sx={{ fontSize: 32 }} />,
      title: "AI-Powered Chatbot",
      description: "Define rules using plain English. Our AI understands your intent and translates it into structured logic.",
    },
    {
      icon: <Tune sx={{ fontSize: 32 }} />,
      title: "Powerful Rule Management",
      description: "A centralized dashboard to view, edit, and manage all your business rules with ease and precision.",
    },
    {
      icon: <Memory sx={{ fontSize: 32 }} />,
      title: "Intelligent & Adaptable",
      description: "Our system learns from your feedback, improving parsing accuracy and understanding over time.",
    },
  ];

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
          
          {/* Header */}
          <AppBar position="fixed" color="inherit" elevation={0} sx={{ bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)' }}>
            <Container maxWidth="lg">
              <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Logo />
                <Button variant="contained" color="primary" onClick={this.handleLogin}>
                  Go to Dashboard
                </Button>
              </Toolbar>
            </Container>
          </AppBar>

          {/* Main Content */}
          <Box component="main" sx={{ flexGrow: 1 }}>
            {/* Toolbar spacer */}
            <Toolbar />
            
            {/* Hero Section */}
            <Box
              sx={{
                py: { xs: 8, md: 12 },
                textAlign: 'center',
                background: 'linear-gradient(180deg, #f0e9ff 0%, #f4f6f8 100%)',
              }}
            >
              <Container maxWidth="md">
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{ color: 'text.primary' }}
                >
                  Build Business Logic with Natural Language
                </Typography>
                <Typography
                  variant="h6"
                  color="text.secondary"
                  sx={{ maxWidth: '700px', mx: 'auto', mb: 4 }}
                >
                  RuleMaster AI empowers you to create, manage, and automate complex business rules using an intuitive chatbot. No code required.
                </Typography>
                <Button variant="contained" color="secondary" size="large" onClick={this.handleLogin}>
                  Get Started
                </Button>
              </Container>
            </Box>

            {/* Features Section */}
            <Box sx={{ py: { xs: 8, md: 12 } }}>
                <Container maxWidth="lg">
                    <Typography variant="h4" align="center" gutterBottom sx={{ mb: 6, color: 'text.primary' }}>
                    Why RuleMaster AI?
                    </Typography>
                    <Grid container spacing={4} justifyContent="center" alignItems="stretch" wrap="nowrap" sx={{ overflowX: 'auto' }}>
                    {this.features.map((feature, index) => (
                        <Grid item xs={12} md={4} sx={{ minWidth: 300 }} key={index}>
                        <FeatureCard 
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                        />
                        </Grid>
                    ))}
                    </Grid>
                </Container>
            </Box>

          </Box>

          {/* Footer */}
          <Box
            component="footer"
            sx={{
              py: 4,
              bgcolor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
               <Logo />
              <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} RuleMaster AI. All rights reserved.
              </Typography>
            </Container>
          </Box>
        </Box>
      </ThemeProvider>
    );
  }
}
