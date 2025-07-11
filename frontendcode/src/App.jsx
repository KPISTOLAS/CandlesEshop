import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import UserLayout from './components/UserLayout';
import AdminLayout from './components/AdminLayout';
import LoginPage from './components/LoginPage';
import DebugAuth from './components/DebugAuth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('App component mounted');
    try {
      const savedToken = localStorage.getItem('access_token');
      const savedIsAdmin = localStorage.getItem('isAdmin') === 'true';
      const savedUserName = localStorage.getItem('user_name');
      
      console.log('Checking saved auth data:', { savedToken: !!savedToken, savedIsAdmin, savedUserName });
      
      if (savedToken && savedUserName) {
        setAccessToken(savedToken);
        setIsAuthenticated(true);
        setIsAdmin(savedIsAdmin);
        setUserName(savedUserName);
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogin = (token, admin = false, name = '') => {
    console.log('Login successful:', { admin, name });
    setAccessToken(token);
    setIsAuthenticated(true);
    setIsAdmin(admin);
    setUserName(name);
    localStorage.setItem('access_token', token);
    localStorage.setItem('isAdmin', admin.toString());
    localStorage.setItem('user_name', name);
  };

  const handleLogout = () => {
    console.log('Logging out');
    setAccessToken('');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setUserName('');
    localStorage.removeItem('access_token');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
  };

  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #d633ff 0%, #ea580c 100%)',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('Rendering login page');
    return <LoginPage onLogin={handleLogin} />;
  }

  console.log('Rendering authenticated app:', { isAdmin, userName });
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <div className="App">
        <DebugAuth />
        <Routes>
          <Route 
            path="/admin/*" 
            element={
              isAdmin ? (
                <AdminLayout accessToken={accessToken} onLogout={handleLogout} username={userName} />
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/" 
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <UserLayout accessToken={accessToken} onLogout={handleLogout} username={userName} />
              )
            } 
          />
          <Route 
            path="/*" 
            element={
              isAdmin ? (
                <Navigate to="/admin" replace />
              ) : (
                <UserLayout accessToken={accessToken} onLogout={handleLogout} username={userName} />
              )
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
