import React, { useState } from 'react';
import './Login.css';

const Login = ({ setIsLoggedIn }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username: username,
          password: password,
        }),
        credentials: 'include',
      });

      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('isLoggedIn', 'true');
        setIsLoggedIn(true);
      } else {
        // Handle validation errors or other error formats
        let errorMessage = 'Login failed';
        if (Array.isArray(data)) {
          errorMessage = data[0]?.msg || JSON.stringify(data[0]) || 'Login failed';
        } else if (typeof data === 'object') {
          errorMessage = data.detail || data.message || JSON.stringify(data);
        } else {
          errorMessage = String(data);
        }
        setError(errorMessage);
      }
    } catch (err) {
      setError(typeof err === 'object' ? err.message || JSON.stringify(err) : String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <div className="login-header">
          <h2>TSC Weekly Byte</h2>
          <p>Enter your credentials to access the dashboard</p>
        </div>

        {error && <div className="error-message">{error}</div>}
        {loading && <div className="loading-message">Authenticating...</div>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Username"
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;