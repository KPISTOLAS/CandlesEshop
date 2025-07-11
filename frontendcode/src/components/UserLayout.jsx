import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { ShoppingBag, Home, User, Heart, Bell, LogOut, Sparkles } from 'lucide-react';
import UserHome from './user/UserHome';
import UserProducts from './user/UserProducts';
import UserProfile from './user/UserProfile';
import UserWishlist from './user/UserWishlist';
import UserNotifications from './user/UserNotifications';

const UserLayout = ({ accessToken, onLogout, username }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/products', label: 'Products', icon: ShoppingBag },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/wishlist', label: 'Wishlist', icon: Heart },
    { path: '/notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand">
          <div className="brand-logo">
            <Sparkles size={24} />
            <h1>Candle Shop</h1>
          </div>
          <div className="brand-tagline">Illuminate Your Space</div>
        </div>
        
        <div className="header-actions">
          <div className="user-status">
            <div className="status-indicator"></div>
            <span>Welcome, {username}!</span>
          </div>
          <button onClick={onLogout} className="btn btn-danger logout-btn">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </header>

      <nav className="nav">
        <div className="nav-container">
          <ul className="nav-list">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path} className="nav-item">
                  <Link 
                    to={item.path} 
                    className={`nav-link ${isActive ? 'active' : ''}`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                    {isActive && <div className="active-indicator"></div>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<UserHome accessToken={accessToken} />} />
          <Route path="/products" element={<UserProducts accessToken={accessToken} />} />
          <Route path="/products/:productId" element={<UserProducts accessToken={accessToken} />} />
          <Route path="/profile" element={<UserProfile accessToken={accessToken} />} />
          <Route path="/wishlist" element={<UserWishlist accessToken={accessToken} />} />
          <Route path="/notifications" element={<UserNotifications accessToken={accessToken} />} />
        </Routes>
      </main>
    </div>
  );
};

export default UserLayout; 