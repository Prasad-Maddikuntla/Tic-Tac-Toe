import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Snackbar, SnackbarContent } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import userApiCalls from './APIcalls';

const RegisterPage = () => {
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    mobileNumber: '',
  });

  const [errors, setErrors] = useState({ username: '', password: '', confirmPassword: '' });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const newErrors = {};
    if (!registerData.username) {
      newErrors.username = 'Username is required';
    }
    if (!registerData.password) {
      newErrors.password = 'Password is required';
    }
    if (registerData.password !== registerData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Start loading
    setIsLoading(true);

    try {
      // Call the registerUser function from API calls
      const response = await userApiCalls.registerUser(registerData);

      if (response.message) {
        // Registration successful
        // Clear any previous errors
        setErrors({});
        // Show success message
        setSuccessMessage(response.message);
        // Navigate to the login page after a delay (you can adjust the delay as needed)
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        // Registration failed, set error message
        setErrorMessage(response.error || 'Registration failed');
      }
    } finally {
      // Stop loading, whether successful or not
      setIsLoading(false);
    }
  };

  const handleCloseSuccessMessage = () => {
    setSuccessMessage('');
  };

  const handleCloseErrorMessage = () => {
    setErrorMessage('');
  };

  return (
    <>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Container maxWidth="sm" className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '90vh' }}>
        <Paper elevation={3} style={{ padding: '20px', width: '100%' }}>
          {/* Snackbar for success message */}
          <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSuccessMessage}>
            <SnackbarContent
              message={
                <Typography variant="body1" style={{ color: 'green', fontWeight: 'bold', fontStyle: 'italic', fontSize: '30px', textAlign: 'center' }}>
                  {successMessage}
                </Typography>
              }
              style={{ backgroundColor: 'transparent', position: 'relative', top: '-40px' }}
            />
          </Snackbar>

          {/* Snackbar for error message */}
          <Snackbar open={!!errorMessage} autoHideDuration={6000} onClose={handleCloseErrorMessage}>
            <SnackbarContent
              message={
                <Typography variant="body1" style={{ color: 'red', fontWeight: 'bold', fontStyle: 'italic', fontSize: '30px', textAlign: 'center' }}>
                  {errorMessage}
                </Typography>
              }
              style={{ backgroundColor: 'transparent', position: 'relative', top: '-40px' }}
            />
          </Snackbar>

          <Typography variant="h5" style={{ marginBottom: '20px' }}>
            Register
          </Typography>
          <form onSubmit={handleRegisterSubmit}>
            <TextField
              label="User name"
              fullWidth
              margin="normal"
              variant="outlined"
              value={registerData.username}
              onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
            />
            <TextField
              label="Confirm Password"
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              value={registerData.confirmPassword}
              onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              variant="outlined"
              type="email"
              value={registerData.email}
              onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
            />
            <TextField
              label="Mobile Number"
              fullWidth
              margin="normal"
              variant="outlined"
              type="tel"
              value={registerData.mobileNumber}
              onChange={(e) => setRegisterData({ ...registerData, mobileNumber: e.target.value })}
            />

            <Button type="submit" variant="contained" color="primary" style={{ marginTop: '15px' }} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
