-- YemCart Database Schema with RLS
-- This SQL script creates all necessary tables for the YemCart SaaS platform
-- with Row Level Security (RLS) enabled to ensure data isolation between stores

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL CHECK (role IN ('admin', 'seller', 'customer')),
    phone TEXT UNIQUE,
    email TEXT UNIQUE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read/update their own data
CREATE POLICY "Users can manage their own data" ON users
    FOR ALL USING (auth.uid() = id);

-- Policy: Admins can read all users
CREATE POLICY "Admins can read all users" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM users u
            WHERE u.id = auth.uid() AND u.role = 'admin'
        )
    );

-- Stores table
CREATE TABLE stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    banner_url TEXT,
    primary_color TEXT DEFAULT '#DC2626', -- Red primary
    about_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on stores table
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can manage their stores
CREATE POLICY "Store owners can manage their stores" ON stores
    FOR ALL USING (auth.uid() = owner_id);

-- Policy: Everyone can read stores (for storefront)
CREATE POLICY "Everyone can read stores" ON stores
    FOR SELECT USING (true);

-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    sku TEXT,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    category TEXT,
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can manage their products
CREATE POLICY "Store owners can manage their products" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s
            WHERE s.id = products.store_id AND s.owner_id = auth.uid()
        )
    );

-- Policy: Everyone can read products (for storefront)
CREATE POLICY "Everyone can read products" ON products
    FOR SELECT USING (true);

-- Product images table
CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on product_images table
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can manage their product images
CREATE POLICY "Store owners can manage their product images" ON product_images
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM products p
            JOIN stores s ON p.store_id = s.id
            WHERE p.id = product_images.product_id AND s.owner_id = auth.uid()
        )
    );

-- Policy: Everyone can read product images (for storefront)
CREATE POLICY "Everyone can read product images" ON product_images
    FOR SELECT USING (true);

-- Shipping zones table
CREATE TABLE shipping_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    city_name TEXT NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on shipping_zones table
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can manage their shipping zones
CREATE POLICY "Store owners can manage their shipping zones" ON shipping_zones
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM stores s
            WHERE s.id = shipping_zones.store_id AND s.owner_id = auth.uid()
        )
    );

-- Policy: Everyone can read shipping zones (for storefront)
CREATE POLICY "Everyone can read shipping zones" ON shipping_zones
    FOR SELECT USING (true);

-- Insert default shipping zones for Yemen cities
INSERT INTO shipping_zones (store_id, city_name, delivery_fee) VALUES
-- Note: This will be inserted per store when store is created
-- Example defaults:
-- ('store-uuid', 'صنعاء', 1000),
-- ('store-uuid', 'عدن', 1500),
-- ('store-uuid', 'تعز', 1200),
-- ('store-uuid', 'إب', 500);

-- Orders table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    total_amount NUMERIC(10,2) NOT NULL CHECK (total_amount >= 0),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled')),
    shipping_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    city TEXT NOT NULL,
    manual_address TEXT NOT NULL,
    payment_method TEXT NOT NULL DEFAULT 'COD' CHECK (payment_method IN ('COD')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can read orders for their store
CREATE POLICY "Store owners can read their store orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM stores s
            WHERE s.id = orders.store_id AND s.owner_id = auth.uid()
        )
    );

-- Policy: Customers can read/update their own orders
CREATE POLICY "Customers can manage their own orders" ON orders
    FOR ALL USING (auth.uid() = customer_id);

-- Order items table
CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time NUMERIC(10,2) NOT NULL CHECK (price_at_time >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Store owners can read order items for their store orders
CREATE POLICY "Store owners can read their store order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o
            JOIN stores s ON o.store_id = s.id
            WHERE o.id = order_items.order_id AND s.owner_id = auth.uid()
        )
    );

-- Policy: Customers can read their own order items
CREATE POLICY "Customers can read their own order items" ON order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id AND o.customer_id = auth.uid()
        )
    );

-- Messages table (Chat)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on messages table
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read messages where they are sender or receiver and related to their store
CREATE POLICY "Users can read their messages" ON messages
    FOR SELECT USING (
        auth.uid() = sender_id OR auth.uid() = receiver_id
    );

-- Policy: Users can insert messages
CREATE POLICY "Users can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        EXISTS (
            SELECT 1 FROM stores s
            WHERE s.id = messages.store_id AND (
                s.owner_id = auth.uid() OR
                EXISTS (SELECT 1 FROM orders o WHERE o.store_id = s.id AND o.customer_id = auth.uid())
            )
        )
    );

-- Indexes for performance
CREATE INDEX idx_stores_slug ON stores(slug);
CREATE INDEX idx_products_store_id ON products(store_id);
CREATE INDEX idx_product_images_product_id ON product_images(product_id);
CREATE INDEX idx_shipping_zones_store_id ON shipping_zones(store_id);
CREATE INDEX idx_orders_store_id ON orders(store_id);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_messages_store_id ON messages(store_id);
CREATE INDEX idx_messages_sender_receiver ON messages(sender_id, receiver_id);