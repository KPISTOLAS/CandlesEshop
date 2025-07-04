-- Insert some categories
INSERT INTO categories (name, description) VALUES
('Scented', 'Candles with pleasant fragrances.'),
('Decorative', 'Candles mainly for decoration purposes.'),
('Handmade', 'Artisan handmade candles.');

-- Insert a candle
INSERT INTO candles (name, description, price, stock_quantity, weight_grams, burn_time_hours, color, scent, material, category_id)
VALUES
('Lavender Bliss', 'Relaxing lavender scented candle.', 12.99, 50, 300, 40, 'Purple', 'Lavender', 'Soy Wax', 1);

-- Insert an image
INSERT INTO candle_images (candle_id, image_url, alt_text)
VALUES (1, 'https://example.com/images/lavender-bliss.jpg', 'Lavender Bliss Candle');

-- Insert tags and link to candle
INSERT INTO tags (name) VALUES ('eco-friendly'), ('gift'), ('relaxing');

INSERT INTO candle_tags (candle_id, tag_id) VALUES
(1, 1), -- eco-friendly
(1, 2), -- gift
(1, 3); -- relaxing

INSERT INTO users (email, password_hash, full_name)
VALUES 
('john.doe@example.com', 'hashedpassword123', 'John Doe'),
('jane.smith@example.com', 'hashedpassword456', 'Jane Smith');

INSERT INTO carts (user_id)
VALUES 
(1), -- John Doe
(2); -- Jane Smith

INSERT INTO cart_items (cart_id, candle_id, quantity)
VALUES 
(1, 1, 2),
(1, 2, 1),
(2, 3, 3);
INSERT INTO wishlists (user_id, candle_id)
VALUES 
(1, 1),
(1, 3),
(2, 2);
INSERT INTO orders (user_id, status, total_amount)
VALUES 
(1, 'pending', 39.98),
(2, 'shipped', 19.99);
INSERT INTO order_items (order_id, candle_id, quantity, price_at_order)
VALUES 
(1, 1, 2, 19.99),
(2, 2, 1, 19.99);
INSERT INTO reviews (user_id, candle_id, rating, comment)
VALUES 
(1, 1, 5, 'Loved the scent! Highly recommended.'),
(2, 2, 4, 'Nice quality, but a bit smaller than expected.');
INSERT INTO addresses (user_id, type, street, city, state, postal_code, country)
VALUES 
(1, 'shipping', '123 Maple Street', 'Springfield', 'IL', '62704', 'USA'),
(1, 'billing', '456 Oak Avenue', 'Springfield', 'IL', '62704', 'USA'),
(2, 'shipping', '789 Pine Road', 'Boston', 'MA', '02115', 'USA');
INSERT INTO payment_methods (user_id, card_last4, card_brand, expiry_month, expiry_year)
VALUES 
(1, '1234', 'Visa', 12, 2026),
(2, '5678', 'MasterCard', 6, 2025);
INSERT INTO notifications (user_id, title, message)
VALUES 
(1, 'Order Shipped', 'Your order #1 has been shipped.'),
(1, 'Welcome!', 'Thanks for signing up at CandleShop!'),
(2, 'Order Delivered', 'Your order #2 has been delivered.');
INSERT INTO user_tokens (user_id, token, type, expires_at)
VALUES 
(1, 'reset-token-abc123', 'password_reset', NOW() + INTERVAL '1 hour'),
(2, 'verify-token-xyz789', 'email_verification', NOW() + INTERVAL '1 day');
