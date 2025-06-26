# VARSITY EDIFICATION MANAGEMENT - IT Asset Management System

A comprehensive web application for managing IT assets, tracking inward/outward movements, and handling departmental/individual assignments for VARSITY EDIFICATION MANAGEMENT PRIVATE LIMITED. Built with Next.js, TypeScript, Prisma, and SQLite.

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
- **Office 365 Integration**: Authenticate users against your O365 mail server
- **Role-based Access Control**: Admin, Manager, and User roles with different permissions
- **Department Management**: Organize users by departments
- **Automatic User Creation**: New users are automatically created on first O365 login

### Software License Management
- **License Tracking**: Monitor software licenses and usage
- **Compliance Monitoring**: Track license expiry and availability
- **Cost Management**: Monitor per-license costs and total expenditure

### Professional Branding
- **Varsity Edification Logo**: Professional blue logo integration throughout the application
- **Consistent Branding**: Company tagline "Empowering Education. Enabling Dreams"
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

## 🔐 Login Credentials for VARSITY EDIFICATION MANAGEMENT

| Role | Email | Password |
|------|-------|----------|
| Admin | ravi.v@varsitymgmt.com | varsity@2024 |
| IT Manager | it.manager@varsitymgmt.com | itmanager@2024 |
| Academic Staff | academic.staff@varsitymgmt.com | academic@2024 |

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
