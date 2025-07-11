import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Search, Heart } from 'lucide-react';

const UserProducts = ({ accessToken }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { productId } = useParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/candles/v1/');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Mock data for demo
        setProducts([
          {
            id: 1,
            name: "Lavender Dreams Candle",
            description: "Relaxing lavender scent for peaceful evenings",
            price: 24.99,
            stock_quantity: 15
          },
          {
            id: 2,
            name: "Vanilla Comfort Candle",
            description: "Warm vanilla aroma for cozy moments",
            price: 19.99,
            stock_quantity: 25
          },
          {
            id: 3,
            name: "Ocean Breeze Candle",
            description: "Fresh ocean scent for a refreshing atmosphere",
            price: 22.99,
            stock_quantity: 10
          },
          {
            id: 4,
            name: "Cinnamon Spice Candle",
            description: "Warm cinnamon and spice for cozy winter nights",
            price: 26.99,
            stock_quantity: 8
          },
          {
            id: 5,
            name: "Rose Garden Candle",
            description: "Elegant rose fragrance for romantic evenings",
            price: 29.99,
            stock_quantity: 12
          },
          {
            id: 6,
            name: "Citrus Fresh Candle",
            description: "Energizing citrus blend for morning motivation",
            price: 21.99,
            stock_quantity: 20
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (productId) {
    const product = products.find(p => p.id === parseInt(productId));
    if (!product) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary">Back to Products</Link>
        </div>
      );
    }

    return (
      <div>
        <Link to="/products" className="btn btn-secondary" style={{ marginBottom: '1rem' }}>
          ← Back to Products
        </Link>
        <div className="card">
          <h1>{product.name}</h1>
          <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{product.description}</p>
          <div className="card-price">${product.price}</div>
          <div className="card-stock">
            {product.stock_quantity > 0 
              ? `${product.stock_quantity} in stock` 
              : 'Out of stock'
            }
          </div>
          <div className="card-actions">
            <button className="btn btn-primary" disabled={product.stock_quantity === 0}>
              Add to Cart
            </button>
            <button className="btn btn-secondary">
              <Heart size={16} style={{ marginRight: '0.5rem' }} />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <h1>Our Products</h1>
      
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
            placeholder="Search products..."
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

      <div className="grid">
        {filteredProducts.map((product) => (
          <div key={product.id} className="card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="card-price">${product.price}</div>
            <div className="card-stock">
              {product.stock_quantity > 0 
                ? `${product.stock_quantity} in stock` 
                : 'Out of stock'
              }
            </div>
            <div className="card-actions">
              <Link to={`/products/${product.id}`} className="btn btn-primary">
                View Details
              </Link>
              <button className="btn btn-secondary">
                <Heart size={16} style={{ marginRight: '0.5rem' }} />
                Wishlist
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h3>No products found</h3>
          <p>Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
};

export default UserProducts; 