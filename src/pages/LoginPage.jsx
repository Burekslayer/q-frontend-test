import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function LoginPage({ setToken }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const verified = searchParams.get('verified');
    const token = searchParams.get('token');

    if (verified && token) {
      setToken(token);
      localStorage.setItem('token', token);
      navigate('/profile');
    }
  }, [searchParams, setToken, navigate]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${apiUrl}/api/users/login`, {
        email,
        password
      });
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      setMessage('Logged in successfully!');
    } catch (error) {
      setMessage(error.response?.data || 'Login failed');
    }
  };

  return (
    <div className="auth-container"  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}>
      <h1>Login</h1>
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
      <button onClick={handleLogin}>Login</button>
      <p>{message}</p>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default LoginPage;