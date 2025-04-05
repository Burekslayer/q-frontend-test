// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const handleRegister = async () => {
    try {
      await axios.post(`${apiUrl}/api/users/register`, {
        firstName,
        lastName,
        email,
        password,
      });
      setMessage('✅ Registration successful! Check your email to verify your account.');
    } catch (error) {
      setMessage(error.response?.data || 'Registration failed');
    }
  };

  return (
    <div className="auth-container">
      <h1>Register</h1>
      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
      <p>{message}</p>
      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
