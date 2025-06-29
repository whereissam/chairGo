-- Users table for admin authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL CHECK (price > 0),
  category TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_featured BOOLEAN DEFAULT FALSE,
  tags TEXT, -- JSON array of tags
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_stock ON products(stock_quantity);

-- Insert default admin user (password: admin123)
-- Note: This should be changed in production
INSERT OR IGNORE INTO users (username, email, password, role) 
VALUES (
  'admin', 
  'admin@chairgo.com', 
  '$2a$12$rOKvVFXuT3/XZ9Z9Z9Z9ZOQ9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z',
  'admin'
);

-- Insert sample products
INSERT OR IGNORE INTO products (name, description, price, category, stock_quantity, is_featured) VALUES
('Modern Office Chair', 'Ergonomic office chair with lumbar support', 299.99, 'office', 25, TRUE),
('Vintage Dining Chair', 'Classic wooden dining chair with cushioned seat', 149.99, 'dining', 15, FALSE),
('Luxury Recliner', 'Premium leather recliner with massage function', 899.99, 'living-room', 8, TRUE),
('Folding Chair Set', 'Set of 4 lightweight folding chairs', 79.99, 'outdoor', 30, FALSE),
('Executive Desk Chair', 'High-back executive chair with armrests', 449.99, 'office', 12, FALSE);