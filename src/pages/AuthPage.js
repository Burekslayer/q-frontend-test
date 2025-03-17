// src/pages/AuthPage.js
import React, { useState } from 'react';
import axios from 'axios';

function AuthPage({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  // Provide a fallback so it doesn't break if the env variable is not set:
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleRegister = async () => {
    try {
      const response = await axios.post(`${apiUrl}/register`, { username, password });
      setMessage(response.data);
    } catch (error) {
      setMessage(error.response?.data || 'Registration failed');
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/login`, { username, password });
      setToken(response.data.token);
      setMessage('Logged in successfully!');
    } catch (error) {
      setMessage(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h1>Login or Register</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="button-group">
        <button onClick={handleRegister}>Register</button>
        <button onClick={handleLogin}>Login</button>
      </div>
      <p>{message}</p>
    </div>
  );
}

export default AuthPage;
