import { useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';

const UserWishlist = ({ accessToken }) => {
  const [wishlist, setWishlist] = useState([
    {
      candle_id: 1,
      candle: {
        id: 1,
        name: "Lavender Dreams Candle",
        description: "Relaxing lavender scent for peaceful evenings",
        price: 24.99,
        stock_quantity: 15
      }
    },
    {
      candle_id: 3,
      candle: {
        id: 3,
        name: "Ocean Breeze Candle",
        description: "Fresh ocean scent for a refreshing atmosphere",
        price: 22.99,
        stock_quantity: 10
      }
    },
    {
      candle_id: 5,
      candle: {
        id: 5,
        name: "Rose Garden Candle",
        description: "Elegant rose fragrance for romantic evenings",
        price: 29.99,
        stock_quantity: 12
      }
    }
  ]);

  const removeFromWishlist = (candleId) => {
    setWishlist(wishlist.filter(item => item.candle_id !== candleId));
  };

  const addToCart = (candle) => {
    // This would typically add to cart functionality
    alert(`${candle.name} added to cart!`);
  };

  if (wishlist.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <Heart size={64} style={{ color: '#ccc', marginBottom: '1rem' }} />
        <h2>Your wishlist is empty</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Start adding your favorite candles to your wishlist!
        </p>
        <a href="/products" className="btn btn-primary">
          Browse Products
        </a>
      </div>
    );
  }

  return (
    <div>
      <h1>My Wishlist</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        You have {wishlist.length} item{wishlist.length !== 1 ? 's' : ''} in your wishlist
      </p>

      <div className="grid">
        {wishlist.map((item) => (
          <div key={item.candle_id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h3>{item.candle.name}</h3>
              <button
                onClick={() => removeFromWishlist(item.candle_id)}
                className="btn btn-danger"
                style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
            <p>{item.candle.description}</p>
            <div className="card-price">${item.candle.price}</div>
            <div className="card-stock">
              {item.candle.stock_quantity > 0 
                ? `${item.candle.stock_quantity} in stock` 
                : 'Out of stock'
              }
            </div>
            <div className="card-actions">
              <button 
                className="btn btn-primary"
                onClick={() => addToCart(item.candle)}
                disabled={item.candle.stock_quantity === 0}
              >
                Add to Cart
              </button>
              <button className="btn btn-secondary">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <button 
          className="btn btn-danger"
          onClick={() => setWishlist([])}
          style={{ marginRight: '1rem' }}
        >
          Clear All
        </button>
        <a href="/products" className="btn btn-primary">
          Continue Shopping
        </a>
      </div>
    </div>
  );
};

export default UserWishlist; 