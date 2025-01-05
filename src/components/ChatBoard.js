import React, { useState, useEffect, useRef, } from 'react';
import { Container, Typography, TextField, Button, Paper, IconButton, Alert } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom'; // Assuming React Router is used
import NotificationPopover from './NotificationBar';
import { useAuth } from './Context';

const ChatBoard = ({ loggedInUser, socket, selectedUser, setSelectedUser }) => {
  const [messageContainer, setMessageContainer] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [gameRequestSent, setGameRequestSent] = useState(false);
  const [gameRequestAccepted, setGameRequestAccepted] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();
  const {setOpponent, setHeads } = useAuth()

  const { setTargetUser } = useAuth()

  const handleSendMessage = () => {
    const messageData = {
      user: loggedInUser,
      text: newMessage,
      timestamp: new Date(),
      targetUser: selectedUser.username,
      sentBy: 'loggedInUser',
    };

    socket.emit('sendMessage', messageData);
    setMessageContainer([...messageContainer, messageData]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleSendGameRequest = () => {
    const requestData = {
      sender: loggedInUser,
      targetUser: selectedUser.username,
      timestamp: new Date(),
    };

    socket.emit('sendGameRequest', requestData);
    setGameRequestSent(true);
    setOpponent(selectedUser.username)
  };

  useEffect(() => {
    socket.on('receiveMessage', (data) => {
      setMessageContainer([...messageContainer, data]);
      scrollToBottom();
      setTargetUser(selectedUser)
    });

    socket.on('gameRequestAccepted', (data) => {
        setGameRequestAccepted(true);
        setOpponent(data.responseUser);
        setHeads(true)
        setTimeout(() => navigate('/TicTacToe'), 1000); // Redirect after 1 second
    });

    socket.on('gameRequestDeclined', (data) => {
      setGameRequestAccepted(false);
      // setOpponent(data.responseUser);
      // setTimeout(() => navigate('/tic-tac-toe'), 1000); // Redirect after 1 second
  });
  }, [messageContainer, socket, loggedInUser, selectedUser, navigate]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <NotificationPopover />
      <Container
        maxWidth="md"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '80%',
          overflow: 'hidden',
        }}
      >
        <Paper
          elevation={5}
          style={{
            padding: '20px',
            paddingBottom: '80px',
            borderTopLeftRadius: '15px',
            borderTopRightRadius: '15px',
            backgroundColor: '#F0F0F0',
            width: '90%',
            overflowY: 'auto',
            flex: 1,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'row-reverse', marginBottom: '10px' }}>
            <IconButton onClick={() => setSelectedUser(false)} style={{ marginRight: 'auto' }}>
              <ArrowBackIcon />
            </IconButton>
          </div>
          <Typography
            variant="h4"
            style={{
              marginBottom: '20px',
              color: '#4E3629',
              textAlign: 'center',
              position: 'sticky',
              top: 0,
              backgroundColor: '#F0F0F0',
              padding: '10px',
              zIndex: 1,
            }}
          >
            {loggedInUser} Chat with {selectedUser.username}
          </Typography>

          {gameRequestSent && <Alert severity="info">Game request sent to {selectedUser.username}!</Alert>}
          {gameRequestAccepted && <Alert severity="success">Game request accepted! Redirecting...</Alert>}

          <Button
            variant="contained"
            color="secondary"
            onClick={handleSendGameRequest}
            style={{ marginBottom: '20px' }}
            disabled={gameRequestSent}
          >
            {gameRequestSent ? 'Request Sent' : 'Send Game Request'}
          </Button>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
            {messageContainer.map((message, index) => (
              <div
                key={index}
                style={{
                  alignSelf: message.sentBy === 'loggedInUser' ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  backgroundColor: message.sentBy === 'loggedInUser' ? '#DCF8C6' : '#FFFFFF',
                  padding: '10px',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
                  wordBreak: 'break-word',
                }}
              >
                <Typography variant="body1" style={{ color: '#4E3629' }}>
                  {message.text}
                </Typography>
                <Typography
                  variant="caption"
                  style={{ color: '#777', textAlign: message.user === loggedInUser ? 'right' : 'left' }}
                >
                  {new Date(message.timestamp).toLocaleTimeString()}
                </Typography>
              </div>
            ))}

            <div ref={messagesEndRef}></div>
          </div>
        </Paper>

        <div
          style={{
            marginTop: '0px',
            width: '90%',
            display: 'flex',
            alignItems: 'center',
            position: 'sticky',
            bottom: 0,
            backgroundColor: '#F0F0F0',
            padding: '20px',
            borderTop: '1px solid #CCC',
            borderBottomLeftRadius: '15px',
            borderBottomRightRadius: '15px',
          }}
        >
          <TextField
            label="Type a message"
            variant="outlined"
            fullWidth
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleSendMessage}
            style={{ marginLeft: '10px', backgroundColor: '#4E3629' }}
          >
            Send
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default ChatBoard;
