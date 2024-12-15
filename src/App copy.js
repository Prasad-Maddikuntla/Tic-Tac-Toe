import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Grid } from '@mui/material';

const App = () => {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ username: '', password: '', confirmPassword: '' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    console.log('Login Form Submitted:', loginData);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header to JSON
      },
      body: JSON.stringify(loginData),
    };
    let url = 'http://192.168.1.23:3001/register/login'     
    try {
     let respons = await fetch(url, options)
     let data = await respons.json()
     console.log(data)
    }
    catch(err) {
      console.log(err)
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    console.log('Register Form Submitted:', registerData);
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // Set the Content-Type header to JSON
      },
      body: JSON.stringify(registerData),
    };
    let url = 'http://192.168.1.23:3001/register'     
    try {
     let respons = await fetch(url, options)
     let data = await respons.json()
     console.log(data)
    }
    catch(err) {
      console.log(err)
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5">Login</Typography>
        <form onSubmit={handleLoginSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
            value={loginData.username}
            onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={loginData.password}
            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h5">Register</Typography>
        <form onSubmit={handleRegisterSubmit}>
          <TextField
            label="User name"
            fullWidth
            margin="normal"
            variant="outlined"
            value={registerData.username}
            onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
          />
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={registerData.password}
            onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
          />
          <TextField
            label="Confirm Password"
            fullWidth
            margin="normal"
            variant="outlined"
            type="password"
            value={registerData.confirmPassword}
            onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
          />
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default App;