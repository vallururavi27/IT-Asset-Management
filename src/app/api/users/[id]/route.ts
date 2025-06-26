import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            assetAssignments: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user

    return NextResponse.json(userWithoutPassword)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = request.headers.get('x-user-email')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id }
    })

    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check for duplicate email (excluding current user)
    if (data.email && data.email !== existingUser.email) {
      const duplicateUser = await prisma.user.findUnique({
        where: { email: data.email }
      })
      
      if (duplicateUser) {
        return NextResponse.json(
          { error: 'Email already exists' },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      isActive: data.isActive
    }

    // Hash password if provided
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 12)
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            assetAssignments: {
              where: { status: 'ACTIVE' }
            }
          }
        }
      }
    })

    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser

    return NextResponse.json(userWithoutPassword)
  } catch (error: any) {
    console.error('Error updating user:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userRole = request.headers.get('x-user-role')

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    // Check if user has active asset assignments
    const activeAssignments = await prisma.assetAssignment.count({
      where: {
        userId: params.id,
        status: 'ACTIVE'
      }
    })

    if (activeAssignments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete user with active asset assignments' },
        { status: 400 }
      )
    }

    // Soft delete by deactivating the user instead of hard delete
    const deactivatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ 
      message: 'User deactivated successfully',
      user: { id: deactivatedUser.id, email: deactivatedUser.email }
    })
  } catch (error: any) {
    console.error('Error deleting user:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
