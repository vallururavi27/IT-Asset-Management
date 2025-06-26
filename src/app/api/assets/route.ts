import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AssetCategory, AssetStatus } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') as AssetCategory | null
    const status = searchParams.get('status') as AssetStatus | null
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    if (category) where.category = category
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { serialNumber: { contains: search } },
        { manufacturer: { contains: search } }
      ]
    }

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          assignments: {
            where: { status: 'ACTIVE' },
            include: {
              user: { select: { fullName: true, email: true } },
              department: { select: { name: true } }
            }
          }
        }
      }),
      prisma.asset.count({ where })
    ])

    return NextResponse.json({
      assets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const asset = await prisma.asset.create({
      data: {
        ...data,
        availableQty: data.quantity || 1
      }
    })

    // Create inward movement record
    await prisma.assetMovement.create({
      data: {
        assetId: asset.id,
        movementType: 'INWARD',
        quantity: asset.quantity,
        supplier: data.vendor || data.supplier,
        toLocation: data.location,
        notes: `Initial asset registration`,
        createdBy: userId
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error: any) {
    console.error('Error creating asset:', error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Serial number already exists' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
