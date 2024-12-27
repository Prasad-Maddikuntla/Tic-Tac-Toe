import { io } from 'socket.io-client'; // Correctly import `io`
import { config } from '../config';

const { domain } = config;

let socket; // Keep the socket reference

export const getSocketConnections = () => {
  if (!socket) {
    const token = localStorage.getItem('jwtToken'); // Ensure the key is correct

    if (!token) {
      throw new Error('JWT token is missing'); // Handle missing token
    }

    socket = io(domain, {
      auth: {
        token, // Pass token in the auth object
      },
    //   withCredentials: true, // Uncomment if needed for cross-origin credentials
    });

    // Optional: Handle connection events
    socket.on('connect', () => {
      console.log('Connected to the socket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
    });
  }

  return socket;
};
