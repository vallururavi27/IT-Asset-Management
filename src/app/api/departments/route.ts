import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        manager: { select: { fullName: true, email: true } },
        users: { select: { id: true, fullName: true, email: true } },
        _count: {
          select: {
            users: true,
            assetAssignments: { where: { status: 'ACTIVE' } }
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(departments)
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')

    if (userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const department = await prisma.department.create({
      data,
      include: {
        manager: { select: { fullName: true, email: true } }
      }
    })

    return NextResponse.json(department, { status: 201 })
  } catch (error: any) {
    console.error('Error creating department:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Department name already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
