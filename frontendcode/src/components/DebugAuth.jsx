import React from 'react';

const DebugAuth = () => {
  const accessToken = localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('isAdmin');
  const userName = localStorage.getItem('user_name');
  const userEmail = localStorage.getItem('user_email');

  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '1px solid #ccc', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <h4>🔍 Auth Debug</h4>
      <div><strong>Token:</strong> {accessToken ? `${accessToken.substring(0, 20)}...` : 'None'}</div>
      <div><strong>Is Admin:</strong> {isAdmin}</div>
      <div><strong>User:</strong> {userName}</div>
      <div><strong>Email:</strong> {userEmail}</div>
      <button 
        onClick={() => {
          localStorage.clear();
          window.location.reload();
        }}
        style={{ marginTop: '5px', padding: '2px 5px' }}
      >
        Clear & Reload
      </button>
    </div>
  );
};

export default DebugAuth; 