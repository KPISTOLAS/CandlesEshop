import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import axios from 'axios';

const AdminCategories = ({ accessToken }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      if (accessToken) {
        const response = await axios.get('http://localhost:8000/admin/candles/v2/categories/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setCategories(response.data);
      } else {
        // Mock data for demo
        setCategories([
          {
            id: 1,
            name: "Aromatherapy",
            description: "Candles designed for relaxation and stress relief"
          },
          {
            id: 2,
            name: "Seasonal",
            description: "Candles perfect for different seasons and holidays"
          },
          {
            id: 3,
            name: "Decorative",
            description: "Beautiful candles that enhance home decor"
          },
          {
            id: 4,
            name: "Gift Sets",
            description: "Perfect candle combinations for gifting"
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCategory) {
        // Update existing category
        if (accessToken) {
          await axios.put(`http://localhost:8000/admin/candles/v2/categories/${editingCategory.id}`, formData, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        }
        setCategories(categories.map(c => 
          c.id === editingCategory.id ? { ...c, ...formData } : c
        ));
      } else {
        // Create new category
        if (accessToken) {
          await axios.post('http://localhost:8000/admin/candles/v2/categories/', formData, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        }
        const newCategory = {
          id: Date.now(),
          ...formData
        };
        setCategories([...categories, newCategory]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category. Please try again.');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (!confirm('Are you sure you want to delete this category? This action cannot be undone.')) return;
    
    try {
      if (accessToken) {
        await axios.delete(`http://localhost:8000/admin/candles/v2/categories/${categoryId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }
      setCategories(categories.filter(c => c.id !== categoryId));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: ''
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading categories...</h2>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Category Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={16} style={{ marginRight: '0.5rem' }} />
          Add Category
        </button>
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
            placeholder="Search categories..."
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

      {/* Category Form */}
      {showForm && (
        <div className="form" style={{ marginBottom: '2rem' }}>
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Category Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="3"
                placeholder="Describe what this category is for..."
              />
            </div>

            <div className="form-actions">
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
        {filteredCategories.map((category) => (
          <div key={category.id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3>{category.name}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleEdit(category)}
                  className="btn btn-secondary"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  title="Edit category"
                >
                  <Edit size={14} />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="btn btn-danger"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                  title="Delete category"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
            <p style={{ color: '#666', marginBottom: '1rem' }}>
              {category.description || 'No description provided'}
            </p>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              fontSize: '0.9rem',
              color: '#666'
            }}>
              <span>ID: {category.id}</span>
              <span>0 products</span>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No categories found</h3>
          <p>Try adjusting your search terms or add a new category</p>
        </div>
      )}

      {/* Category Statistics */}
      <div style={{ marginTop: '2rem' }}>
        <h3>Category Statistics</h3>
        <div className="dashboard" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
          <div className="dashboard-card">
            <h3>{categories.length}</h3>
            <p>Total Categories</p>
          </div>
          <div className="dashboard-card">
            <h3>{categories.filter(c => c.description).length}</h3>
            <p>Categories with Descriptions</p>
          </div>
          <div className="dashboard-card">
            <h3>{categories.filter(c => c.name.length > 10).length}</h3>
            <p>Long Named Categories</p>
          </div>
          <div className="dashboard-card">
            <h3>0</h3>
            <p>Categories with Products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCategories; 