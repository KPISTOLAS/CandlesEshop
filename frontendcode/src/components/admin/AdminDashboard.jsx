import { useState, useEffect } from 'react';
import { BarChart3, Package, Users, ShoppingCart, DollarSign, AlertTriangle, TrendingUp, Clock, Award, Eye, Edit, Trash2, Plus, Settings, Activity, Shield } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = ({ accessToken }) => {
  const [stats, setStats] = useState({
    total_users: 0,
    total_orders: 0,
    total_revenue: 0,
    total_candles: 0,
    low_stock_candles: 0,
    recent_orders: [],
    top_selling_candles: [],
    monthly_revenue: [],
    user_growth: [],
    inventory_alerts: []
  });
  const [loading, setLoading] = useState(true);
  const [quickActions, setQuickActions] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        if (accessToken) {
          const response = await axios.get('http://localhost:8000/admin/candles/v2/dashboard/stats', {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
          setStats(response.data);
        } else {
          // Enhanced mock data for demo
          setStats({
            total_users: 156,
            total_orders: 89,
            total_revenue: 2847.50,
            total_candles: 24,
            low_stock_candles: 3,
            recent_orders: [
              { id: 1, user_id: 1, status: 'completed', order_date: '2024-01-15T10:30:00Z', total_amount: 45.98, customer_name: 'John Doe' },
              { id: 2, user_id: 2, status: 'shipped', order_date: '2024-01-15T09:15:00Z', total_amount: 32.99, customer_name: 'Jane Smith' },
              { id: 3, user_id: 3, status: 'pending', order_date: '2024-01-15T08:45:00Z', total_amount: 67.50, customer_name: 'Mike Johnson' },
              { id: 4, user_id: 4, status: 'processing', order_date: '2024-01-15T07:30:00Z', total_amount: 23.99, customer_name: 'Sarah Wilson' }
            ],
            top_selling_candles: [
              { name: 'Lavender Dreams Candle', sales: 45, revenue: 1124.55, stock: 15 },
              { name: 'Vanilla Comfort Candle', sales: 38, revenue: 759.62, stock: 25 },
              { name: 'Ocean Breeze Candle', sales: 32, revenue: 735.68, stock: 10 },
              { name: 'Cinnamon Spice Candle', sales: 28, revenue: 755.72, stock: 8 }
            ],
            monthly_revenue: [
              { month: 'Jan', revenue: 2847.50 },
              { month: 'Dec', revenue: 2650.00 },
              { month: 'Nov', revenue: 2400.00 }
            ],
            user_growth: [
              { month: 'Jan', users: 156 },
              { month: 'Dec', users: 142 },
              { month: 'Nov', users: 128 }
            ],
            inventory_alerts: [
              { product: 'Cinnamon Spice Candle', stock: 8, threshold: 10 },
              { product: 'Ocean Breeze Candle', stock: 10, threshold: 15 },
              { product: 'Rose Garden Candle', stock: 12, threshold: 15 }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        // Fallback to mock data
        setStats({
          total_users: 156,
          total_orders: 89,
          total_revenue: 2847.50,
          total_candles: 24,
          low_stock_candles: 3,
          recent_orders: [],
          top_selling_candles: [],
          monthly_revenue: [],
          user_growth: [],
          inventory_alerts: []
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [accessToken]);

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading admin dashboard...</span>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'var(--success-50)', color: 'var(--success-700)', border: 'var(--success-200)' };
      case 'shipped':
        return { bg: 'var(--primary-50)', color: 'var(--primary-700)', border: 'var(--primary-200)' };
      case 'pending':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)', border: 'var(--warning-200)' };
      case 'processing':
        return { bg: 'var(--info-50)', color: 'var(--info-700)', border: 'var(--info-200)' };
      default:
        return { bg: 'var(--error-50)', color: 'var(--error-700)', border: 'var(--error-200)' };
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <div className="dashboard-header admin-header">
        <div className="dashboard-title">
          <Shield size={32} />
          <div>
            <h1>Admin Dashboard</h1>
            <p className="dashboard-subtitle">Complete control over your candle shop operations</p>
          </div>
        </div>
        <div className="admin-actions">
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Product
          </button>
          <button className="btn btn-secondary">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="dashboard">
        <div className="dashboard-card admin-card">
          <div className="card-icon users-icon">
            <Users size={24} />
          </div>
          <h3>{stats.total_users.toLocaleString()}</h3>
          <p>Total Users</p>
          <div className="card-trend">
            <TrendingUp size={16} />
            <span>+12% this month</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-sm btn-outline">View All</button>
          </div>
        </div>
        
        <div className="dashboard-card admin-card">
          <div className="card-icon orders-icon">
            <ShoppingCart size={24} />
          </div>
          <h3>{stats.total_orders.toLocaleString()}</h3>
          <p>Total Orders</p>
          <div className="card-trend">
            <TrendingUp size={16} />
            <span>+8% this month</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-sm btn-outline">Manage Orders</button>
          </div>
        </div>
        
        <div className="dashboard-card admin-card">
          <div className="card-icon revenue-icon">
            <DollarSign size={24} />
          </div>
          <h3>{formatCurrency(stats.total_revenue)}</h3>
          <p>Total Revenue</p>
          <div className="card-trend">
            <TrendingUp size={16} />
            <span>+15% this month</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-sm btn-outline">View Reports</button>
          </div>
        </div>
        
        <div className="dashboard-card admin-card">
          <div className="card-icon products-icon">
            <Package size={24} />
          </div>
          <h3>{stats.total_candles}</h3>
          <p>Total Products</p>
          <div className="card-trend">
            <TrendingUp size={16} />
            <span>+3 new products</span>
          </div>
          <div className="card-actions">
            <button className="btn btn-sm btn-outline">Manage Products</button>
          </div>
        </div>
      </div>

      {/* Inventory Alerts */}
      {stats.inventory_alerts.length > 0 && (
        <div className="dashboard-section">
          <div className="section-header">
            <AlertTriangle size={20} />
            <h2>Low Stock Alerts</h2>
          </div>
          <div className="card">
            <div className="alert-grid">
              {stats.inventory_alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-content">
                    <h4>{alert.product}</h4>
                    <p>Stock: {alert.stock} (Threshold: {alert.threshold})</p>
                  </div>
                  <div className="alert-actions">
                    <button className="btn btn-sm btn-warning">Restock</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        {/* Recent Orders */}
        <div className="dashboard-section">
          <div className="section-header">
            <Clock size={20} />
            <h2>Recent Orders</h2>
            <button className="btn btn-sm btn-outline">View All Orders</button>
          </div>
          <div className="card">
            {stats.recent_orders.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Status</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent_orders.map((order) => {
                      const statusStyle = getStatusColor(order.status);
                      return (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id}</strong>
                          </td>
                          <td>{order.customer_name || `User ${order.user_id}`}</td>
                          <td>
                            <span className="status-badge" style={{
                              backgroundColor: statusStyle.bg,
                              color: statusStyle.color,
                              border: `1px solid ${statusStyle.border}`
                            }}>
                              {order.status}
                            </span>
                          </td>
                          <td>
                            <strong>{formatCurrency(order.total_amount)}</strong>
                          </td>
                          <td>{formatDate(order.order_date)}</td>
                          <td>
                            <div className="action-buttons">
                              <button className="btn btn-sm btn-outline" title="View Details">
                                <Eye size={14} />
                              </button>
                              <button className="btn btn-sm btn-outline" title="Edit Order">
                                <Edit size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No recent orders</p>
            )}
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="dashboard-section">
          <div className="section-header">
            <Award size={20} />
            <h2>Top Selling Products</h2>
            <button className="btn btn-sm btn-outline">View All Products</button>
          </div>
          <div className="card">
            {stats.top_selling_candles.length > 0 ? (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Sales</th>
                      <th>Revenue</th>
                      <th>Stock</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.top_selling_candles.map((product, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{product.name}</strong>
                        </td>
                        <td>{product.sales} units</td>
                        <td>{formatCurrency(product.revenue)}</td>
                        <td>
                          <span className={`stock-indicator ${product.stock < 15 ? 'low' : 'good'}`}>
                            {product.stock} in stock
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn btn-sm btn-outline" title="View Details">
                              <Eye size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline" title="Edit Product">
                              <Edit size={14} />
                            </button>
                            <button className="btn btn-sm btn-outline" title="Manage Stock">
                              <Package size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No product data available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 