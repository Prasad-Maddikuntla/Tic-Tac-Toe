const domain = process.env.REACT_APP_DOMAIN;
console.log("domain:", domain);

const userApiCalls = {
  getAllUsers: async () => {
    try {
      const response = await fetch(`${domain}/users`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return []
    }
  },

  registerUser: async (userData) => {
    try {
      const response = await fetch(`${domain}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error registering user:", error);
      throw error;
    }
  },

  loginUser: async (credentials) => {
    try {
      const response = await fetch(`${domain}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();

      // Assuming the server sends a token upon successful login
      if (data.token) {
        // Store the token in localStorage
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('userDetails', JSON.stringify(data.user));

      }

      return data;
    } catch (error) {
      console.error("Error logging in:", error);
      throw error;
    }
  },

  logoutUser: () => {
    // Remove the token from localStorage upon logout
    localStorage.removeItem('jwtToken');

    // Placeholder for logging out on the client side
    console.log("User logged out successfully");

    // You can add additional logic here as needed
  },
};


export default userApiCalls;
