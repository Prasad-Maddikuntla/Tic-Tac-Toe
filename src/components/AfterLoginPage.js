import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Paper, List, ListItem, ListItemText, Avatar, TextField, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatBoard from './ChatBoard';
import userApiCalls from './APIcalls';

const AfterLoginPage = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState(false);
  const [userListData, setUserListData] = useState([]);
  const [userDetails, setUserDetails] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const details = JSON.parse(localStorage.getItem('userDetails'))
   
    setUserDetails(details);

  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const users = await userApiCalls.getAllUsers();
        console.log(userDetails)
        setUserListData(users.filter(item => item.username!==userDetails.username));
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);



  const handleLogout = () => {
    // Perform logout logic (clear user session, etc.)
    // For simplicity, we'll just navigate back to the login page
    navigate('/');
  };

  const handleUserSelect = (selectedUser) => {
    console.log(`Selected user: ${selectedUser.username}`);
    setSelectedUser(selectedUser);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = userListData?.filter((user) => user.username?.toLowerCase().includes(searchQuery.toLowerCase()));

  if (selectedUser) {
    return <ChatBoard setSelectedUser={setSelectedUser} loggedInUser={userDetails.username} selectedUser={selectedUser} />;
  }

  return (
    <Container maxWidth="md" className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90vh', padding: '30px', position: 'relative' }}>
      <Paper elevation={5} style={{ padding: '20px', marginTop: '20px', borderRadius: '15px', backgroundColor: 'rgba(255, 255, 255, 0.8)', width: '100%', height: '90vh' }}>
        <Typography variant="h4" style={{ marginBottom: '20px', color: '#4E3629' }}>
          Welcome to the Chat App!
        </Typography>

        <Typography variant="h6" style={{ marginBottom: '10px', color: '#4E3629' }}>
          Logged in as: {userDetails.username}
        </Typography>

        <Box style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <TextField
            label="Search Users"
            variant="outlined"
            fullWidth
            value={searchQuery}
            onChange={handleSearch}
            style={{ marginBottom: '10px' }}
          />

          {loading ? (
            <CircularProgress style={{ marginTop: '50px' }} />
          ) : (
            <List style={{ overflowY: 'auto', maxHeight: '500px', width: '100%' }}>
              {filteredUsers.map((user) => 
                user.username !== userDetails.username&& (<ListItem
                  button
                  key={user._id}
                  onClick={() => handleUserSelect(user)}
                  style={{ '&:hover': { backgroundColor: '#D2B48C', cursor: 'pointer' } }}
                >
                  <Avatar src={user.profileImageUrl} alt={user.username} style={{ marginRight: '10px' }} />
                  <ListItemText primary={user.username} style={{ fontSize: '16px' }} />
                </ListItem>) 
              )}
            </List>
          )}
        <Button variant="contained" color="primary" onClick={handleLogout} style={{ position: 'absolute', bottom: '20px', backgroundColor: '#4E3629', alignSelf: 'center' }}>
          Logout
        </Button>
        </Box>

      </Paper>
    </Container>
  );
};

export default AfterLoginPage;
