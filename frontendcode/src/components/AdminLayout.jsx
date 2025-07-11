import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Users, ShoppingCart, Settings, Plus, LogOut, Shield } from 'lucide-react';
import AdminDashboard from './admin/AdminDashboard';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AdminOrders from './admin/AdminOrders';
import AdminCategories from './admin/AdminCategories';

const AdminLayout = ({ accessToken, onLogout, username }) => {
  const location = useLocation();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: BarChart3 },
    { path: '/admin/products', label: 'Products', icon: Package },
    { path: '/admin/categories', label: 'Categories', icon: Plus },
    { path: '/admin/users', label: 'Users', icon: Users },
    { path: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  ];

  return (
    <div className="layout">
      <header className="header">
        <div className="header-brand">
          <div className="brand-logo">
            <Shield size={24} />
            <h1>Candle Shop - Admin</h1>
          </div>
          <div className="brand-tagline">Management Dashboard</div>
        </div>
        
        <div className="header-actions">
          <div className="user-status admin-status">
            <div className="status-indicator"></div>
            <span>Admin: {username}</span>
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
          <Route path="/" element={<AdminDashboard accessToken={accessToken} />} />
          <Route path="/products" element={<AdminProducts accessToken={accessToken} />} />
          <Route path="/categories" element={<AdminCategories accessToken={accessToken} />} />
          <Route path="/users" element={<AdminUsers accessToken={accessToken} />} />
          <Route path="/orders" element={<AdminOrders accessToken={accessToken} />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayout; 