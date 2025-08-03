# Island Trails

A travel package booking system built with PHP, featuring user authentication, package management, and booking functionality.

## 🚀 Technologies Used

- **Backend**: PHP 7.4+
- **Database**: MySQL
- **Authentication**: JWT (JSON Web Tokens)
- **Dependencies**: Firebase JWT library

## �️ Quick Start

### Prerequisites
- PHP 7.4+
- MySQL 5.7+
- Composer

### Installation & Setup

1. **Clone repository**
   ```bash
   git clone https://github.com/Sanjeewa-Liyanage/island-trails.git
   cd island-trails
   ```

2. **Install dependencies with Composer**
   ```bash
   composer install
   ```
   If you don't have Composer installed:
   ```bash
   # Download and install Composer
   curl -sS https://getcomposer.org/installer | php
   php composer.phar install
   ```

3. **Database configuration**

    `src/database/connection.php` 

4. **Run the application**
   ```bash
   # Using PHP built-in development server
   php -S localhost:8000
   ```
   Then access: `http://localhost:8000`

## 🔧 API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Packages:**
- `GET /api/packages` - Get all packages
- `POST /api/packages` - Create package (admin)

**Bookings:**
- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking

## 🔐 Authentication

Include JWT token in header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 📋 Important Notes

- Update JWT secret in `src/utils/JwtHandler.php`
- Configure database in `src/database/connection.php`
- Ensure PHP has PDO MySQL extension enabled

## 👨‍💻 Author

Sanjeewa Liyanage - [@Sanjeewa-Liyanage](https://github.com/Sanjeewa-Liyanage)
