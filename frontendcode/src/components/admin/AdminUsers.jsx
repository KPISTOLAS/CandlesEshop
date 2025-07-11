import { useState, useEffect } from 'react';
import { Users, Search, Trash2, Mail, Phone } from 'lucide-react';
import axios from 'axios';

const AdminUsers = ({ accessToken }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      if (accessToken) {
        const response = await axios.get('http://localhost:8000/admin/candles/v2/users/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setUsers(response.data);
      } else {
        // Mock data for demo
        setUsers([
          {
            id: 1,
            email: "john.doe@example.com",
            full_name: "John Doe",
            phone: "+1 (555) 123-4567",
            profile_picture: null,
            created_at: "2024-01-15T10:30:00Z"
          },
          {
            id: 2,
            email: "jane.smith@example.com",
            full_name: "Jane Smith",
            phone: "+1 (555) 234-5678",
            profile_picture: null,
            created_at: "2024-01-14T15:45:00Z"
          },
          {
            id: 3,
            email: "mike.johnson@example.com",
            full_name: "Mike Johnson",
            phone: "+1 (555) 345-6789",
            profile_picture: null,
            created_at: "2024-01-13T09:20:00Z"
          },
          {
            id: 4,
            email: "sarah.wilson@example.com",
            full_name: "Sarah Wilson",
            phone: "+1 (555) 456-7890",
            profile_picture: null,
            created_at: "2024-01-12T14:15:00Z"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      if (accessToken) {
        await axios.delete(`http://localhost:8000/admin/candles/v2/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading users...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>User Management</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#666' }}>
            {users.length} total user{users.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ position: 'relative', maxWidth: '400px' }}>
          <Search size={20} style={{ 
            position: 'absolute', 
            left: '12px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#666'
          }} />
          <input
            type="text"
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid #ddd',
              borderRadius: '6px',
              fontSize: '1rem'
            }}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Member Since</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      backgroundColor: '#667eea',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1rem',
                      marginRight: '1rem'
                    }}>
                      {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <strong>{user.full_name || 'No name provided'}</strong>
                      <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem', color: '#666' }}>
                        ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <Mail size={14} style={{ marginRight: '0.5rem', color: '#666' }} />
                      <span style={{ fontSize: '0.9rem' }}>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Phone size={14} style={{ marginRight: '0.5rem', color: '#666' }} />
                        <span style={{ fontSize: '0.9rem' }}>{user.phone}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td style={{ fontSize: '0.9rem', color: '#666' }}>
                  {formatDate(user.created_at)}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="btn btn-danger"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                      title="Delete user"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <Users size={64} style={{ color: '#ccc', marginBottom: '1rem' }} />
          <h3>No users found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}

      {/* User Statistics */}
      <div style={{ marginTop: '2rem' }}>
        <h3>User Statistics</h3>
        <div className="dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="dashboard-card">
            <h3>{users.length}</h3>
            <p>Total Users</p>
          </div>
          <div className="dashboard-card">
            <h3>{users.filter(user => {
              const createdDate = new Date(user.created_at);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              return createdDate > thirtyDaysAgo;
            }).length}</h3>
            <p>New Users (30 days)</p>
          </div>
          <div className="dashboard-card">
            <h3>{users.filter(user => user.full_name).length}</h3>
            <p>Users with Names</p>
          </div>
          <div className="dashboard-card">
            <h3>{users.filter(user => user.phone).length}</h3>
            <p>Users with Phone</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers; 