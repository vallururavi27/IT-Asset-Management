import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create departments for VARSITY EDIFICATION MANAGEMENT PRIVATE LIMITED
  const itDept = await prisma.department.create({
    data: {
      name: 'Information Technology',
      description: 'IT Department - Technology infrastructure and digital systems'
    }
  })

  const adminDept = await prisma.department.create({
    data: {
      name: 'Administration',
      description: 'Administrative Department - General management and operations'
    }
  })

  const academicDept = await prisma.department.create({
    data: {
      name: 'Academic Affairs',
      description: 'Academic Department - Educational programs and curriculum'
    }
  })

  const financeDept = await prisma.department.create({
    data: {
      name: 'Finance & Accounts',
      description: 'Finance Department - Financial management and accounting'
    }
  })

  // Create admin user for VARSITY EDIFICATION MANAGEMENT
  const adminPassword = await bcrypt.hash('varsity@2024', 12)
  const admin = await prisma.user.create({
    data: {
      email: 'ravi.v@varsitymgmt.com',
      password: adminPassword,
      fullName: 'Ravi Kumar Valluru',
      role: 'ADMIN',
      departmentId: itDept.id
    }
  })

  // Create IT manager
  const managerPassword = await bcrypt.hash('itmanager@2024', 12)
  const manager = await prisma.user.create({
    data: {
      email: 'it.manager@varsitymgmt.com',
      password: managerPassword,
      fullName: 'IT Manager',
      role: 'MANAGER',
      departmentId: itDept.id
    }
  })

  // Create store managers
  const storeManagerPassword = await bcrypt.hash('storemanager@2024', 12)

  const storeManager1 = await prisma.user.create({
    data: {
      email: 'store.manager1@varsitymgmt.com',
      password: storeManagerPassword,
      fullName: 'Store Manager - Main Campus',
      role: 'MANAGER',
      isActive: true
    }
  })

  const storeManager2 = await prisma.user.create({
    data: {
      email: 'store.manager2@varsitymgmt.com',
      password: storeManagerPassword,
      fullName: 'Store Manager - Branch Campus',
      role: 'MANAGER',
      isActive: true
    }
  })

  const storeManager3 = await prisma.user.create({
    data: {
      email: 'store.manager3@varsitymgmt.com',
      password: storeManagerPassword,
      fullName: 'Store Manager - IT Department',
      role: 'MANAGER',
      isActive: true
    }
  })

  // Create academic staff user
  const userPassword = await bcrypt.hash('academic@2024', 12)
  const user = await prisma.user.create({
    data: {
      email: 'academic.staff@varsitymgmt.com',
      password: userPassword,
      fullName: 'Academic Staff',
      role: 'USER',
      departmentId: academicDept.id
    }
  })

  // Update department managers
  await prisma.department.update({
    where: { id: itDept.id },
    data: { managerId: manager.id }
  })

  // Create comprehensive hardware assets

  // Computing Devices
  const laptop1 = await prisma.asset.create({
    data: {
      name: 'Dell Latitude 7420',
      description: 'Business laptop with Intel i7 processor, 16GB RAM, 512GB SSD',
      category: 'HARDWARE',
      subCategory: 'Computing Devices',
      type: 'Laptop Computer',
      serialNumber: 'DL7420001',
      model: 'Latitude 7420',
      manufacturer: 'Dell',
      purchaseDate: new Date('2023-01-15'),
      purchaseCost: 1200.00,
      warrantyExpiry: new Date('2026-01-15'),
      status: 'AVAILABLE',
      location: 'IT Storage Room',
      assetTag: 'VARSITY-LAP-001',
      condition: 'NEW',
      osVersion: 'Windows 11 Pro',
      specifications: {
        cpu: 'Intel Core i7-1165G7',
        ram: '16GB DDR4',
        storage: '512GB NVMe SSD',
        display: '14-inch FHD',
        graphics: 'Intel Iris Xe'
      },
      quantity: 1,
      availableQty: 1
    }
  })

  const desktop1 = await prisma.asset.create({
    data: {
      name: 'HP EliteDesk 800 G9',
      description: 'Business desktop computer with Intel i5 processor',
      category: 'HARDWARE',
      subCategory: 'Computing Devices',
      type: 'Desktop Computer',
      serialNumber: 'HP800G9001',
      model: 'EliteDesk 800 G9',
      manufacturer: 'HP',
      purchaseDate: new Date('2023-02-20'),
      purchaseCost: 800.00,
      warrantyExpiry: new Date('2026-02-20'),
      status: 'AVAILABLE',
      location: 'IT Storage Room',
      assetTag: 'VARSITY-DT-001',
      condition: 'NEW',
      osVersion: 'Windows 11 Pro',
      specifications: {
        cpu: 'Intel Core i5-12500',
        ram: '8GB DDR4',
        storage: '256GB SSD',
        graphics: 'Intel UHD Graphics 770'
      },
      quantity: 1,
      availableQty: 1
    }
  })

  // Server
  const server1 = await prisma.asset.create({
    data: {
      name: 'Dell PowerEdge R750',
      description: 'Rack server for virtualization and database workloads',
      category: 'HARDWARE',
      subCategory: 'Computing Devices',
      type: 'Server (Rack)',
      serialNumber: 'DPE-R750-001',
      model: 'PowerEdge R750',
      manufacturer: 'Dell',
      purchaseDate: new Date('2023-03-01'),
      purchaseCost: 5000.00,
      warrantyExpiry: new Date('2026-03-01'),
      status: 'AVAILABLE',
      location: 'Data Center Rack A1',
      assetTag: 'VARSITY-SRV-001',
      condition: 'NEW',
      osVersion: 'Windows Server 2022',
      specifications: {
        cpu: '2x Intel Xeon Silver 4314',
        ram: '64GB DDR4 ECC',
        storage: '2x 1TB NVMe SSD RAID 1',
        network: '4x 1GbE ports',
        formFactor: '2U Rack'
      },
      quantity: 1,
      availableQty: 1
    }
  })

  // Storage Devices
  const ssd1 = await prisma.asset.create({
    data: {
      name: 'Samsung 980 PRO NVMe SSD',
      description: '1TB NVMe SSD for high-performance computing',
      category: 'HARDWARE',
      subCategory: 'Storage Devices',
      type: 'SSD (NVMe)',
      serialNumber: 'SAM980PRO001',
      model: '980 PRO',
      manufacturer: 'Samsung',
      purchaseDate: new Date('2023-03-05'),
      purchaseCost: 150.00,
      warrantyExpiry: new Date('2028-03-05'),
      status: 'AVAILABLE',
      location: 'IT Storage Room',
      assetTag: 'VARSITY-SSD-001',
      condition: 'NEW',
      capacity: '1TB',
      speed: '7000 MB/s read',
      specifications: {
        interface: 'NVMe PCIe 4.0',
        formFactor: 'M.2 2280',
        capacity: '1TB',
        readSpeed: '7000 MB/s',
        writeSpeed: '5000 MB/s'
      },
      quantity: 10,
      availableQty: 10
    }
  })

  // Memory (RAM)
  const ram1 = await prisma.asset.create({
    data: {
      name: 'Corsair Vengeance LPX DDR4',
      description: '16GB DDR4 RAM module for desktop computers',
      category: 'HARDWARE',
      subCategory: 'Memory (RAM)',
      type: 'DDR4 (288-pin)',
      serialNumber: 'COR-DDR4-001',
      model: 'Vengeance LPX',
      manufacturer: 'Corsair',
      purchaseDate: new Date('2023-03-08'),
      purchaseCost: 80.00,
      warrantyExpiry: new Date('2030-03-08'),
      status: 'AVAILABLE',
      location: 'IT Storage Room',
      assetTag: 'VARSITY-RAM-001',
      condition: 'NEW',
      capacity: '16GB',
      speed: '3200 MHz',
      formFactor: 'DIMM',
      specifications: {
        type: 'DDR4',
        capacity: '16GB',
        speed: '3200 MHz',
        voltage: '1.35V',
        latency: 'CL16',
        pins: 288
      },
      quantity: 20,
      availableQty: 20
    }
  })

  // Peripherals
  const monitor = await prisma.asset.create({
    data: {
      name: 'Dell UltraSharp 27" 4K Monitor',
      description: '27-inch 4K IPS monitor with USB-C connectivity',
      category: 'HARDWARE',
      subCategory: 'Peripherals',
      type: 'Monitor (LED)',
      serialNumber: 'DU27001',
      model: 'UltraSharp U2720Q',
      manufacturer: 'Dell',
      purchaseDate: new Date('2023-03-10'),
      purchaseCost: 400.00,
      warrantyExpiry: new Date('2026-03-10'),
      status: 'AVAILABLE',
      location: 'IT Storage Room',
      assetTag: 'VARSITY-MON-001',
      condition: 'NEW',
      specifications: {
        size: '27 inches',
        resolution: '3840x2160',
        panelType: 'IPS',
        refreshRate: '60Hz',
        connectivity: ['USB-C', 'HDMI', 'DisplayPort']
      },
      quantity: 5,
      availableQty: 5
    }
  })

  // Networking Equipment
  const switch1 = await prisma.asset.create({
    data: {
      name: 'Cisco Catalyst 2960-X',
      description: '24-port managed Gigabit switch with PoE+',
      category: 'NETWORKING',
      subCategory: 'Network Infrastructure',
      type: 'Switch (Managed)',
      serialNumber: 'CIS-2960X-001',
      model: 'Catalyst 2960-X',
      manufacturer: 'Cisco',
      purchaseDate: new Date('2023-02-15'),
      purchaseCost: 800.00,
      warrantyExpiry: new Date('2026-02-15'),
      status: 'AVAILABLE',
      location: 'Network Closet A',
      assetTag: 'VARSITY-SW-001',
      condition: 'NEW',
      specifications: {
        ports: '24x 1GbE + 4x SFP+',
        poeSupport: 'PoE+ (370W)',
        stackable: true,
        management: 'Web GUI, CLI, SNMP'
      },
      quantity: 1,
      availableQty: 1
    }
  })

  const firewall1 = await prisma.asset.create({
    data: {
      name: 'Fortinet FortiGate 60F',
      description: 'Next-generation firewall for small to medium business',
      category: 'NETWORKING',
      subCategory: 'Network Infrastructure',
      type: 'Firewall (Fortinet)',
      serialNumber: 'FG-60F-001',
      model: 'FortiGate 60F',
      manufacturer: 'Fortinet',
      purchaseDate: new Date('2023-02-20'),
      purchaseCost: 500.00,
      warrantyExpiry: new Date('2026-02-20'),
      status: 'AVAILABLE',
      location: 'Network Closet A',
      assetTag: 'VARSITY-FW-001',
      condition: 'NEW',
      specifications: {
        throughput: '10 Gbps',
        vpnThroughput: '1.8 Gbps',
        ports: '7x GbE RJ45 + 1x GbE SFP',
        features: ['IPS', 'Application Control', 'Web Filtering']
      },
      quantity: 1,
      availableQty: 1
    }
  })

  // Data Center Assets
  const rack1 = await prisma.asset.create({
    data: {
      name: 'APC NetShelter SX 42U Rack',
      description: '42U server rack with side panels and PDU',
      category: 'DATACENTER',
      subCategory: 'Rack & Infrastructure',
      type: 'Server Rack (42U)',
      serialNumber: 'APC-42U-001',
      model: 'NetShelter SX',
      manufacturer: 'APC',
      purchaseDate: new Date('2023-01-10'),
      purchaseCost: 1200.00,
      warrantyExpiry: new Date('2028-01-10'),
      status: 'AVAILABLE',
      location: 'Data Center',
      assetTag: 'VARSITY-RACK-001',
      condition: 'NEW',
      specifications: {
        height: '42U',
        width: '600mm',
        depth: '1070mm',
        loadCapacity: '1361 kg',
        features: ['Removable side panels', 'Adjustable rails', 'Cable management']
      },
      quantity: 1,
      availableQty: 1
    }
  })

  // Legacy Assets
  const legacyPC = await prisma.asset.create({
    data: {
      name: 'Dell OptiPlex 755',
      description: 'Legacy desktop computer with Windows XP',
      category: 'LEGACY',
      subCategory: 'Legacy Components',
      type: 'Legacy Motherboard',
      serialNumber: 'DELL-755-001',
      model: 'OptiPlex 755',
      manufacturer: 'Dell',
      purchaseDate: new Date('2008-05-15'),
      purchaseCost: 600.00,
      warrantyExpiry: new Date('2011-05-15'),
      status: 'RETIRED',
      location: 'Storage - Legacy Equipment',
      assetTag: 'VARSITY-LEG-001',
      condition: 'OBSOLETE',
      osVersion: 'Windows XP Professional',
      specifications: {
        cpu: 'Intel Core 2 Duo E6550',
        ram: '2GB DDR2',
        storage: '160GB SATA HDD',
        note: 'End of life - kept for legacy application support'
      },
      quantity: 1,
      availableQty: 0
    }
  })

  // Create software licenses
  await prisma.softwareLicense.create({
    data: {
      softwareName: 'Microsoft Office 365',
      version: '2023',
      licenseType: 'SUBSCRIPTION',
      totalLicenses: 50,
      usedLicenses: 25,
      availableLicenses: 25,
      expiryDate: new Date('2024-12-31'),
      vendor: 'Microsoft',
      purchaseDate: new Date('2023-01-01'),
      costPerLicense: 12.50
    }
  })

  await prisma.softwareLicense.create({
    data: {
      softwareName: 'Adobe Creative Suite',
      version: '2023',
      licenseType: 'SUBSCRIPTION',
      totalLicenses: 10,
      usedLicenses: 8,
      availableLicenses: 2,
      expiryDate: new Date('2024-06-30'),
      vendor: 'Adobe',
      purchaseDate: new Date('2023-07-01'),
      costPerLicense: 52.99
    }
  })

  await prisma.softwareLicense.create({
    data: {
      softwareName: 'Windows 11 Pro',
      version: '22H2',
      licenseType: 'PERPETUAL',
      totalLicenses: 100,
      usedLicenses: 45,
      availableLicenses: 55,
      vendor: 'Microsoft',
      purchaseDate: new Date('2023-01-15'),
      costPerLicense: 199.99
    }
  })

  // Create initial asset movements (inward)
  await prisma.assetMovement.create({
    data: {
      assetId: laptop1.id,
      movementType: 'INWARD',
      quantity: 1,
      supplier: 'Dell Technologies',
      toLocation: 'IT Storage Room',
      notes: 'Initial purchase and setup',
      createdBy: admin.id
    }
  })

  await prisma.assetMovement.create({
    data: {
      assetId: desktop1.id,
      movementType: 'INWARD',
      quantity: 1,
      supplier: 'HP Inc.',
      toLocation: 'IT Storage Room',
      notes: 'Initial purchase and setup',
      createdBy: admin.id
    }
  })

  await prisma.assetMovement.create({
    data: {
      assetId: monitor.id,
      movementType: 'INWARD',
      quantity: 5,
      supplier: 'Dell Technologies',
      toLocation: 'IT Storage Room',
      notes: 'Bulk purchase for office setup',
      createdBy: admin.id
    }
  })

  // Create sample campuses
  await prisma.campus.createMany({
    data: [
      {
        name: 'Main Campus - Hyderabad',
        address: 'Survey No. 83/1, Ranga Reddy District',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '501301',
        contactPerson: 'Dr. Ravi Kumar',
        contactPhone: '+91 9876543210',
        contactEmail: 'ravi.v@varsitymgmt.com'
      },
      {
        name: 'Branch Campus - Bangalore',
        address: 'Electronic City Phase 1',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560100',
        contactPerson: 'Prof. Suresh Kumar',
        contactPhone: '+91 9876543211',
        contactEmail: 'suresh.k@varsitymgmt.com'
      }
    ]
  })

  // Create sample gate passes
  const gatePass1 = await prisma.gatePass.create({
    data: {
      gatePassNumber: 'GP-2024-0001',
      assetId: laptop1.id,
      storeManagerName: 'Rajesh Kumar',
      storeManagerEmail: 'rajesh.store@varsitymgmt.com',
      storeManagerPhone: '+91 9876543212',
      deliveryPersonName: 'Ramesh Delivery',
      deliveryPersonContact: '+91 9876543213',
      campus: 'Main Campus - Hyderabad',
      department: 'Information Technology',
      endUserName: 'Dr. Priya Sharma',
      endUserEmail: 'priya.sharma@varsitymgmt.com',
      endUserPhone: '+91 9876543214',
      purpose: 'Faculty laptop for teaching',
      status: 'DELIVERED',
      deliveredDate: new Date(),
      receivedBy: 'Dr. Priya Sharma',
      grnNumber: 'GRN-2024-001',
      grnDate: new Date(),
      createdBy: admin.id
    }
  })

  const gatePass2 = await prisma.gatePass.create({
    data: {
      gatePassNumber: 'GP-2024-0002',
      assetId: desktop1.id,
      storeManagerName: 'Rajesh Kumar',
      storeManagerEmail: 'rajesh.store@varsitymgmt.com',
      storeManagerPhone: '+91 9876543212',
      deliveryPersonName: 'Suresh Transport',
      deliveryPersonContact: '+91 9876543215',
      campus: 'Branch Campus - Bangalore',
      department: 'Computer Science',
      endUserName: 'Prof. Anil Kumar',
      endUserEmail: 'anil.kumar@varsitymgmt.com',
      endUserPhone: '+91 9876543216',
      purpose: 'Lab computer for students',
      status: 'IN_TRANSIT',
      createdBy: admin.id
    }
  })

  // Update assets with GRN numbers
  await prisma.asset.update({
    where: { id: laptop1.id },
    data: {
      grnNumber: 'GRN-2024-001',
      status: 'ASSIGNED'
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log('\n🏢 VARSITY EDIFICATION MANAGEMENT PRIVATE LIMITED')
  console.log('📋 Login credentials:')
  console.log('Admin: ravi.v@varsitymgmt.com / varsity@2024')
  console.log('IT Manager: it.manager@varsitymgmt.com / itmanager@2024')
  console.log('Academic Staff: academic.staff@varsitymgmt.com / academic@2024')
  console.log('\n📦 Sample Gate Passes Created:')
  console.log(`- ${gatePass1.gatePassNumber}: ${gatePass1.status} (GRN: ${gatePass1.grnNumber})`)
  console.log(`- ${gatePass2.gatePassNumber}: ${gatePass2.status}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
