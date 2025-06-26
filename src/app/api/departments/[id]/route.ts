import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        manager: { select: { fullName: true, email: true } },
        branch: { select: { branchName: true, branchCode: true } },
        users: { select: { id: true, fullName: true, email: true } },
        _count: {
          select: {
            users: true,
            assetAssignments: { where: { status: 'ACTIVE' } }
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(department)
  } catch (error) {
    console.error('Error fetching department:', error)
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
    const userRole = request.headers.get('x-user-role')

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description || null,
        managerId: data.managerId || null,
        branchId: data.branchId || null,
        isActive: data.isActive ?? true
      },
      include: {
        manager: { select: { fullName: true, email: true } },
        branch: { select: { branchName: true, branchCode: true } }
      }
    })

    return NextResponse.json(department)
  } catch (error: any) {
    console.error('Error updating department:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Department name already exists' },
        { status: 409 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
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
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Check if department has active users or asset assignments
    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            users: true,
            assetAssignments: { where: { status: 'ACTIVE' } }
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    if (department._count.users > 0 || department._count.assetAssignments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete department with active users or asset assignments. Please reassign them first.' },
        { status: 400 }
      )
    }

    await prisma.department.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Department deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting department:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Department not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
