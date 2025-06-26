# 📁 Project Structure

This document outlines the structure and organization of the IT Asset Management System.

## 🏗️ Root Directory

```
it-asset-management/
├── prisma/                 # Database schema and migrations
├── public/                 # Static assets
├── src/                    # Source code
├── .env.local             # Environment variables (not in repo)
├── .gitignore             # Git ignore rules
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
├── README.md              # Project documentation
├── next.config.js         # Next.js configuration
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🗄️ Database (`/prisma/`)

```
prisma/
├── schema.prisma          # Database schema definition
├── seed.ts               # Database seeding script
└── migrations/           # Database migration files
```

### Key Models
- **User** - System users with roles
- **Asset** - IT assets and equipment
- **Department** - Organizational units
- **Branch** - Physical locations
- **AssetAssignment** - User-asset relationships
- **GatePass** - Asset movement tracking
- **AssetMovement** - Audit trail

## 🎨 Public Assets (`/public/`)

```
public/
├── favicon.ico           # Browser favicon
├── varsity-logo.svg      # Main company logo
└── varsity-logo-compact.svg # Compact logo for sidebar
```

## 💻 Source Code (`/src/`)

### App Router (`/src/app/`)

```
app/
├── api/                  # API endpoints
├── assets/              # Asset management pages
├── branches/            # Branch management
├── dashboard/           # Dashboard page
├── departments/         # Department management
├── gate-pass/           # Gate pass system
├── inventory/           # Inventory management
├── login/               # Authentication
├── movements/           # Asset movements
├── reports/             # Reporting system
├── users/               # User management
├── globals.css          # Global styles
├── layout.tsx           # Root layout
└── page.tsx             # Home page
```

### API Routes (`/src/app/api/`)

```
api/
├── assets/              # Asset CRUD operations
│   ├── [id]/           # Individual asset operations
│   ├── assign/         # Asset assignment
│   ├── export/         # Asset export
│   ├── import/         # Asset import
│   ├── return/         # Asset return
│   └── template/       # CSV template
├── auth/               # Authentication
│   ├── login/          # User login
│   └── logout/         # User logout
├── branches/           # Branch management
├── dashboard/          # Dashboard data
├── departments/        # Department management
├── gate-pass/          # Gate pass operations
├── reports/            # Report generation
└── users/              # User management
```

### Components (`/src/components/`)

```
components/
├── Layout.tsx           # Main application layout
├── AddDepartmentModal.tsx # Department creation modal
└── EditDepartmentModal.tsx # Department editing modal
```

### Libraries (`/src/lib/`)

```
lib/
├── auth.ts             # Authentication utilities
├── prisma.ts           # Database connection
├── session.ts          # Session management
├── asset-types.ts      # Asset type definitions
└── email.ts            # Email utilities
```

### Middleware (`/src/middleware.ts`)
- Route protection
- Authentication verification
- Request/response processing

## 🎯 Key Features by Directory

### `/assets/` - Asset Management
- Asset listing and search
- Add/edit asset forms
- Asset details view
- Bulk import functionality

### `/gate-pass/` - Gate Pass System
- Create gate passes
- Track asset movements
- Print functionality
- Hardware engineer details

### `/reports/` - Reporting System
- Stock inventory reports
- Asset-wise analysis
- Financial reports
- Export capabilities (PDF, Excel, CSV)

### `/dashboard/` - Analytics
- Real-time statistics
- Visual charts
- Recent activity
- Quick actions

### `/users/` - User Management
- User listing
- Role assignment
- Department association
- User profiles

### `/departments/` - Department Management
- Department hierarchy
- User assignments
- Asset allocation

### `/branches/` - Branch Management
- Multi-location support
- Branch-specific inventory
- Location tracking

## 🔧 Configuration Files

### `next.config.js`
- Next.js framework configuration
- Build optimization
- Environment variables

### `tailwind.config.js`
- Tailwind CSS customization
- Color schemes
- Component styles

### `tsconfig.json`
- TypeScript compiler options
- Path mapping
- Type checking rules

### `package.json`
- Project dependencies
- Build scripts
- Development tools

## 🚀 Development Workflow

### 1. Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### 2. Database Operations
```bash
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema changes
npx prisma db seed   # Seed database
```

### 3. Code Quality
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 📊 Data Flow

1. **User Request** → Middleware → Route Handler
2. **API Route** → Prisma → Database
3. **Database** → Prisma → API Response
4. **Frontend** → API Call → State Update → UI Render

## 🔐 Security Layers

- **Middleware**: Route protection and authentication
- **API Routes**: Input validation and authorization
- **Database**: Prisma ORM with type safety
- **Frontend**: Role-based UI rendering

This structure ensures maintainability, scalability, and clear separation of concerns throughout the application.
