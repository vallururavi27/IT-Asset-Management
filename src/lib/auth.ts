import bcrypt from 'bcryptjs'
import { SignJWT, jwtVerify } from 'jose'
import { prisma } from './prisma'
import { Role } from '@prisma/client'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export interface JWTPayload {
  userId: string
  email: string
  role: Role
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function generateToken(payload: JWTPayload): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    console.log('Verifying token:', token.substring(0, 50) + '...')
    const { payload } = await jwtVerify(token, JWT_SECRET)
    console.log('Token verified successfully for user:', payload.email)
    return payload as JWTPayload
  } catch (error) {
    console.log('Token verification failed:', error.message)
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { department: true }
  })

  if (!user || !user.isActive) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password)
  if (!isValidPassword) {
    return null
  }

  const token = generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department
    },
    token
  }
}

export async function createUser(data: {
  email: string
  password: string
  fullName?: string
  role?: Role
  departmentId?: string
}) {
  const hashedPassword = await hashPassword(data.password)
  
  return prisma.user.create({
    data: {
      ...data,
      password: hashedPassword
    },
    include: { department: true }
  })
}
