import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ShoppingBag, ArrowRight, Flame } from 'lucide-react';

const UserHome = ({ accessToken }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/candles/v1/');
        setFeaturedProducts(response.data.slice(0, 6)); // Show first 6 products
      } catch (error) {
        console.error('Error fetching products:', error);
        // For demo purposes, create some mock data
        setFeaturedProducts([
          {
            id: 1,
            name: "Lavender Dreams Candle",
            description: "Relaxing lavender scent for peaceful evenings",
            price: 24.99,
            stock_quantity: 15,
            rating: 4.8,
            reviews: 127
          },
          {
            id: 2,
            name: "Vanilla Comfort Candle",
            description: "Warm vanilla aroma for cozy moments",
            price: 19.99,
            stock_quantity: 25,
            rating: 4.6,
            reviews: 89
          },
          {
            id: 3,
            name: "Ocean Breeze Candle",
            description: "Fresh ocean scent for a refreshing atmosphere",
            price: 22.99,
            stock_quantity: 10,
            rating: 4.9,
            reviews: 156
          },
          {
            id: 4,
            name: "Cinnamon Spice Candle",
            description: "Warm cinnamon and spice for autumn vibes",
            price: 26.99,
            stock_quantity: 18,
            rating: 4.7,
            reviews: 94
          },
          {
            id: 5,
            name: "Rose Garden Candle",
            description: "Elegant rose fragrance for romantic evenings",
            price: 29.99,
            stock_quantity: 12,
            rating: 4.5,
            reviews: 67
          },
          {
            id: 6,
            name: "Pine Forest Candle",
            description: "Fresh pine scent for nature lovers",
            price: 21.99,
            stock_quantity: 22,
            rating: 4.4,
            reviews: 78
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <span>Loading beautiful candles...</span>
      </div>
    );
  }

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="currentColor" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} fill="currentColor" style={{ opacity: 0.5 }} />);
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} />);
    }
    
    return stars;
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={20} />
            <span>Premium Handcrafted Candles</span>
          </div>
          <h1 className="hero-title">
            Illuminate Your Space with
            <span className="gradient-text"> Beautiful Candles</span>
          </h1>
          <p className="hero-description">
            Discover our collection of handcrafted candles designed to create the perfect ambiance 
            for every mood and occasion. From relaxing lavender to warm vanilla, find your perfect scent.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary hero-btn">
              <ShoppingBag size={20} />
              Shop Now
              <ArrowRight size={20} />
            </Link>
            <button className="btn btn-secondary hero-btn">
              Learn More
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="candle-animation">
            <div className="candle">
              <div className="wick"></div>
              <div className="flame">
                <Flame size={24} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🕯️</div>
            <h3>Handcrafted</h3>
            <p>Each candle is carefully crafted by skilled artisans</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌿</div>
            <h3>Natural</h3>
            <p>Made with premium natural wax and essential oils</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">✨</div>
            <h3>Long-lasting</h3>
            <p>Up to 60 hours of burn time per candle</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Fast Shipping</h3>
            <p>Free shipping on orders over $50</p>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="section-header">
          <h2>Featured Products</h2>
          <p>Our most popular candles, loved by customers worldwide</p>
        </div>
        
        <div className="grid">
          {featuredProducts.map((product) => (
            <div key={product.id} className="card product-card">
              <div className="product-image">
                <div className="product-badge">
                  <Star size={16} fill="currentColor" />
                  {product.rating}
                </div>
                <div className="product-overlay">
                  <Link to={`/products/${product.id}`} className="btn btn-primary">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="product-content">
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-rating">
                  <div className="stars">
                    {renderStars(product.rating)}
                  </div>
                  <span className="review-count">({product.reviews} reviews)</span>
                </div>
                <div className="product-footer">
                  <div className="product-price">${product.price}</div>
                  <div className="product-stock">
                    {product.stock_quantity > 0 
                      ? `${product.stock_quantity} in stock` 
                      : 'Out of stock'
                    }
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="section-footer">
          <Link to="/products" className="btn btn-primary view-all-btn">
            View All Products
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default UserHome; 