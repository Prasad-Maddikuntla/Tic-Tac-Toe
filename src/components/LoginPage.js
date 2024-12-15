import React, { useState } from 'react';
import { Container, Paper, Typography, TextField, Button, Snackbar, SnackbarContent, CircularProgress } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import userApiCalls from './APIcalls';

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false); // New state for loading indicator

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const newErrors = {};
    if (!loginData.username) {
      newErrors.username = 'Username is required';
    }
    if (!loginData.password) {
      newErrors.password = 'Password is required';
    }

    // If there are errors, set them and prevent form submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Set loading to true while waiting for the API response
    setLoading(true);

    try {
      // Call the loginUser function from API calls
      const response = await userApiCalls.loginUser(loginData);

      if (response.token) {
        // Clear any previous errors
        setErrors({});
        localStorage.setItem("userDetails", JSON.stringify(response.userDetails));

        // Your logic after a successful login
        console.log('Login successful:', response);

        // Navigate to the after-login page
        navigate('/afterlogin');
      } else {
        // Handle login failure (show error messages, etc.)
        setErrors({ username: response.error || 'Login failed', password: '' });
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrors({ username: 'Login failed', password: '' });
    } finally {
      // Set loading back to false after API call completes (whether it succeeded or failed)
      setLoading(false);
    }
  };

  const handleCloseErrorMessages = () => {
    setErrors({});
  };

  return (
    <>
      <nav>
        <Link to="/">Login</Link>
        <Link to="/register">Register</Link>
      </nav>
      <Container maxWidth="sm" className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
        <Paper elevation={3} style={{ padding: '20px', marginTop: '20px', position: 'relative' }}>
          <Typography variant="h5">Login</Typography>
          <form onSubmit={handleLoginSubmit}>
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              variant="outlined"
              value={loginData.username}
              onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
              error={!!errors.username}
              helperText={errors.username}
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              variant="outlined"
              type="password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button type="submit" variant="contained" color="primary">
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
          </form>

          {/* Snackbar for error messages */}
          <Snackbar
            open={!!errors.username || !!errors.password}
            autoHideDuration={6000}
            onClose={handleCloseErrorMessages}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Set anchorOrigin to bottom center
          >
            <SnackbarContent
              message={
                <>
                  {errors.username && <Typography variant="body1" style={{ color: 'red' }}>{errors.username}</Typography>}
                  {errors.password && <Typography variant="body1" style={{ color: 'red' }}>{errors.password}</Typography>}
                </>
              }
              style={{ backgroundColor: 'transparent' }}
            />
          </Snackbar>
        </Paper>
      </Container>
    </>
  );
};

export default LoginPage;
