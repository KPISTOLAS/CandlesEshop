import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Eye, Package, AlertTriangle, Filter, Download, Upload, Settings, Copy, Archive, Box } from 'lucide-react';
import axios from 'axios';

const AdminProducts = ({ accessToken }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock_quantity: '',
    weight_grams: '',
    burn_time_hours: '',
    color: '',
    scent: '',
    material: '',
    category: '',
    is_active: true,
    featured: false,
    discount_percentage: 0
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      if (accessToken) {
        const response = await axios.get('http://localhost:8000/admin/candles/v2/', {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        setProducts(response.data);
      } else {
        // Enhanced mock data for demo
        setProducts([
          {
            id: 1,
            name: "Lavender Dreams Candle",
            description: "Relaxing lavender scent for peaceful evenings",
            price: 24.99,
            stock_quantity: 15,
            weight_grams: 200,
            burn_time_hours: 40,
            color: "Purple",
            scent: "Lavender",
            material: "Soy wax",
            category: "Relaxation",
            is_active: true,
            featured: true,
            discount_percentage: 0,
            created_at: "2024-01-10T10:00:00Z",
            sales_count: 45
          },
          {
            id: 2,
            name: "Vanilla Comfort Candle",
            description: "Warm vanilla aroma for cozy moments",
            price: 19.99,
            stock_quantity: 25,
            weight_grams: 180,
            burn_time_hours: 35,
            color: "Cream",
            scent: "Vanilla",
            material: "Soy wax",
            category: "Comfort",
            is_active: true,
            featured: false,
            discount_percentage: 10,
            created_at: "2024-01-08T14:30:00Z",
            sales_count: 38
          },
          {
            id: 3,
            name: "Ocean Breeze Candle",
            description: "Fresh ocean scent for a refreshing atmosphere",
            price: 22.99,
            stock_quantity: 10,
            weight_grams: 220,
            burn_time_hours: 45,
            color: "Blue",
            scent: "Ocean",
            material: "Soy wax",
            category: "Fresh",
            is_active: true,
            featured: true,
            discount_percentage: 0,
            created_at: "2024-01-12T09:15:00Z",
            sales_count: 32
          },
          {
            id: 4,
            name: "Cinnamon Spice Candle",
            description: "Warm cinnamon and spice for cozy winter nights",
            price: 26.99,
            stock_quantity: 8,
            weight_grams: 250,
            burn_time_hours: 50,
            color: "Brown",
            scent: "Cinnamon",
            material: "Soy wax",
            category: "Seasonal",
            is_active: true,
            featured: false,
            discount_percentage: 15,
            created_at: "2024-01-05T16:45:00Z",
            sales_count: 28
          }
        ]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        // Update existing product
        if (accessToken) {
          await axios.put(`http://localhost:8000/admin/candles/v2/${editingProduct.id}`, formData, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        }
        setProducts(products.map(p => 
          p.id === editingProduct.id ? { ...p, ...formData } : p
        ));
      } else {
        // Create new product
        if (accessToken) {
          await axios.post('http://localhost:8000/admin/candles/v2/', formData, {
            headers: { 'Authorization': `Bearer ${accessToken}` }
          });
        }
        const newProduct = {
          id: Date.now(),
          ...formData,
          price: parseFloat(formData.price),
          stock_quantity: parseInt(formData.stock_quantity),
          created_at: new Date().toISOString(),
          sales_count: 0
        };
        setProducts([...products, newProduct]);
      }
      
      resetForm();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stock_quantity: product.stock_quantity.toString(),
      weight_grams: product.weight_grams?.toString() || '',
      burn_time_hours: product.burn_time_hours?.toString() || '',
      color: product.color || '',
      scent: product.scent || '',
      material: product.material || '',
      category: product.category || '',
      is_active: product.is_active !== false,
      featured: product.featured || false,
      discount_percentage: product.discount_percentage || 0
    });
    setShowForm(true);
  };

  const handleDelete = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      if (accessToken) {
        await axios.delete(`http://localhost:8000/admin/candles/v2/deleteid/${productId}`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      }
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      if (error.response?.status === 400) {
        alert(error.response.data.detail || 'Cannot delete product. It may be referenced in orders or cart items.');
      } else {
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedProducts.length} products?`)) return;
    
    try {
      if (accessToken) {
        const response = await axios.post('http://localhost:8000/admin/candles/v2/bulk-delete', {
          product_ids: selectedProducts
        }, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        
        // Handle partial success
        if (response.data.failed_deletions) {
          alert(`${response.data.message}\n\nWarning: ${response.data.warning}`);
          // Remove only successfully deleted products
          setProducts(products.filter(p => !selectedProducts.includes(p.id) || response.data.failed_deletions.includes(p.id)));
        } else {
          setProducts(products.filter(p => !selectedProducts.includes(p.id)));
        }
      } else {
        setProducts(products.filter(p => !selectedProducts.includes(p.id)));
      }
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error bulk deleting products:', error);
      alert('Error deleting products. Please try again.');
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (productId, checked) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock_quantity: '',
      weight_grams: '',
      burn_time_hours: '',
      color: '',
      scent: '',
      material: '',
      category: '',
      is_active: true,
      featured: false,
      discount_percentage: 0
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getDiscountedPrice = (price, discount) => {
    return price * (1 - discount / 100);
  };

  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterStatus === 'all' || 
                           (filterStatus === 'active' && product.is_active) ||
                           (filterStatus === 'inactive' && !product.is_active) ||
                           (filterStatus === 'low-stock' && product.stock_quantity < 15) ||
                           (filterStatus === 'featured' && product.featured);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price':
          return a.price - b.price;
        case 'stock':
          return a.stock_quantity - b.stock_quantity;
        case 'sales':
          return (b.sales_count || 0) - (a.sales_count || 0);
        case 'date':
          return new Date(b.created_at) - new Date(a.created_at);
        default:
          return 0;
      }
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <span>Loading products...</span>
      </div>
    );
  }

  return (
    <div className="admin-products">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Package size={32} />
            <div>
              <h1>Product Management</h1>
              <p>Manage your candle inventory and product catalog</p>
            </div>
          </div>
          <div className="header-actions">
            <button className="btn btn-secondary">
              <Download size={16} />
              Export
            </button>
            <button className="btn btn-secondary">
              <Upload size={16} />
              Import
            </button>
            <button className="btn btn-primary" onClick={() => setShowForm(true)}>
              <Plus size={16} />
              Add Product
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
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-controls">
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Products</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="low-stock">Low Stock</option>
            <option value="featured">Featured</option>
          </select>
          
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="sales">Sort by Sales</option>
            <option value="date">Sort by Date</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProducts.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedProducts.length} products selected</span>
          <div className="bulk-buttons">
            <button className="btn btn-sm btn-outline" onClick={() => setSelectedProducts([])}>
              Clear Selection
            </button>
            <button className="btn btn-sm btn-warning" onClick={handleBulkDelete}>
              <Trash2 size={14} />
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                  />
                </th>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Sales</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className={product.stock_quantity < 15 ? 'low-stock' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedProducts.includes(product.id)}
                      onChange={(e) => handleSelectProduct(product.id, e.target.checked)}
                    />
                  </td>
                  <td>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>{product.description}</p>
                      <div className="product-tags">
                        {product.featured && <span className="tag featured">Featured</span>}
                        {product.discount_percentage > 0 && <span className="tag discount">{product.discount_percentage}% OFF</span>}
                      </div>
                    </div>
                  </td>
                  <td>{product.category}</td>
                  <td>
                    <div className="price-info">
                      {product.discount_percentage > 0 ? (
                        <>
                          <span className="original-price">{formatCurrency(product.price)}</span>
                          <span className="discounted-price">{formatCurrency(getDiscountedPrice(product.price, product.discount_percentage))}</span>
                        </>
                      ) : (
                        <span>{formatCurrency(product.price)}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="stock-info">
                      <span className={`stock-indicator ${product.stock_quantity < 15 ? 'low' : 'good'}`}>
                        {product.stock_quantity}
                      </span>
                      {product.stock_quantity < 15 && <AlertTriangle size={14} className="stock-warning" />}
                    </div>
                  </td>
                  <td>{product.sales_count || 0}</td>
                  <td>
                    <span className={`status-badge ${product.is_active ? 'active' : 'inactive'}`}>
                      {product.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn btn-sm btn-outline" title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline" onClick={() => handleEdit(product)} title="Edit Product">
                        <Edit size={14} />
                      </button>
                      <button className="btn btn-sm btn-outline" title="Duplicate">
                        <Copy size={14} />
                      </button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(product.id)} title="Delete Product">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="btn btn-sm btn-outline" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Stock Quantity *</label>
                  <input
                    type="number"
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Weight (grams)</label>
                  <input
                    type="number"
                    name="weight_grams"
                    value={formData.weight_grams}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Burn Time (hours)</label>
                  <input
                    type="number"
                    name="burn_time_hours"
                    value={formData.burn_time_hours}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
                
                <div className="form-group">
                  <label>Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Scent</label>
                  <input
                    type="text"
                    name="scent"
                    value={formData.scent}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Material</label>
                  <input
                    type="text"
                    name="material"
                    value={formData.material}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label>Discount (%)</label>
                  <input
                    type="number"
                    name="discount_percentage"
                    value={formData.discount_percentage}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
              
              <div className="form-checkboxes">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                  />
                  Active Product
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                  />
                  Featured Product
                </label>
              </div>
              
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts; 