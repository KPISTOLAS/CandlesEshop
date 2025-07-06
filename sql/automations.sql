CREATE OR REPLACE FUNCTION update_order_total()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE orders
    SET total_amount = (
        SELECT COALESCE(SUM(quantity * price_at_order), 0)
        FROM order_items
        WHERE order_id = NEW.order_id
    )
    WHERE id = NEW.order_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_order_total
AFTER INSERT OR UPDATE OR DELETE ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_order_total();

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_updated_at
BEFORE UPDATE ON candles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

ALTER TABLE carts
ADD CONSTRAINT unique_user_cart UNIQUE(user_id);

CREATE VIEW cart_summary AS
SELECT
    c.user_id,
    ci.cart_id,
    SUM(ci.quantity) AS total_items
FROM cart_items ci
JOIN carts c ON c.id = ci.cart_id
GROUP BY c.user_id, ci.cart_id;

CREATE OR REPLACE FUNCTION create_cart_after_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO carts(user_id) VALUES (NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_create_cart_after_user
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_cart_after_user();

CREATE OR REPLACE FUNCTION create_welcome_notification()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO notifications(user_id, title, message)
    VALUES (NEW.id, 'Welcome!', 'Thanks for joining CandleShop!');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_welcome_notification
AFTER INSERT ON users
FOR EACH ROW
EXECUTE FUNCTION create_welcome_notification();
