import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { GatePassStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') as GatePassStatus | null
    const search = searchParams.get('search')

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { gatePassNumber: { contains: search, mode: 'insensitive' } },
        { endUserName: { contains: search, mode: 'insensitive' } },
        { deliveryPersonName: { contains: search, mode: 'insensitive' } },
        { campus: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ]
    }

    const gatePasses = await prisma.gatePass.findMany({
      where,
      include: {
        asset: {
          select: {
            name: true,
            serialNumber: true,
            assetTag: true
          }
        },
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(gatePasses)
  } catch (error) {
    console.error('Error fetching gate passes:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-email') // Using email as user ID
    const userRole = request.headers.get('x-user-role')

    if (!userId || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Generate gate pass number
    const gatePassCount = await prisma.gatePass.count()
    const gatePassNumber = `GP-${new Date().getFullYear()}-${String(gatePassCount + 1).padStart(4, '0')}`

    // Get user details for creator
    const creator = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const gatePass = await prisma.gatePass.create({
      data: {
        ...data,
        gatePassNumber,
        createdBy: creator.id
      },
      include: {
        asset: true,
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    })

    // Update asset status to indicate it's being delivered
    await prisma.asset.update({
      where: { id: data.assetId },
      data: { status: 'ASSIGNED' }
    })

    // Create movement record
    await prisma.assetMovement.create({
      data: {
        assetId: data.assetId,
        movementType: 'OUTWARD',
        quantity: 1,
        fromLocation: 'Store/Warehouse',
        toLocation: `${data.campus} - ${data.department}`,
        recipient: data.endUserName,
        notes: `Gate Pass: ${gatePassNumber} - Delivery to ${data.endUserName}`,
        createdBy: creator.id
      }
    })

    return NextResponse.json(gatePass, { status: 201 })
  } catch (error) {
    console.error('Error creating gate pass:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
