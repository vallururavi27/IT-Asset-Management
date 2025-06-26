// Comprehensive IT Asset Types Configuration
export const ASSET_CATEGORIES = {
  HARDWARE: {
    name: 'Hardware',
    subCategories: {
      'Computing Devices': {
        types: [
          'Desktop Computer',
          'Laptop Computer', 
          'Server (Tower)',
          'Server (Rack)',
          'Server (Blade)',
          'Virtual Machine',
          'Thin Client',
          'Workstation (CAD)',
          'Workstation (Gaming)',
          'All-in-One PC',
          'Mini PC',
          'Tablet',
          'Chromebook'
        ]
      },
      'Storage Devices': {
        types: [
          'HDD (SATA)',
          'HDD (SAS)', 
          'HDD (IDE)',
          'SSD (NVMe)',
          'SSD (SATA)',
          'SSD (M.2)',
          'NAS Device',
          'SAN Device',
          'Tape Drive (LTO)',
          'Tape Drive (DLT)',
          'CD/DVD Drive',
          'Blu-Ray Drive',
          'USB Drive',
          'External HDD',
          'Memory Card'
        ]
      },
      'Memory (RAM)': {
        types: [
          'DDR1 (184-pin)',
          'DDR2 (240-pin)',
          'DDR3 (240-pin)',
          'DDR4 (288-pin)',
          'DDR5 (288-pin)',
          'ECC RAM',
          'SODIMM (Laptop)',
          'SDRAM (Legacy)',
          'RDRAM (Legacy)',
          'Server Memory'
        ]
      },
      'Motherboards & Components': {
        types: [
          'Motherboard',
          'CPU/Processor',
          'Graphics Card',
          'Sound Card',
          'Network Card',
          'CMOS Battery',
          'Expansion Card (PCI)',
          'Expansion Card (PCIe)',
          'Expansion Card (AGP)',
          'Chipset',
          'Heat Sink',
          'CPU Cooler'
        ]
      },
      'Power Supplies': {
        types: [
          'PSU (80+ Bronze)',
          'PSU (80+ Silver)',
          'PSU (80+ Gold)',
          'PSU (80+ Platinum)',
          'UPS (APC)',
          'UPS (CyberPower)',
          'UPS (Other)',
          'PDU (Rack)',
          'Power Cable',
          'Battery Backup'
        ]
      },
      'Peripherals': {
        types: [
          'Monitor (LCD)',
          'Monitor (LED)',
          'Monitor (CRT)',
          'Monitor (OLED)',
          'Keyboard (USB)',
          'Keyboard (PS/2)',
          'Mouse (USB)',
          'Mouse (PS/2)',
          'Printer (Laser)',
          'Printer (Inkjet)',
          'Printer (Dot Matrix)',
          'Scanner (Flatbed)',
          'Scanner (Document)',
          'Projector',
          'Webcam',
          'Speakers',
          'Headphones',
          'Microphone'
        ]
      }
    }
  },
  NETWORKING: {
    name: 'Networking',
    subCategories: {
      'Network Infrastructure': {
        types: [
          'Router (Cisco)',
          'Router (MikroTik)',
          'Router (Other)',
          'Switch (Managed)',
          'Switch (Unmanaged)',
          'Switch (PoE)',
          'Firewall (Fortinet)',
          'Firewall (Palo Alto)',
          'Firewall (SonicWall)',
          'Wireless AP (Wi-Fi 4)',
          'Wireless AP (Wi-Fi 5)',
          'Wireless AP (Wi-Fi 6)',
          'Modem (DSL)',
          'Modem (Cable)',
          'Modem (Fiber)',
          'Load Balancer'
        ]
      },
      'Network Cables & Accessories': {
        types: [
          'Ethernet Cable (Cat5e)',
          'Ethernet Cable (Cat6)',
          'Ethernet Cable (Cat6a)',
          'Ethernet Cable (Cat7)',
          'Fiber Optic Cable',
          'Patch Panel',
          'Network Rack',
          'Cable Management',
          'Network Tester',
          'Crimping Tool'
        ]
      }
    }
  },
  DATACENTER: {
    name: 'Data Center',
    subCategories: {
      'Rack & Infrastructure': {
        types: [
          'Server Rack (42U)',
          'Server Rack (24U)',
          'Network Cabinet',
          'CRAC Unit',
          'Cooling System',
          'KVM Switch',
          'Console Server',
          'Rack PDU',
          'Cable Management',
          'Blanking Panel'
        ]
      }
    }
  },
  SOFTWARE: {
    name: 'Software',
    subCategories: {
      'Operating Systems': {
        types: [
          'Windows 11 Pro',
          'Windows 10 Pro',
          'Windows Server 2022',
          'Windows Server 2019',
          'Ubuntu Linux',
          'Red Hat Enterprise',
          'CentOS',
          'macOS',
          'VMware vSphere',
          'Hyper-V'
        ]
      },
      'Productivity Software': {
        types: [
          'Microsoft Office 365',
          'Microsoft Office 2021',
          'Adobe Creative Suite',
          'AutoCAD',
          'SolidWorks',
          'Antivirus Software',
          'Backup Software',
          'Database Software'
        ]
      }
    }
  },
  LEGACY: {
    name: 'Legacy/Obsolete',
    subCategories: {
      'Legacy Components': {
        types: [
          'Floppy Drive',
          'ZIP Drive',
          'Parallel Port Device',
          'Serial Port Device',
          'SCSI Controller',
          'VGA Monitor',
          'DB9 Port Monitor',
          'ISA Card',
          'Legacy Motherboard',
          'Legacy CPU'
        ]
      }
    }
  }
}

// RAM Specifications
export const RAM_SPECIFICATIONS = {
  DDR1: { pins: 184, speeds: ['200', '266', '333', '400'] },
  DDR2: { pins: 240, speeds: ['400', '533', '667', '800', '1066'] },
  DDR3: { pins: 240, speeds: ['800', '1066', '1333', '1600', '1866', '2133'] },
  DDR4: { pins: 288, speeds: ['1600', '1866', '2133', '2400', '2666', '2933', '3200'] },
  DDR5: { pins: 288, speeds: ['4800', '5200', '5600', '6000', '6400'] }
}

// Storage Specifications
export const STORAGE_SPECIFICATIONS = {
  HDD: {
    interfaces: ['SATA', 'SAS', 'IDE', 'SCSI'],
    speeds: ['5400 RPM', '7200 RPM', '10000 RPM', '15000 RPM'],
    capacities: ['500GB', '1TB', '2TB', '4TB', '8TB', '10TB', '12TB', '16TB']
  },
  SSD: {
    interfaces: ['SATA', 'NVMe', 'M.2', 'PCIe'],
    capacities: ['120GB', '240GB', '480GB', '500GB', '1TB', '2TB', '4TB', '8TB']
  }
}

// Power Supply Specifications
export const PSU_SPECIFICATIONS = {
  wattages: ['300W', '450W', '500W', '650W', '750W', '850W', '1000W', '1200W', '1500W'],
  efficiencies: ['80+ Bronze', '80+ Silver', '80+ Gold', '80+ Platinum', '80+ Titanium'],
  formFactors: ['ATX', 'Micro ATX', 'Mini ITX', 'SFX', 'TFX']
}

// Monitor Specifications
export const MONITOR_SPECIFICATIONS = {
  sizes: ['19"', '21"', '22"', '24"', '27"', '32"', '34"', '43"', '49"'],
  resolutions: ['1366x768', '1920x1080', '2560x1440', '3840x2160', '5120x1440'],
  types: ['LCD', 'LED', 'OLED', 'CRT'],
  refreshRates: ['60Hz', '75Hz', '120Hz', '144Hz', '165Hz', '240Hz']
}

// Get all types for a category
export function getAssetTypes(category: string, subCategory?: string) {
  const cat = ASSET_CATEGORIES[category as keyof typeof ASSET_CATEGORIES]
  if (!cat) return []
  
  if (subCategory) {
    return cat.subCategories[subCategory]?.types || []
  }
  
  return Object.values(cat.subCategories).flatMap(sub => sub.types)
}

// Get all subcategories for a category
export function getSubCategories(category: string) {
  const cat = ASSET_CATEGORIES[category as keyof typeof ASSET_CATEGORIES]
  return cat ? Object.keys(cat.subCategories) : []
}
