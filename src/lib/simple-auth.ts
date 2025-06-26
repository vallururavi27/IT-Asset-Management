// Simple authentication fallback (for testing)
import { prisma } from './prisma'
import { Role } from '@prisma/client'

export interface SimpleUser {
  email: string
  fullName?: string
  role: Role
  department?: string
}

// AUTHORIZED USERS ONLY - VARSITY EDIFICATION MANAGEMENT PRIVATE LIMITED
// Only these specific email addresses can access the system
const AUTHORIZED_USERS = [
  {
    email: 'ravi.v@varsitymgmt.com',
    password: 'varsity@2024',
    fullName: 'Ravi Kumar Valluru',
    role: 'ADMIN' as Role
  },
  // Add more authorized users here as needed:
  // {
  //   email: 'manager@varsitymgmt.com',
  //   password: 'manager@2024',
  //   fullName: 'Manager Name',
  //   role: 'MANAGER' as Role
  // },
  // {
  //   email: 'staff@varsitymgmt.com',
  //   password: 'staff@2024',
  //   fullName: 'Staff Name',
  //   role: 'USER' as Role
  // }
]

// Simple authentication (fallback method)
export async function authenticateSimple(email: string, password: string) {
  try {
    console.log(`Simple auth attempt for: ${email}`)
    
    // Check against predefined users
    const authorizedUser = AUTHORIZED_USERS.find(
      user => user.email === email && user.password === password
    )
    
    if (!authorizedUser) {
      console.log(`❌ User not found or wrong password: ${email}`)
      return null
    }
    
    console.log(`✅ Simple auth successful for: ${email}`)
    
    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { email },
      include: { department: true }
    })
    
    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: authorizedUser.email,
          password: 'simple_auth', // Placeholder
          fullName: authorizedUser.fullName,
          role: authorizedUser.role,
          isActive: true
        },
        include: { department: true }
      })
      console.log(`Created new user: ${email}`)
    }
    
    // Generate simple session token
    const sessionToken = generateSimpleToken({
      email: user.email,
      fullName: user.fullName || undefined,
      role: user.role,
      department: user.department?.name
    })
    
    return {
      user: {
        email: user.email,
        fullName: user.fullName || undefined,
        role: user.role,
        department: user.department?.name
      },
      token: sessionToken
    }
    
  } catch (error) {
    console.error('Simple authentication error:', error)
    return null
  }
}

// Generate simple session token
function generateSimpleToken(user: SimpleUser): string {
  const payload = {
    email: user.email,
    role: user.role,
    timestamp: Date.now()
  }
  
  // Simple base64 encoding
  return btoa(JSON.stringify(payload))
}

// Add user to authorized list (for dynamic user addition)
export function addAuthorizedUser(email: string, password: string, fullName: string, role: Role) {
  AUTHORIZED_USERS.push({ email, password, fullName, role })
  console.log(`Added authorized user: ${email}`)
}
