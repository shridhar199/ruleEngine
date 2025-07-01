import React, { Component } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Switch,
  FormControlLabel,
  FormGroup,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import type { RouteComponentProps } from 'react-router-dom';
import type { StaticContext } from 'react-router';

// Define initial detailed permissions structure
const initialDetailedPermissions = {
  'Organisation Management': {
    'rules': { create: false, edit: false, delete: false, view: false }
  }
};

// Helper function to flatten the detailed permissions for display in the table
const flattenPermissions = (detailedPermissions:any) => {
  const flattened = [];
  for (const category in detailedPermissions) {
    for (const item in detailedPermissions[category]) {
      const itemPermissions = detailedPermissions[category][item];
      for (const permType in itemPermissions) {
        if (itemPermissions[permType]) {
          flattened.push(`${item.toLowerCase().replace(/\s/g, '-')}-${permType}`);
        }
      }
    }
  }
  return flattened;
};

// Main App component for the Settings screen (Class Component)
class Setting extends Component<RouteComponentProps> {
  constructor(props: RouteComponentProps<{}, StaticContext, unknown>) {
    super(props);
    this.state = {
      activeTab: 0, // 0 for Users, 1 for Groups, 2 for Roles
      
      // User Management States
      newUserName: '',
      newUserEmail: '',
      newUserGroup: '',
      users: [],

      // Group Management States
      newGroupName: '',
      newGroupDescription: '',
      userToDeleteId: null,
      openDeleteConfirmDialog: false, 
      newGroupRoles: [],
      groups: [
        { id: 1, name: 'Sales Team', description: 'Responsible for all sales activities.', roles: ['Editor', 'Viewer'] },
        { id: 2, name: 'Marketing', description: 'Handles marketing and promotions.', roles: ['Admin'] },
        { id: 3, name: 'Developers', description: 'Product development team.', roles: ['Editor'] },
      ],

      // Role Management States
      newRoleName: '',
      newRoleDescription: '',
      newRolePermissions: JSON.parse(JSON.stringify(initialDetailedPermissions)), // Deep copy for initial state
      roles: [
        { id: 1, name: 'Admin', description: 'Full administrative access', permissions: ['User-create', 'User-delete', 'User-edit', 'User-view', 'Product-create', 'Product-edit', 'Product-delete', 'Product-view'] },
        { id: 2, name: 'Editor', description: 'Can edit and publish content', permissions: ['Product-edit', 'Product-view'] },
        { id: 3, name: 'Viewer', description: 'Can only view content', permissions: ['Product-view'] },
      ],
      
      // Available roles for group assignment dropdown (mock data)
      availableRoles: ['Admin', 'Editor', 'Viewer', 'Contributor'],

      openCreateRoleDialog: false, // State to control the visibility of the Create Role dialog
      openCreateUserDialog: false, // New: State for Create User dialog
      openCreateGroupDialog: false, // New: State for Create Group dialog
    };
  }

  // Helper to reset newRolePermissions state to initial false values
  resetNewRolePermissions = () => {
    return JSON.parse(JSON.stringify(initialDetailedPermissions));
  };

  // Handle tab change
  handleTabChange = (event: any, newValue: any) => {
    this.setState({ activeTab: newValue });
  };

  //getUsers
  componentDidMount() {
    this.fetchUsers(); // Fetch users when the component mounts
  }

  // Simulate API call to fetch users
  fetchUsers = async () => {
    this.setState({ loadingUsers: true, usersError: null });
    try {
      // Replace with your actual API call
      // Example using fetch:
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await fetch(import.meta.env.VITE_RULENGIN_SERVER + '/rules/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Include authorization header
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Map the API response to your desired user structure
      const fetchedUsers = data.map(user => ({
        id: user.id, // Assuming API returns an 'id'
        name: user.username, // Assuming API returns 'username'
        email: user.email, // Assuming API returns 'email'
        group: user.attributes?.group?.[0] || 'N/A', // Assuming group is in attributes.group array
      }));
      this.setState({ users: fetchedUsers, loadingUsers: false });
    } catch (error) {
      console.error("Failed to fetch users:", error);
      this.setState({ usersError: "Failed to load users. Please try again.", loadingUsers: false });
    }
  };

  // Handle input changes for forms (general purpose)
  handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  // Handle select changes for group roles
  handleGroupRolesChange = (e: { target: { value: any; }; }) => {
    this.setState({ newGroupRoles: e.target.value });
  };

  // Handle permission switch changes for new role form
  handlePermissionChange = (category: string, item: string, permissionType: string) => (event) => {
    this.setState(prevState => ({
      newRolePermissions: {
        ...prevState.newRolePermissions,
        [category]: {
          ...prevState.newRolePermissions[category],
          [item]: {
            ...prevState.newRolePermissions[category][item],
            [permissionType]: event.target.checked
          }
        }
      }
    }));
  };

  // Handle opening and closing the Create Role dialog
  handleOpenCreateRoleDialog = () => {
    this.setState({ openCreateRoleDialog: true });
  };

  handleCloseCreateRoleDialog = () => {
    this.setState({
      openCreateRoleDialog: false,
      newRoleName: '',
      newRoleDescription: '',
      newRolePermissions: this.resetNewRolePermissions(), // Reset permissions when closing
    });
  };

  // New: Handle opening and closing the Create User dialog
  handleOpenCreateUserDialog = () => {
    this.setState({ openCreateUserDialog: true });
  };

  handleCloseCreateUserDialog = () => {
    this.setState({
      openCreateUserDialog: false,
      newUserName: '',
      newUserEmail: '',
      newUserGroup: '',
    });
  };

  // New: Handle opening and closing the Create Group dialog
  handleOpenCreateGroupDialog = () => {
    this.setState({ openCreateGroupDialog: true });
  };

  handleCloseCreateGroupDialog = () => {
    this.setState({
      openCreateGroupDialog: false,
      newGroupName: '',
      newGroupDescription: '',
      newGroupRoles: [],
    });
  };

  // Handle adding a new user
  handleAddUser = async () => {
    const { newUserName, newUserEmail, newUserGroup, users } = this.state;
  
  if (newUserName && newUserEmail) {
    const newUser = {
      username: newUserName,
      email: newUserEmail,
      enabled: true,
      attributes: {
        group: [newUserGroup || 'N/A'],
      },
    };

    const token = localStorage.getItem('token')
    fetch(import.meta.env.VITE_RULENGIN_SERVER+'/rules/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // You must have a valid token here
      },
      body: JSON.stringify(newUser),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create user');
        }
        this.componentDidMount();
        return response.json();
      })
      .then(() => {
        // Local state update after successful creation
        const newLocalUser = {
          id: users.length + 1,
          name: newUserName,
          email: newUserEmail,
          group: newUserGroup || 'N/A',
        };
        this.setState({
          users: [...users, newLocalUser],
          openCreateUserDialog: false,
          newUserName: '',
          newUserEmail: '',
          newUserGroup: '',
        });
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });

  } else {
    console.log('Please fill in Name and Email to add a user.');
  }
  };

  // Handle deleting a user via API
  handleDeleteUser = async () => {
    const { userToDeleteId } = this.state;
    if (!userToDeleteId) return;

    this.setState({ loadingUsers: true, openDeleteConfirmDialog: false }); // Close dialog and show loading
    try {
      const token = localStorage.getItem('token'); // Retrieve token
      const response = await fetch(`${import.meta.env.VITE_RULENGIN_SERVER}/rules/user/${userToDeleteId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }
      await this.fetchUsers(); // Re-fetch users to update the table after deletion
      console.log(`User with ID ${userToDeleteId} deleted successfully.`);
    } catch (error) {
      console.error("Failed to delete user:", error);
      this.setState({ usersError: `Failed to delete user. ${error.message}`, loadingUsers: false });
    } finally {
      this.setState({ userToDeleteId: null }); // Clear userToDeleteId
    }
  };

   handleOpenDeleteConfirmDialog = (userId:any) => {
    this.setState({ userToDeleteId: userId, openDeleteConfirmDialog: true });
  };

  // Handle adding a new group
  handleAddGroup = () => {
    const { newGroupName, newGroupDescription, newGroupRoles, groups } = this.state;
    if (newGroupName && newGroupDescription) {
      const newGroup = {
        id: groups.length + 1,
        name: newGroupName,
        description: newGroupDescription,
        roles: newGroupRoles,
      };
      this.setState({
        groups: [...groups, newGroup],
        openCreateGroupDialog: false, // Close dialog after adding
        newGroupName: '',
        newGroupDescription: '',
        newGroupRoles: [],
      });
    } else {
      console.log('Please fill in Group Name and Description to add a group.');
    }
  };

  // Handle adding a new role
  handleAddRole = () => {
    const { newRoleName, newRoleDescription, newRolePermissions, roles } = this.state;
    if (newRoleName && newRoleDescription) {
      const newRole = {
        id: roles.length + 1,
        name: newRoleName,
        description: newRoleDescription,
        permissions: flattenPermissions(newRolePermissions), // Flatten the detailed permissions
      };
      this.setState({
        roles: [...roles, newRole],
        openCreateRoleDialog: false, // Close dialog after adding
        newRoleName: '',
        newRoleDescription: '',
        newRolePermissions: this.resetNewRolePermissions(), // Reset permissions for next use
      });
    } else {
      console.log('Please fill in Role Name and Description to add a role.');
    }
  };

  // Helper to get group Chip color
  getGroupChipColor = (group:any) => {
    switch (group) {
      case 'Developers':
        return 'primary';
      case 'Sales Team':
        return 'success';
      case 'Marketing':
        return 'secondary';
      default:
        return 'default';
    }
  };

  render() {
    const { 
      activeTab, 
      newUserName, newUserEmail, newUserGroup, users,
      newGroupName, newGroupDescription, newGroupRoles, groups, availableRoles,
      newRoleName, newRoleDescription, newRolePermissions, roles,
      openCreateRoleDialog, openCreateUserDialog, openCreateGroupDialog,openDeleteConfirmDialog
    } = this.state;

    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#F9FAFB', p: { xs: 2, sm: 3, lg: 4 } }}>
        {/* Settings Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', color: '#1a202c', mb: 1 }}>
            Settings
          </Typography>
          <Typography variant="body1" sx={{ color: '#4a5568' }}>
            Manage users, groups, and roles for your organization.
          </Typography>
        </Box>

        {/* Main Content Card */}
        <Paper elevation={3} sx={{ borderRadius: '12px', p: { xs: 2, sm: 3, lg: 4 }, maxWidth: '960px', mx: 'auto' }}>
          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={this.handleTabChange} aria-label="settings tabs">
              <Tab label="Users" />
              <Tab label="Groups" />
              <Tab label="Roles" />
            </Tabs>
          </Box>

          {/* User Management Section */}
          {activeTab === 0 && (
            <div>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: '#1a202c', mb: 1 }}>
                User Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
                Create, view, and manage all users in your system.
              </Typography>

              {/* Button to Open Create User Dialog */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={this.handleOpenCreateUserDialog}
                  sx={{ borderRadius: '8px' }}
                >
                  Create User
                </Button>
              </Box>

              {/* User Table */}
              <TableContainer component={Paper} sx={{ borderRadius: '8px', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="user table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Group</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {users.map((user:any) => (
                      <TableRow key={user.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={user.group}
                            size="small"
                            color={this.getGroupChipColor(user.group)}
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton aria-label="edit" size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label="delete" size="small" color="error">
                            <DeleteIcon fontSize="small" onClick={() => this.handleOpenDeleteConfirmDialog(user.id)}/>
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Create User Dialog (Popup) */}
              <Dialog
                open={openCreateUserDialog}
                onClose={this.handleCloseCreateUserDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px' } }}
              >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    Create New User
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={this.handleCloseCreateUserDialog}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 2 }}>
                    <TextField
                      label="Name"
                      name="newUserName"
                      variant="outlined"
                      size="small"
                      placeholder="e.g. John Doe"
                      value={newUserName}
                      onChange={this.handleInputChange}
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      name="newUserEmail"
                      variant="outlined"
                      size="small"
                      placeholder="e.g. john.doe@example.com"
                      value={newUserEmail}
                      onChange={this.handleInputChange}
                      fullWidth
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="newUserGroup-label">Group</InputLabel>
                      <Select
                        labelId="newUserGroup-label"
                        id="newUserGroup"
                        name="newUserGroup"
                        value={newUserGroup}
                        label="Group"
                        onChange={this.handleInputChange}
                        IconComponent={ArrowDropDownIcon}
                      >
                        <MenuItem value="">Select a group</MenuItem>
                        <MenuItem value="Developers">Developers</MenuItem>
                        <MenuItem value="Sales Team">Sales Team</MenuItem>
                        <MenuItem value="Marketing">Marketing</MenuItem>
                        <MenuItem value="Support">Support</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={this.handleCloseCreateUserDialog} sx={{ borderRadius: '8px' }}>Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={this.handleAddUser}
                    sx={{ borderRadius: '8px' }}
                  >
                    Add User
                  </Button>
                </DialogActions>
              </Dialog>

              <Dialog
                open={openDeleteConfirmDialog}
                onClose={this.handleCloseDeleteConfirmDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px' } }}
              >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    Confirm Deletion
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={this.handleCloseDeleteConfirmDialog}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                  <Typography variant="body1">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={this.handleCloseDeleteConfirmDialog} sx={{ borderRadius: '8px' }}>Cancel</Button>
                  <Button
                    variant="contained"
                    color="error" // Use error color for delete action
                    onClick={this.handleDeleteUser}
                    sx={{ borderRadius: '8px' }}
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}

          {/* Group Management Section */}
          {activeTab === 1 && (
            <div>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: '#1a202c', mb: 1 }}>
                Group Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
                Create and manage user groups to assign roles collectively.
              </Typography>

              {/* Button to Open Create Group Dialog */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={this.handleOpenCreateGroupDialog}
                  sx={{ borderRadius: '8px' }}
                >
                  Create Group
                </Button>
              </Box>

              {/* Group Table */}
              <TableContainer component={Paper} sx={{ borderRadius: '8px', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="group table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Roles</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groups.map((group:any) => (
                      <TableRow key={group.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {group.name}
                        </TableCell>
                        <TableCell>{group.description}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {group.roles.map((role) => (
                              <Chip key={role} label={role} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton aria-label="edit" size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label="delete" size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Create Group Dialog (Popup) */}
              <Dialog
                open={openCreateGroupDialog}
                onClose={this.handleCloseCreateGroupDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{ sx: { borderRadius: '12px' } }}
              >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    Create New Group
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={this.handleCloseCreateGroupDialog}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 2, mb: 2 }}>
                    <TextField
                      label="Group Name"
                      name="newGroupName"
                      variant="outlined"
                      size="small"
                      placeholder="e.g. Sales Team"
                      value={newGroupName}
                      onChange={this.handleInputChange}
                      fullWidth
                    />
                    <TextField
                      label="Description"
                      name="newGroupDescription"
                      variant="outlined"
                      size="small"
                      placeholder="A short description of the group"
                      value={newGroupDescription}
                      onChange={this.handleInputChange}
                      fullWidth
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel id="newGroupRoles-label">Roles</InputLabel>
                      <Select
                        labelId="newGroupRoles-label"
                        id="newGroupRoles"
                        name="newGroupRoles"
                        multiple
                        value={newGroupRoles}
                        label="Roles"
                        onChange={this.handleGroupRolesChange}
                        renderValue={(selected) => (
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value:any) => (
                              <Chip key={value} label={value} size="small" />
                            ))}
                          </Box>
                        )}
                        IconComponent={ArrowDropDownIcon}
                      >
                        {availableRoles.map((role:any) => (
                          <MenuItem key={role} value={role}>
                            {role}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={this.handleCloseCreateGroupDialog} sx={{ borderRadius: '8px' }}>Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={this.handleAddGroup}
                    sx={{ borderRadius: '8px' }}
                  >
                    Add Group
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}

          {/* Role Management Section */}
          {activeTab === 2 && (
            <div>
              <Typography variant="h5" component="h2" sx={{ fontWeight: 'semibold', color: '#1a202c', mb: 1 }}>
                Role Management
              </Typography>
              <Typography variant="body2" sx={{ color: '#4a5568', mb: 3 }}>
                Define roles and their associated permissions.
              </Typography>

              {/* Button to Open Create Role Dialog */}
              <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={this.handleOpenCreateRoleDialog}
                  sx={{ borderRadius: '8px' }}
                >
                  Create Role
                </Button>
              </Box>

              {/* Role Table */}
              <TableContainer component={Paper} sx={{ borderRadius: '8px', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 650 }} aria-label="role table">
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#f8f9fa' }}>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Permissions</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', textTransform: 'uppercase', fontSize: '0.75rem', color: '#4a5568' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {roles.map((role:any) => (
                      <TableRow key={role.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">
                          {role.name}
                        </TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {role.permissions.map((permission:any) => (
                              <Chip key={permission} label={permission.split('-').slice(-2).join('-')} size="small" variant="outlined" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <IconButton aria-label="edit" size="small" color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton aria-label="delete" size="small" color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Create Role Dialog (Popup) */}
              <Dialog
                open={openCreateRoleDialog}
                onClose={this.handleCloseCreateRoleDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                  sx: { borderRadius: '12px' }
                }}
              >
                <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: 'medium' }}>
                    Add Role
                  </Typography>
                  <IconButton
                    aria-label="close"
                    onClick={this.handleCloseCreateRoleDialog}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                  >
                    <CloseIcon />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{ p: { xs: 2, sm: 3 } }}>
                  <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2, mb: 2 }}>
                    <TextField
                      label="Role name *"
                      name="newRoleName"
                      variant="outlined"
                      size="small"
                      placeholder="e.g. Content Moderator"
                      value={newRoleName}
                      onChange={this.handleInputChange}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Description *"
                      name="newRoleDescription"
                      variant="outlined"
                      size="small"
                      placeholder="A short description of the role"
                      value={newRoleDescription}
                      onChange={this.handleInputChange}
                      fullWidth
                      required
                    />
                  </Box>

                  {/* Permissions Section - Detailed with Switches */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: '#1a202c', mt: 3, mb: 1 }}>
                    Permissions
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  {Object.keys(newRolePermissions).map((category) => (
                    <Box key={category} sx={{ mb: 3 }}>
                      <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#4a5568', mb: 1 }}>
                        {category}
                      </Typography>
                      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: '8px', p: 2, bgcolor: '#ffffff' }}>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell sx={{ fontWeight: 'bold', borderBottom: 'none' }}>&nbsp;</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Create</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Edit</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>Delete</TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: 'none' }}>View</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {Object.keys(newRolePermissions[category]).map((item) => (
                                <TableRow key={item}>
                                  <TableCell sx={{ fontWeight: 'medium', textTransform: 'capitalize', borderBottom: 'none' }}>{item}</TableCell>
                                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={newRolePermissions[category][item].create}
                                          onChange={this.handlePermissionChange(category, item, 'create')}
                                          name={`${item}-create`}
                                        />
                                      }
                                      labelPlacement="start"
                                      label={newRolePermissions[category][item].create ? "Yes" : "No"}
                                      sx={{ '& .MuiFormControlLabel-label': { minWidth: '25px', fontSize: '0.75rem' } }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={newRolePermissions[category][item].edit}
                                          onChange={this.handlePermissionChange(category, item, 'edit')}
                                          name={`${item}-edit`}
                                        />
                                      }
                                      labelPlacement="start"
                                      label={newRolePermissions[category][item].edit ? "Yes" : "No"}
                                      sx={{ '& .MuiFormControlLabel-label': { minWidth: '25px', fontSize: '0.75rem' } }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={newRolePermissions[category][item].delete}
                                          onChange={this.handlePermissionChange(category, item, 'delete')}
                                          name={`${item}-delete`}
                                        />
                                      }
                                      labelPlacement="start"
                                      label={newRolePermissions[category][item].delete ? "Yes" : "No"}
                                      sx={{ '& .MuiFormControlLabel-label': { minWidth: '25px', fontSize: '0.75rem' } }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ borderBottom: 'none' }}>
                                    <FormControlLabel
                                      control={
                                        <Switch
                                          checked={newRolePermissions[category][item].view}
                                          onChange={this.handlePermissionChange(category, item, 'view')}
                                          name={`${item}-view`}
                                        />
                                      }
                                      labelPlacement="start"
                                      label={newRolePermissions[category][item].view ? "Yes" : "No"}
                                      sx={{ '& .MuiFormControlLabel-label': { minWidth: '25px', fontSize: '0.75rem' } }}
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  ))}
                </DialogContent>
                <DialogActions sx={{ p: 2, justifyContent: 'flex-end' }}>
                  <Button onClick={this.handleCloseCreateRoleDialog} sx={{ borderRadius: '8px' }}>Cancel</Button>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={this.handleAddRole}
                    sx={{ borderRadius: '8px' }}
                  >
                    Add Role
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          )}
        </Paper>
      </Box>
    );
  }
}

export default Setting;
