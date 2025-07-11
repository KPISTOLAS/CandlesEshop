import { useState, useEffect } from 'react';
import { ShoppingCart, Eye, Edit, Truck, CheckCircle, Clock, AlertTriangle, Filter, Download, Search, Package, User, DollarSign } from 'lucide-react';
import axios from 'axios';

const AdminOrders = ({ accessToken }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [selectedOrders, setSelectedOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      if (accessToken) {
        const response = await axios.get('http://localhost:8000/admin/candles/v2/orders', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setOrders(response.data);
      } else {
        // Enhanced mock data for demo
        setOrders([
          {
            id: 1,
            user_id: 1,
            customer_name: 'John Doe',
            customer_email: 'john@example.com',
            status: 'completed',
            order_date: '2024-01-15T10:30:00Z',
            total_amount: 45.98,
            items: [
              { product_name: 'Lavender Dreams Candle', quantity: 1, price: 24.99 },
              { product_name: 'Vanilla Comfort Candle', quantity: 1, price: 20.99 }
            ],
            shipping_address: '123 Main St, City, State 12345',
            payment_method: 'Credit Card',
            tracking_number: 'TRK123456789'
          },
          {
            id: 2,
            user_id: 2,
            customer_name: 'Jane Smith',
            customer_email: 'jane@example.com',
            status: 'shipped',
            order_date: '2024-01-15T09:15:00Z',
            total_amount: 32.99,
            items: [
              { product_name: 'Ocean Breeze Candle', quantity: 1, price: 22.99 },
              { product_name: 'Cinnamon Spice Candle', quantity: 1, price: 10.00 }
            ],
            shipping_address: '456 Oak Ave, City, State 12345',
            payment_method: 'PayPal',
            tracking_number: 'TRK987654321'
          },
          {
            id: 3,
            user_id: 3,
            customer_name: 'Mike Johnson',
            customer_email: 'mike@example.com',
            status: 'pending',
            order_date: '2024-01-15T08:45:00Z',
            total_amount: 67.50,
            items: [
              { product_name: 'Rose Garden Candle', quantity: 2, price: 29.99 },
              { product_name: 'Citrus Fresh Candle', quantity: 1, price: 21.99 }
            ],
            shipping_address: '789 Pine Rd, City, State 12345',
            payment_method: 'Credit Card',
            tracking_number: null
          },
          {
            id: 4,
            user_id: 4,
            customer_name: 'Sarah Wilson',
            customer_email: 'sarah@example.com',
            status: 'processing',
            order_date: '2024-01-15T07:30:00Z',
            total_amount: 23.99,
            items: [
              { product_name: 'Vanilla Comfort Candle', quantity: 1, price: 19.99 },
              { product_name: 'Cinnamon Spice Candle', quantity: 1, price: 4.00 }
            ],
            shipping_address: '321 Elm St, City, State 12345',
            payment_method: 'Credit Card',
            tracking_number: null
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      if (accessToken) {
        await axios.put(`http://localhost:8000/admin/candles/v2/orders/${orderId}/status`, {
          status: newStatus
        }, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Error updating order status. Please try again.');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(filteredOrders.map(o => o.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleSelectOrder = (orderId, checked) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return { bg: 'var(--success-50)', color: 'var(--success-700)', border: 'var(--success-200)', icon: CheckCircle };
      case 'shipped':
        return { bg: 'var(--primary-50)', color: 'var(--primary-700)', border: 'var(--primary-200)', icon: Truck };
      case 'pending':
        return { bg: 'var(--warning-50)', color: 'var(--warning-700)', border: 'var(--warning-200)', icon: Clock };
      case 'processing':
        return { bg: 'var(--info-50)', color: 'var(--info-700)', border: 'var(--info-200)', icon: Package };
      case 'cancelled':
        return { bg: 'var(--error-50)', color: 'var(--error-700)', border: 'var(--error-200)', icon: AlertTriangle };
      default:
        return { bg: 'var(--gray-50)', color: 'var(--gray-700)', border: 'var(--gray-200)', icon: Clock };
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.id.toString().includes(searchTerm);
      
      const matchesFilter = filterStatus === 'all' || order.status === filterStatus;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.order_date) - new Date(a.order_date);
        case 'amount':
          return b.total_amount - a.total_amount;
        case 'customer':
          return a.customer_name.localeCompare(b.customer_name);
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="admin-orders">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <ShoppingCart size={32} />
            <div>
              <h1>Order Management</h1>
              <p>Manage customer orders and track fulfillment</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Download size={16} />
              Export Orders
            </button>
            <button className="btn btn-primary">
              <Package size={16} />
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search orders by customer, email, or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date">Sort by Date</option>
            <option value="amount">Sort by Amount</option>
            <option value="customer">Sort by Customer</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedOrders.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedOrders.length} orders selected</span>
          <div className="bulk-buttons">
            <button className="btn btn-sm btn-outline" onClick={() => setSelectedOrders([])}>
              Clear Selection
            </button>
            <button className="btn btn-sm btn-primary">
              <Truck size={14} />
              Mark as Shipped
            </button>
            <button className="btn btn-sm btn-success">
              <CheckCircle size={14} />
              Mark as Completed
            </button>
          </div>
        </div>
      )}

      {/* Orders Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                const StatusIcon = statusStyle.icon;
                
                return (
                  <tr key={order.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order.id)}
                        onChange={(e) => handleSelectOrder(order.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <strong>#{order.id}</strong>
                    </td>
                    <td>
                      <div className="customer-info">
                        <h4>{order.customer_name}</h4>
                        <p>{order.customer_email}</p>
                      </div>
                    </td>
                    <td>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.quantity}x {item.product_name}</span>
                            <span className="item-price">{formatCurrency(item.price)}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <strong>{formatCurrency(order.total_amount)}</strong>
                    </td>
                    <td>
                      <span className="status-badge" style={{
                        backgroundColor: statusStyle.bg,
                        color: statusStyle.color,
                        border: `1px solid ${statusStyle.border}`
                      }}>
                        <StatusIcon size={12} style={{ marginRight: '4px' }} />
                        {order.status}
                      </span>
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
                        <select 
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Statistics */}
      <div className="order-stats">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-content">
              <h3>{orders.length}</h3>
              <p>Total Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-content">
              <h3>{formatCurrency(orders.reduce((sum, order) => sum + order.total_amount, 0))}</h3>
              <p>Total Revenue</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={24} />
            </div>
            <div className="stat-content">
              <h3>{orders.filter(o => o.status === 'pending').length}</h3>
              <p>Pending Orders</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <Truck size={24} />
            </div>
            <div className="stat-content">
              <h3>{orders.filter(o => o.status === 'shipped').length}</h3>
              <p>Shipped Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders; 