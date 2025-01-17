import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Login.scss';

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginData, setLoginData] = useState<LoginData>({
    email: '',
    password: '',
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        navigate('/dashboard');
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <h1>Professor Login</h1>
      <p className="login-info">
        Only professors need to login. Students can browse research projects without an account.
      </p>
      
      <form onSubmit={handleLogin}>
        <div className="form-field">
          <label htmlFor="email">Email (miami.edu)</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your miami.edu email"
            pattern="^[a-zA-Z0-9._-]+@miami\.edu$"
            value={loginData.email}
            onChange={(e) => setLoginData({...loginData, email: e.target.value})}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={loginData.password}
            onChange={(e) => setLoginData({...loginData, password: e.target.value})}
            required
          />
          <small>Must be at least 8 characters long</small>
        </div>

        <button type="submit" className="submit-button">
          Login
        </button>
      </form>

      <div className="register-link">
        <p>Don't have a professor account yet?</p>
        <button 
          onClick={() => navigate('/professor-register')} 
          className="link-button"
        >
          Register as Professor
        </button>
      </div>
    </div>
  );
};

export default Login;