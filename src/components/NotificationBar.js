import React, { useState, useEffect } from 'react';
import { Popover, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getSocketConnections } from './soketConnection';
import { useAuth } from './Context';
// import { io } from 'socket.io-client';

let socket = null


const NotificationPopover = () => {
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    opponent: '',
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const {opponent, setOpponent, user, setUser} = useAuth()

  if(!user) {
    const loginUser = localStorage.getItem('userDetails')
    setUser(loginUser)
  }

  useEffect(() => {
    // Listen for incoming game requests

    if(!socket) {
      socket = getSocketConnections();
    }
    socket.on('gameRequest', (data) => {
      setNotification({
        show: true,
        message: `${data.sender} wants to play a game with you!`,
        opponent: data.sender,
      });
      // setOpponent(data.responseUser);
      setAnchorEl(document.body); // Attach the popover to the body
    });

    

    // Clean up on component unmount
    // return () => {
    //   socket.off('gameRequest');
    // };
  }, []);

  const handleAccept = () => {
    setNotification({ show: false, message: '', opponent: '' });
    setAnchorEl(null);
    socket.emit('gameResponse', { responseUser : user  ,accepted: true, opponent: notification.opponent });
    setOpponent(notification.opponent);
    navigate('/TicTacToe'); // Navigate to TicTacToe page
  };

  const handleReject = () => {
    setNotification({ show: false, message: '', opponent: '' });
    setAnchorEl(null);
    socket.emit('gameResponse', { responseUser : user , accepted: false, opponent: notification.opponent });
    alert('You rejected the game request.');
    setOpponent('');
  };

  return (
    <>
      <Popover
        open={notification.show}
        anchorEl={anchorEl}
        onClose={() => setNotification({ ...notification, show: false })}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Box sx={{ padding: 2, maxWidth: 300 }}>
          <Typography variant="h6" gutterBottom>
            {notification.message}
          </Typography>
          <Box display="flex" justifyContent="space-between" mt={2}>
            <Button variant="contained" color="primary" onClick={handleAccept}>
              Accept
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleReject}>
              Reject
            </Button>
          </Box>
        </Box>
      </Popover>
    </>
  );
};

export default NotificationPopover;
