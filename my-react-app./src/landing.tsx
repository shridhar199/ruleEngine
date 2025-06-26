// import  { Component } from 'react';
// import { Link, withRouter, type RouteComponentProps } from 'react-router-dom';
// import KeycloakService from './keycloak';

// import { Bot, BrainCircuit, SlidersHorizontal } from 'lucide-react';
// import { Button } from './components/Button';
// import { Card, CardContent, CardHeader, CardTitle } from './components/Card';
// import Logo  from './components/Logo';
// import './landing.css'

// class LandingPage extends Component<RouteComponentProps> {
//   handleLogin = async () => {
//     await KeycloakService.login();
//     this.props.history.push('/dashboard');
//   };
//     render() {
//     return (
//       <div className="flex min-h-screen flex-col">
//         <header className="container mx-auto h-16 flex items-center justify-between px-4 md:px-6">
//           <Logo />
//           <Button asChild>
//             {/* <Link href="/dashboard">Go to Dashboard</Link> */}
//           </Button>
//         </header>

//         <main className="flex-1">
//           <section className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 py-12 text-center md:py-24">
//             <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
//               Build Business Logic with Natural Language
//             </h1>
//             <p className="max-w-[700px] text-muted-foreground md:text-xl">
//               RuleMaster AI empowers you to create, manage, and automate complex
//               business rules using an intuitive chatbot. No code required.
//             </p>
//             <Button size="lg" asChild>
//               {/* <Link href="/dashboard/chatbot">Get Started</Link> */}
//             </Button>
//           </section>

//           <section className="bg-muted py-12 md:py-24">
//             <div className="container mx-auto px-4 md:px-6">
//               <h2 className="mb-12 text-center text-3xl font-bold font-headline">
//                 Why RuleMaster AI?
//               </h2>
//               <div className="grid gap-8 md:grid-cols-3">
//                 <Card>
//                   <CardHeader className="flex flex-row items-center gap-4">
//                     <Bot className="h-10 w-10 text-accent" />
//                     <CardTitle className="font-headline">
//                       AI-Powered Chatbot
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p>
//                       Define rules using plain English. Our AI understands your
//                       intent and translates it into structured logic.
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center gap-4">
//                     <SlidersHorizontal className="h-10 w-10 text-accent" />
//                     <CardTitle className="font-headline">
//                       Powerful Rule Management
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p>
//                       A centralized dashboard to view, edit, and manage all your
//                       business rules with ease.
//                     </p>
//                   </CardContent>
//                 </Card>
//                 <Card>
//                   <CardHeader className="flex flex-row items-center gap-4">
//                     <BrainCircuit className="h-10 w-10 text-accent" />
//                     <CardTitle className="font-headline">
//                       Intelligent & Adaptable
//                     </CardTitle>
//                   </CardHeader>
//                   <CardContent>
//                     <p>
//                       Our system learns from your feedback, improving parsing
//                       accuracy and understanding over time.
//                     </p>
//                   </CardContent>
//                 </Card>
//               </div>
//             </div>
//           </section>
//         </main>

//         <footer className="bg-muted py-6">
//           <div className="container mx-auto flex items-center justify-between px-4 md:px-6">
//             <Logo />
//             <p className="text-sm text-muted-foreground">
//               © {new Date().getFullYear()} RuleMaster AI. All rights reserved.
//             </p>
//           </div>
//         </footer>
//       </div>
//     );
//   }
// }

// export default withRouter(LandingPage);


import React, { Component } from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Card,
  CardContent,
  CardHeader,
  Avatar,
} from '@mui/material';
import { SmartToy as Bot, Tune as Sliders, Memory } from '@mui/icons-material';
// import Logo  from './components/Logo';
import { Grid } from '@mui/material';
import './landing.css'
import KeycloakService from './keycloak';
import type { RouteComponentProps } from 'react-router-dom';

class LandingPage extends Component<RouteComponentProps>{
    handleLogin = async () => {
    await KeycloakService.login();
    this.props.history.push('/dashboard');
  };
  render() {
    return (
      <Box display="flex" flexDirection="column" minHeight="100vh">
        {/* Header */}
        <Box component="header" py={2} boxShadow={1}>
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* <Logo /> */}
            <Button variant="contained" color="primary" onClick={this.handleLogin}>
              Go to Dashboard
            </Button>
          </Container>
        </Box>

        {/* Main Content */}
        <Box component="main" flex="1">
          {/* Hero Section */}
          <Box py={10} textAlign="center" bgcolor="#f9fafb">
            <Container>
              <Typography variant="h2" fontWeight="bold" gutterBottom>
                Build Business Logic with Natural Language
              </Typography>
              <Typography variant="h6" color="text.secondary" maxWidth="700px" mx="auto" mb={4}>
                RuleMaster AI empowers you to create, manage, and automate complex business rules using an intuitive chatbot. No code required.
              </Typography>
              <Button variant="contained" color="secondary" size="large" onClick={this.handleLogin}>
                Get Started
              </Button>
            </Container>
          </Box>

          {/* Features Section */}
          <Box py={10} bgcolor="#eef1f5">
            <Container>
              <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
                Why RuleMaster AI?
              </Typography>

              <Grid container spacing={4} mt={2}>
                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar><Bot /></Avatar>}
                      title="AI-Powered Chatbot"
                    />
                    <CardContent>
                      <Typography>
                        Define rules using plain English. Our AI understands your intent and translates it into structured logic.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar><Sliders /></Avatar>}
                      title="Powerful Rule Management"
                    />
                    <CardContent>
                      <Typography>
                        A centralized dashboard to view, edit, and manage all your business rules with ease.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar><Memory /></Avatar>}
                      title="Intelligent & Adaptable"
                    />
                    <CardContent>
                      <Typography>
                        Our system learns from your feedback, improving parsing accuracy and understanding over time.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Container>
          </Box>
        </Box>

        {/* Footer */}
        <Box component="footer" py={3} bgcolor="#f1f3f5">
          <Container sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* <Logo /> */}
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} RuleMaster AI. All rights reserved.
            </Typography>
          </Container>
        </Box>
      </Box>
    );
  }
}

export default LandingPage;
