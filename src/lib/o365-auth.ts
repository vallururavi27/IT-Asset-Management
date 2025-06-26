import * as nodemailer from 'nodemailer'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

// Office 365 SMTP Configuration
const O365_SMTP_CONFIG = {
  host: 'smtp.office365.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: '', // Will be set dynamically
    pass: '', // Will be set dynamically
  },
  tls: {
    ciphers: 'SSLv3'
  }
}

export interface O365User {
  email: string
  fullName?: string
  role: Role
  department?: string
}

// Validate credentials against Office 365 SMTP
export async function validateO365Credentials(email: string, password: string): Promise<boolean> {
  try {
    console.log(`Attempting O365 authentication for: ${email}`)
    
    // Create transporter with user credentials
    const transporter = nodemailer.createTransporter({
      ...O365_SMTP_CONFIG,
      auth: {
        user: email,
        pass: password
      }
    })

    // Verify the connection
    await transporter.verify()
    console.log(`✅ O365 authentication successful for: ${email}`)
    return true
    
  } catch (error) {
    console.log(`❌ O365 authentication failed for: ${email}`, error.message)
    return false
  }
}

// Get or create user in local database after O365 authentication
export async function getOrCreateO365User(email: string): Promise<O365User> {
  try {
    // Check if user exists in local database
    let user = await prisma.user.findUnique({
      where: { email },
      include: { department: true }
    })

    if (!user) {
      // Create new user with default role
      const role = determineUserRole(email)
      const fullName = extractNameFromEmail(email)
      
      user = await prisma.user.create({
        data: {
          email,
          password: 'o365_auth', // Placeholder since we use O365 auth
          fullName,
          role,
          isActive: true
        },
        include: { department: true }
      })
      
      console.log(`Created new user: ${email} with role: ${role}`)
    }

    return {
      email: user.email,
      fullName: user.fullName || undefined,
      role: user.role,
      department: user.department?.name
    }
    
  } catch (error) {
    console.error('Error getting/creating O365 user:', error)
    throw new Error('Failed to process user')
  }
}

// Determine user role based on email or domain rules
function determineUserRole(email: string): Role {
  // Admin users (you can customize this logic)
  if (email === 'ravi.v@varsitymgmt.com') {
    return 'ADMIN'
  }
  
  // IT department users
  if (email.includes('it.') || email.includes('tech.')) {
    return 'MANAGER'
  }
  
  // Default role for other users
  return 'USER'
}

// Extract name from email address
function extractNameFromEmail(email: string): string {
  const localPart = email.split('@')[0]
  
  // Handle different email formats
  if (localPart.includes('.')) {
    return localPart
      .split('.')
      .map(part => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  }
  
  return localPart.charAt(0).toUpperCase() + localPart.slice(1)
}

// Main O365 authentication function
export async function authenticateWithO365(email: string, password: string) {
  try {
    // Step 1: Validate credentials against O365
    const isValidCredentials = await validateO365Credentials(email, password)
    
    if (!isValidCredentials) {
      return null
    }

    // Step 2: Get or create user in local database
    const user = await getOrCreateO365User(email)
    
    // Step 3: Generate session token (simple approach)
    const sessionToken = generateSessionToken(user)
    
    return {
      user,
      token: sessionToken
    }
    
  } catch (error) {
    console.error('O365 authentication error:', error)
    return null
  }
}

// Simple session token generation (Edge Runtime compatible)
function generateSessionToken(user: O365User): string {
  const payload = {
    email: user.email,
    role: user.role,
    timestamp: Date.now()
  }

  // Simple base64 encoding without Buffer (Edge Runtime compatible)
  return btoa(JSON.stringify(payload))
}

// Verify session token (Edge Runtime compatible)
export function verifySessionToken(token: string): O365User | null {
  try {
    // Simple base64 decode without Buffer (Edge Runtime compatible)
    const payload = JSON.parse(atob(token))

    // Check if token is not too old (24 hours)
    const maxAge = 24 * 60 * 60 * 1000 // 24 hours
    if (Date.now() - payload.timestamp > maxAge) {
      return null
    }

    return {
      email: payload.email,
      role: payload.role
    }

  } catch (error) {
    return null
  }
}
