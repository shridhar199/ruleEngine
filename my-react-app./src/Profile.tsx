import { Component } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
  Button
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EditIcon from '@mui/icons-material/Edit';
import { grey, purple } from "@mui/material/colors";

class ProfilePage extends Component {
  render() {
    const tokenData = localStorage.getItem('token') ? localStorage.getItem('token') : '';
    const [header, payload] = tokenData.split('.');
    const decodedPayload = JSON.parse(atob(payload));
    const name = decodedPayload.email.split('@')[0];
    console.log("decodedPayload",decodedPayload)
    return (
      <Card sx={{ borderRadius: '12px', boxShadow: 3 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ color: purple[800], mb: 3, display: 'flex', alignItems: 'center' }}>
            <PersonIcon sx={{ mr: 1 }} /> User Profile
          </Typography>
          <Typography variant="body1" sx={{ color: grey[700], mb: 4 }}>
            View and manage your personal profile information.
          </Typography>

          <Box sx={{ maxWidth: 500, mx: 'auto', p: 3, border: `1px solid ${grey[200]}`, borderRadius: '8px', bgcolor: 'white' }}>
            <Typography variant="h6" sx={{ mb: 2, color: purple[700] }}>User Details</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  value={name} 
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  value={decodedPayload.email}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Group"
                   value={decodedPayload['user-groups'][0]}
                  variant="outlined"
                  size="small"
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <Button
                  variant="contained"
                  sx={{ mt: 2, bgcolor: purple[600], '&:hover': { bgcolor: purple[700] }, borderRadius: '8px', py: 1 }}
                  startIcon={<EditIcon />}
                >
                  Edit Profile
                </Button>
              </Grid> */}
            </Grid>
          </Box>
        </CardContent>
      </Card>
    );
  }
}

export default ProfilePage