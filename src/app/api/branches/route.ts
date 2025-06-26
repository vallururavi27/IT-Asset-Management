import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const branchType = searchParams.get('branchType')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (search) {
      where.OR = [
        { branchName: { contains: search, mode: 'insensitive' } },
        { branchCode: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (branchType) {
      where.branchType = branchType
    }

    const branches = await prisma.branch.findMany({
      where,
      include: {
        _count: {
          select: {
            assets: true,
            users: true,
            departments: true,
            gatePasses: true
          }
        }
      },
      orderBy: [
        { branchType: 'asc' },
        { branchName: 'asc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.branch.count({ where })

    return NextResponse.json(branches)
  } catch (error) {
    console.error('Error fetching branches:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    // Check for duplicate branch name or code
    const existingBranch = await prisma.branch.findFirst({
      where: {
        OR: [
          { branchName: data.branchName },
          { branchCode: data.branchCode }
        ]
      }
    })

    if (existingBranch) {
      return NextResponse.json(
        { error: 'Branch name or code already exists' },
        { status: 400 }
      )
    }

    const branch = await prisma.branch.create({
      data: {
        branchName: data.branchName,
        branchCode: data.branchCode,
        city: data.city,
        location: data.location,
        state: data.state,
        pincode: data.pincode,
        branchType: data.branchType || 'BRANCH',
        hardwareEngineerName: data.hardwareEngineerName,
        hardwareEngineerEmail: data.hardwareEngineerEmail,
        hardwareEngineerPhone: data.hardwareEngineerPhone,
        branchManagerName: data.branchManagerName,
        branchManagerEmail: data.branchManagerEmail,
        branchManagerPhone: data.branchManagerPhone,
        establishedDate: data.establishedDate ? new Date(data.establishedDate) : null,
        isActive: data.isActive ?? true
      },
      include: {
        _count: {
          select: {
            assets: true,
            users: true,
            departments: true,
            gatePasses: true
          }
        }
      }
    })

    return NextResponse.json(branch)
  } catch (error: any) {
    console.error('Error creating branch:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Branch name or code already exists' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
