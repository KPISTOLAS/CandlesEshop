import { useState } from 'react';
import { Sparkles, Lock, Mail, Eye, EyeOff, Key } from 'lucide-react';
import axios from 'axios';

const LoginPage = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginData = {
        email: email,
        password: password,
        ...(isAdmin && { api_key: apiKey })
      };

      const response = await axios.post('http://localhost:8000/auth/login', loginData);
      
      const { access_token, user_id, email: userEmail, full_name, is_admin } = response.data;
      
      // Store token in localStorage
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_email', userEmail);
      localStorage.setItem('user_name', full_name || userEmail);
      
      // Call the onLogin callback with the token and user info
      onLogin(access_token, is_admin, full_name || userEmail);
      
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.detail) {
        setError(error.response.data.detail);
      } else if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else if (error.response?.status === 422) {
        setError('Please check your input and try again');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModeToggle = () => {
    setIsAdmin(!isAdmin);
    setEmail('');
    setPassword('');
    setApiKey('');
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Sparkles size={32} />
            <h1>{isAdmin ? 'Admin Portal' : 'Candle Shop'}</h1>
          </div>
          <p className="login-subtitle">
            {isAdmin 
              ? 'Access your admin dashboard to manage products, users, and orders'
              : 'Welcome to our beautiful candle collection'
            }
          </p>
        </div>

        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">
              <Mail size={16} />
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={16} />
              Password
            </label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {isAdmin && (
            <div className="form-group">
              <label htmlFor="apiKey">
                <Key size={16} />
                Admin API Key
              </label>
              <div className="input-wrapper">
                <input
                  id="apiKey"
                  type={showApiKey ? "text" : "password"}
                  placeholder="Enter admin API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowApiKey(!showApiKey)}
                  disabled={loading}
                >
                  {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="login-submit" disabled={loading}>
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                {isAdmin ? 'Logging in...' : 'Logging in...'}
              </>
            ) : (
              <>
                <Sparkles size={20} />
                {isAdmin ? 'Login as Admin' : 'Login as User'}
              </>
            )}
          </button>
        </form>

        <div className="login-toggle">
          <button 
            type="button"
            onClick={handleModeToggle}
            className="toggle-btn"
            disabled={loading}
          >
            {isAdmin ? 'Switch to User Mode' : 'Switch to Admin Mode'}
          </button>
        </div>

        {!isAdmin && (
          <div className="demo-notice">
            <div className="notice-icon">💡</div>
            <div className="notice-content">
              <h4>Demo Accounts</h4>
              <p>Try: <strong>demo@example.com</strong> / <strong>demo123</strong> or <strong>john@example.com</strong> / <strong>password123</strong></p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="demo-notice">
            <div className="notice-icon">🔐</div>
            <div className="notice-content">
              <h4>Admin Access</h4>
              <p>Email: <strong>admin@example.com</strong> | Password: <strong>admin123</strong> | API Key: <strong>admin-secret-key-2024</strong></p>
            </div>
          </div>
        )}

        <div className="login-features">
          <div className="feature">
            <div className="feature-icon">🕯️</div>
            <span>Premium Candles</span>
          </div>
          <div className="feature">
            <div className="feature-icon">🚚</div>
            <span>Fast Shipping</span>
          </div>
          <div className="feature">
            <div className="feature-icon">✨</div>
            <span>Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 