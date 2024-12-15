// frontend/ChatBoard.js

import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, TextField, Button, Paper, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import messageSentSound from '../sounds/iphone-message-sound-effect.mp3';
import messageReceivedSound from '../sounds/notification_o14egLP.mp3';
import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_DOMAIN); // Replace with your backend server URL


const ChatBoard = ({ loggedInUser, selectedUser, setSelectedUser }) => {
  // const [loggedInUserMessages, setLoggedInUserMessages] = useState([]);
  const [messageContainer, setMessageContainer] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const messageSentAudio = new Audio(messageSentSound);
  const messageReceivedAudio = new Audio(messageReceivedSound);

  useEffect(() => {
    socket.emit('joinRoom', loggedInUser); // Assuming loggedInUser is the username
  }, [loggedInUser]);

  const handleSendMessage = () => {
    // if (newMessage.trim() === '') {
    //   return;
    // }

    const messageData = {
       user: loggedInUser, 
       text: newMessage,
        timestamp: new Date(),
        targetUser: selectedUser.username,
        sentBy : 'loggedInUser'
       };

    socket.emit('sendMessage', messageData);

    // const newLoggedInUserMessages = [...loggedInUserMessages, messageData];
    setMessageContainer([...messageContainer,messageData]);
    messageSentAudio.play();
    setNewMessage('');
    scrollToBottom();
  };

  useEffect(() => {
    // Handle receiving messages from the server
    socket.on('receiveMessage', (data) => {
      setMessageContainer([...messageContainer, data]);
      console.log('receiveMessage',data)
      messageReceivedAudio.play()
      scrollToBottom();
    });

    // Simulate an initial message when the chat starts
    // simulateReply();

    // return () => {
    //   // Clean up socket connection on component unmount
    //   socket.disconnect();
    // };
  }, [messageContainer, socket]);

  const scrollToBottom = () => {
    messagesEndRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };


  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
          {messageContainer.map((message, index) => (
  <div
    key={index}
    style={{
      alignSelf: message.sentBy === "loggedInUser" ? 'flex-end' : 'flex-start',
      maxWidth: '70%',
      backgroundColor: message.sentBy === "loggedInUser" ? '#DCF8C6' : '#FFFFFF',
      padding: '10px',
      borderRadius: '10px',
      boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)',
      flexWrap: 'wrap',  // This should work
      wordBreak: 'break-word',  // Add this for long words
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
