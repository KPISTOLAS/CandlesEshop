# Candle Shop API

A comprehensive FastAPI-based e-commerce platform for managing a candle shop with both user-facing and admin functionalities.

## 🚀 Features

### Core Features
- **Product Management**: Complete CRUD operations for candles, categories, tags, and images
- **User Management**: User profiles, addresses, payment methods, and wishlists
- **Order Management**: Order tracking, status updates, and order history
- **Review System**: Customer reviews and ratings for products
- **Notification System**: User notifications and communication
- **Search & Filtering**: Product search by name/scent and filtering by tags
- **Analytics Dashboard**: Sales analytics, inventory insights, and business metrics

### API Versions
- **v1**: Basic candle operations (public endpoints)
- **v2**: Enhanced features with admin and user-specific endpoints
- **Admin API**: Comprehensive admin panel with API key authentication

## 📋 API Endpoints

### Authentication
All admin endpoints require an API key in the `X-API-Key` header.

### Public Endpoints (v1)

#### Candles
```http
GET /candles/v1/                    # List all candles
GET /candles/v1/{candle_id}         # Get specific candle
POST /candles/v1/                   # Create candle (requires API key)
DELETE /candles/v1/deleteid/{id}    # Delete candle (requires API key)
```

### User Endpoints (v2)

#### Product Browsing
```http
GET /user/candles/v2/                           # List all candles
GET /user/candles/v2/{candle_id}                # Get specific candle
GET /user/candles/v2/categories/                # List categories
GET /user/candles/v2/tags/                      # List tags
GET /user/candles/v2/search/?query=vanilla      # Search candles
GET /user/candles/v2/by_tag/{tag_id}            # Get candles by tag
```

#### User Management
```http
GET /user/candles/users/{user_id}               # Get user profile
PUT /user/candles/users/{user_id}               # Update user profile
GET /user/candles/users/{user_id}/addresses     # Get user addresses
POST /user/candles/users/{user_id}/addresses    # Add user address
GET /user/candles/users/{user_id}/orders        # Get user orders
```

#### Wishlist Management
```http
GET /user/candles/users/{user_id}/wishlist      # Get user wishlist
POST /user/candles/users/{user_id}/wishlist/{candle_id}    # Add to wishlist
DELETE /user/candles/users/{user_id}/wishlist/{candle_id}  # Remove from wishlist
```

#### Notifications
```http
GET /user/candles/users/{user_id}/notifications             # Get user notifications
PUT /user/candles/users/{user_id}/notifications/{id}/read   # Mark as read
```

### Admin Endpoints (v2)

#### Dashboard & Analytics
```http
GET /admin/candles/v2/dashboard/stats           # Get dashboard statistics
GET /admin/candles/v2/analytics/sales?days=30   # Get sales analytics
GET /admin/candles/v2/analytics/inventory       # Get inventory analytics
```

#### Product Management

**Candles**
```http
POST /admin/candles/v2/                         # Create candle
GET /admin/candles/v2/?skip=0&limit=10          # List candles
GET /admin/candles/v2/{candle_id}               # Get candle
PUT /admin/candles/v2/{candle_id}               # Update candle
DELETE /admin/candles/v2/deleteid/{candle_id}   # Delete candle
```

**Categories**
```http
POST /admin/candles/v2/categories/              # Create category
GET /admin/candles/v2/categories/               # List categories
PUT /admin/candles/v2/categories/{id}           # Update category
DELETE /admin/candles/v2/categories/{id}        # Delete category
```

**Tags**
```http
POST /admin/candles/v2/tags/                    # Create tag
GET /admin/candles/v2/tags/                     # List tags
DELETE /admin/candles/v2/tags/{id}              # Delete tag
```

**Images**
```http
POST /admin/candles/v2/images/                  # Create candle image
GET /admin/candles/v2/images/candle/{id}        # Get candle images
DELETE /admin/candles/v2/images/{id}            # Delete image
```

#### User Management
```http
GET /admin/candles/v2/users/?skip=0&limit=10    # List users
GET /admin/candles/v2/users/{user_id}           # Get user
DELETE /admin/candles/v2/users/{user_id}        # Delete user
GET /admin/candles/v2/users/{user_id}/addresses # Get user addresses
GET /admin/candles/v2/users/{user_id}/payment-methods  # Get payment methods
```

#### Order Management
```http
GET /admin/candles/v2/orders/?skip=0&limit=10   # List orders
GET /admin/candles/v2/orders/{order_id}         # Get order
PUT /admin/candles/v2/orders/{order_id}/status?status=shipped  # Update status
GET /admin/candles/v2/orders/{order_id}/items   # Get order items
```

#### Review Management
```http
GET /admin/candles/v2/reviews/?skip=0&limit=10  # List reviews
DELETE /admin/candles/v2/reviews/{id}           # Delete review
```

#### Notification Management
```http
GET /admin/candles/v2/notifications/?skip=0&limit=10  # List notifications
POST /admin/candles/v2/notifications/           # Create notification
```

#### User Token Management
```http
GET /admin/candles/v2/user-tokens/?skip=0&limit=10  # List user tokens
```

## 📊 Database Schema

The system includes comprehensive tables for:

### Products
- `candles` - Main product table with details like price, stock, weight, burn time
- `categories` - Product categorization
- `tags` - Product tags for filtering
- `candle_images` - Product images
- `candle_tags` - Many-to-many relationship between candles and tags

### Users
- `users` - User accounts with profile information
- `addresses` - User shipping/billing addresses
- `payment_methods` - User payment information
- `wishlists` - User wishlist items

### Orders
- `orders` - Order headers with status and totals
- `order_items` - Individual items in orders
- `carts` - Shopping cart functionality
- `cart_items` - Items in shopping carts

### Reviews & Communication
- `reviews` - Product reviews and ratings
- `notifications` - User notifications
- `user_tokens` - Authentication and verification tokens

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- PostgreSQL database
- pip package manager

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd candles
```

2. **Install dependencies**
```bash
pip install -r requirements.txt
```

3. **Set up the database**
```bash
# Run the SQL scripts in order:
psql -d your_database -f sql/tables.sql
psql -d your_database -f sql/insert.sql
psql -d your_database -f sql/automations.sql
```

4. **Configure the API key**
Edit `app/dependencies.py` and update the `API_KEY` variable:
```python
API_KEY = "your_secure_api_key_here"
```

5. **Run the application**
```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## 🧪 Testing

Use the provided `test_main.http` file to test all endpoints:

1. **Update the API key** in the test file:
```http
@api_key = your_actual_api_key_here
```

2. **Update the base URL** if running on a different port

3. **Test endpoints in logical order**:
   - Create resources before reading/updating/deleting
   - Test admin endpoints with proper authentication
   - Verify user endpoints work without authentication

### Example Test Flow
```http
# 1. Test basic connectivity
GET http://127.0.0.1:8000/

# 2. Create a category
POST http://localhost:8000/admin/candles/v2/categories/
X-API-Key: {{api_key}}
Content-Type: application/json

{
    "name": "Seasonal",
    "description": "Seasonal and holiday candles"
}

# 3. Create a candle
POST http://localhost:8000/admin/candles/v2/
X-API-Key: {{api_key}}
Content-Type: application/json

{
    "name": "Vanilla Dream",
    "description": "Sweet vanilla scented candle",
    "price": 15.99,
    "stock_quantity": 25,
    "weight_grams": 250,
    "burn_time_hours": 35,
    "color": "Cream",
    "scent": "Vanilla",
    "material": "Soy Wax",
    "category_id": 1
}

# 4. Browse candles (public endpoint)
GET http://localhost:8000/user/candles/v2/
```

## 🔒 Security Features

- **API Key Authentication**: All admin endpoints require a valid API key
- **Input Validation**: Pydantic models ensure data integrity
- **SQL Injection Protection**: SQLAlchemy ORM prevents injection attacks
- **Proper Error Handling**: HTTP status codes and meaningful error messages
- **Rate Limiting**: Consider implementing for production use

## 📈 Business Logic

The system includes several automated features:
- Automatic cart creation for new users
- Welcome notifications for new users
- Order total calculation triggers
- Updated timestamp management
- Unique constraints and referential integrity

## 🚨 Error Handling

All endpoints return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No content (for deletions)
- `400` - Bad request
- `401` - Unauthorized (invalid API key)
- `404` - Not found
- `422` - Validation error

## 📝 API Documentation

Once the server is running, you can access:
- **Interactive API docs**: `http://localhost:8000/docs`
- **ReDoc documentation**: `http://localhost:8000/redoc`

## 🔧 Configuration

### Environment Variables
Consider moving the API key to environment variables for production:
```python
import os
API_KEY = os.getenv("API_KEY", "default_key")
```

### Database Configuration
Update the database connection in `app/database.py` for your PostgreSQL setup.

## 🚀 Production Deployment

For production deployment, consider:
1. **Environment Variables**: Move sensitive data to environment variables
2. **Database Security**: Use connection pooling and proper credentials
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Logging**: Add comprehensive logging
5. **Monitoring**: Set up health checks and monitoring
6. **HTTPS**: Use SSL/TLS certificates
7. **CORS**: Configure CORS policies appropriately

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the API documentation at `/docs`
- Review the test examples in `test_main.http`
- Ensure your database is properly configured
- Verify your API key is correctly set 
