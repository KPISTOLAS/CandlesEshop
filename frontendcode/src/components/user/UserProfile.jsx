import { useState } from 'react';

const UserProfile = ({ accessToken }) => {
  const [user, setUser] = useState({
    id: 1,
    email: "user@example.com",
    full_name: "John Doe",
    phone: "+1 (555) 123-4567",
    profile_picture: null,
    created_at: "2024-01-15"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user.full_name,
    phone: user.phone
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      ...formData
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      full_name: user.full_name,
      phone: user.phone
    });
    setIsEditing(false);
  };

  return (
    <div>
      <h1>My Profile</h1>
      
      <div className="card">
        {!isEditing ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                backgroundColor: '#667eea',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '2rem',
                marginRight: '1rem'
              }}>
                {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2>{user.full_name}</h2>
                <p style={{ color: '#666' }}>{user.email}</p>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <strong>Phone:</strong> {user.phone}
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <strong>Member since:</strong> {new Date(user.created_at).toLocaleDateString()}
            </div>

            <div className="card-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="full_name">Full Name</label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2>Account Settings</h2>
        <div className="card">
          <div style={{ marginBottom: '1rem' }}>
            <strong>Email:</strong> {user.email}
            <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
              Contact support to change your email address
            </p>
          </div>
          
          <div className="card-actions">
            <button className="btn btn-secondary">
              Change Password
            </button>
            <button className="btn btn-danger">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 