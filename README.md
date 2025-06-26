# 🏢 IT Asset Management System

<div align="center">

![IT Asset Management](https://img.shields.io/badge/IT%20Asset-Management-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEyIDJMMTMuMDkgOC4yNkwyMCA5TDEzLjA5IDE1Ljc0TDEyIDIyTDEwLjkxIDE1Ljc0TDQgOUwxMC45MSA4LjI2TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K)
![Next.js](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-3.0-003B57?style=for-the-badge&logo=sqlite)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**A comprehensive, modern web application for managing IT assets, tracking movements, and handling departmental assignments for institutions and organizations.**

*Built with cutting-edge technologies and designed for scalability, security, and ease of use.*

---

### 💖 Support This Project

If this project helps your organization, consider supporting its development:

[![Sponsor](https://img.shields.io/badge/Sponsor-❤️-ff69b4?style=for-the-badge)](https://github.com/sponsors/vallururavi27)
[![PayPal](https://img.shields.io/badge/PayPal-00457C?style=for-the-badge&logo=paypal&logoColor=white)](https://paypal.me/vallururavi27)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/vallururavi27)
[![Ko-Fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/vallururavi27)

*Your support helps maintain this free, open-source project and enables continuous improvements.*

</div>

---

## 🚀 Features

### Core Asset Management
- **Asset Registration**: Add new hardware and software assets with detailed information
- **Purchase Invoice Tracking**: Track vendor information and invoice numbers for all assets
- **Inward/Outward Tracking**: Track asset movements with supplier and recipient details
- **Assignment Management**: Assign assets to departments and individuals
- **Return Processing**: Handle asset returns with proper inventory updates
- **Gate Pass System**: Secure asset transfer with hardware engineer details and print functionality
- **Bulk Import/Export**: CSV-based asset import and export capabilities

### User Management
- **Secure Authentication**: JWT-based authentication system
- **Role-based Access Control**: Admin, Manager, and User roles with different permissions
- **Department Management**: Organize users by departments
- **User Registration**: Easy user registration and management system

### Software License Management
- **License Tracking**: Monitor software licenses and usage
- **Compliance Monitoring**: Track license expiry and availability
- **Cost Management**: Monitor per-license costs and total expenditure

### Professional Interface
- **Modern Design**: Clean and professional interface design
- **Customizable Branding**: Easy to customize with your organization's branding
- **Responsive Design**: Mobile-friendly interface with professional appearance
- **Print-ready Documents**: Professional formatting for gate passes and reports

### Advanced Reporting System
- **Stock Inventory Reports**: Total stock in store, available vs assigned assets, location-wise distribution
- **Asset-wise Analysis**: Asset utilization, depreciation calculations, and performance metrics
- **Financial Reports**: Cost analysis, purchase trends, and department-wise cost center analysis
- **Export Options**: PDF, Excel, and CSV export formats with print functionality
- **Low Stock Alerts**: Automated alerts for assets with low quantity levels

### Dashboard & Analytics
- **Real-time Statistics**: Overview of assets, users, and departments
- **Recent Activity**: Track recent asset movements
- **Warranty Alerts**: Monitor upcoming warranty expirations
- **Visual Charts**: Asset distribution by category and status

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (free, no external dependencies)
- **Authentication**: JWT with HTTP-only cookies
- **UI Components**: Headless UI, Heroicons
- **Charts**: Recharts for data visualization

## 📋 Prerequisites

- Node.js 18+
- npm or yarn package manager

## 🚀 Quick Start

1. **Clone and Install**
   ```bash
   cd it-asset-management
   npm install
   ```

2. **Setup Database**
   ```bash
   # Generate Prisma client and create database
   npx prisma generate
   npx prisma db push

   # Seed with sample data
   npm run db:seed
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Application**
   - Open http://localhost:3000
   - Login with provided credentials

## 🔐 Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | admin123 |
| IT Manager | manager@example.com | manager123 |
| User | user@example.com | user123 |

## 📊 Database Schema

### Core Tables
- **Users**: User accounts with roles and department assignments
- **Departments**: Organizational departments with managers
- **Assets**: Hardware and software assets with detailed metadata
- **Asset Assignments**: Track which assets are assigned to whom
- **Asset Movements**: Log all inward/outward asset movements
- **Software Licenses**: Manage software licenses and usage

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Assets
- `GET /api/assets` - List assets with filtering and pagination
- `POST /api/assets` - Create new asset
- `GET /api/assets/[id]` - Get asset details
- `PUT /api/assets/[id]` - Update asset
- `DELETE /api/assets/[id]` - Delete asset
- `POST /api/assets/assign` - Assign asset to user
- `POST /api/assets/return` - Return assigned asset

### Management
- `GET /api/departments` - List departments
- `GET /api/users` - List users
- `GET /api/software-licenses` - List software licenses
- `GET /api/dashboard/stats` - Dashboard statistics

## 🎯 Key Benefits

### Accurate Inventory Management
- Real-time tracking of all IT assets
- Automated quantity management
- Comprehensive asset history

### Efficient Resource Allocation
- Easy assignment and return processes
- Department-wise asset distribution
- User-specific asset tracking

### Cost Management
- Purchase cost tracking
- Software license cost monitoring
- Warranty expiry alerts

### Compliance & Reporting
- Software license compliance
- Asset movement audit trail
- Comprehensive reporting capabilities

## 🔒 Security Features

- JWT-based authentication
- Role-based access control
- HTTP-only cookies for token storage
- Input validation and sanitization
- Secure password hashing with bcrypt

## 📱 Responsive Design

- Mobile-friendly interface
- Responsive dashboard layouts
- Touch-friendly controls
- Optimized for all screen sizes

## 🚀 Deployment

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
npm start
```

### Database Management
```bash
# Reset database and reseed
npm run db:reset

# Seed database only
npm run db:seed
```

## 📈 Future Enhancements

- Asset barcode/QR code scanning
- Email notifications for warranty expiry
- Advanced reporting and analytics
- Asset maintenance scheduling
- Integration with procurement systems
- Mobile app for asset tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Examine the database schema
- Test with provided sample data

---

**Built with ❤️ for efficient IT asset management**
