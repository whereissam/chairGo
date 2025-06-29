# ChairGo API - Cloudflare Workers Backend

A modern admin system API built with Hono for Cloudflare Workers, featuring authentication and product management.

## 🚀 Features

- **Authentication**: JWT-based admin login system
- **Product Management**: Full CRUD operations for products
- **User Management**: Admin user management
- **Database**: Cloudflare D1 SQL database
- **Security**: Password hashing with bcrypt
- **Validation**: Input validation with Zod

## 🛠️ Tech Stack

- **Framework**: Hono (Fast web framework for Cloudflare Workers)
- **Database**: Cloudflare D1 (SQLite-compatible)
- **Authentication**: JWT + bcryptjs
- **Validation**: Zod
- **Runtime**: Cloudflare Workers

## 📦 Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Cloudflare

1. Install Wrangler CLI:
```bash
npm install -g wrangler
```

2. Login to Cloudflare:
```bash
wrangler login
```

### 3. Create D1 Database

```bash
# Create the database
wrangler d1 create chairgo-database

# Update wrangler.toml with the database ID returned
```

### 4. Initialize Database

```bash
# Run the schema
wrangler d1 execute chairgo-database --file=./schema.sql

# For local development
wrangler d1 execute chairgo-database --local --file=./schema.sql
```

### 5. Environment Variables

Set up your environment variables in Cloudflare Workers dashboard:

- `JWT_SECRET`: Your JWT secret key (generate a secure random string)

Or add to wrangler.toml:
```toml
[vars]
JWT_SECRET = "your-super-secret-jwt-key-here"
```

## 🚀 Development

### Local Development

```bash
npm run dev
```

This starts the development server with hot reload.

### Build

```bash
npm run build
```

### Deploy

```bash
npm run deploy
```

## 📚 API Endpoints

### Authentication

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Create admin user (admin only)
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (client-side)

### Products

- `GET /api/products` - Get all products (public)
- `GET /api/products/:id` - Get single product (public)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Admin

- `GET /api/admin/dashboard` - Dashboard stats (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users/:id/role` - Update user role (admin only)
- `DELETE /api/admin/users/:id` - Delete user (admin only)
- `GET /api/admin/products/stats` - Product statistics (admin only)
- `POST /api/admin/products/bulk-update` - Bulk update products (admin only)

## 🔒 Default Admin Account

**Username**: admin  
**Email**: admin@chairgo.com  
**Password**: admin123

**⚠️ Important**: Change these credentials immediately after first login in production!

## 🗃️ Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email
- `password` - Hashed password
- `role` - User role (admin/user)
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

### Products Table
- `id` - Primary key
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `category` - Product category
- `image_url` - Product image URL
- `stock_quantity` - Stock quantity
- `is_featured` - Featured flag
- `tags` - JSON array of tags
- `created_at` - Creation timestamp
- `updated_at` - Update timestamp

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt (12 rounds)
- Role-based access control
- Input validation with Zod
- CORS configuration
- SQL injection protection

## 🌐 Deployment

The API is designed to be deployed to Cloudflare Workers:

1. Configure your `wrangler.toml`
2. Set up D1 database
3. Configure environment variables
4. Run `npm run deploy`

## 🛠️ Development Tips

### Testing API Locally

```bash
# Start local server
npm run dev

# Test endpoints
curl http://localhost:8787/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Database Management

```bash
# View database schema
wrangler d1 info chairgo-database

# Execute SQL commands
wrangler d1 execute chairgo-database --command="SELECT * FROM users;"

# Reset database (development only)
wrangler d1 execute chairgo-database --file=./schema.sql
```

## 📝 License

This project is private and proprietary.