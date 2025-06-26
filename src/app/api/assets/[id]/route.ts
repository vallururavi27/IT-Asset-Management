import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: params.id },
      include: {
        assignments: {
          include: {
            user: { select: { fullName: true, email: true } },
            department: { select: { name: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        movements: {
          include: {
            creator: { select: { fullName: true, email: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Error fetching asset:', error)
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

    if (!userId || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Manager access required' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id }
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Check for duplicate serial number (excluding current asset)
    if (data.serialNumber && data.serialNumber !== existingAsset.serialNumber) {
      const duplicateAsset = await prisma.asset.findUnique({
        where: { serialNumber: data.serialNumber }
      })

      if (duplicateAsset) {
        return NextResponse.json(
          { error: 'Serial number already exists' },
          { status: 400 }
        )
      }
    }

    // Update asset
    const updatedAsset = await prisma.asset.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        type: data.type,
        serialNumber: data.serialNumber,
        model: data.model,
        manufacturer: data.manufacturer,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchaseCost: data.purchaseCost,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
        status: data.status,
        location: data.location,
        quantity: data.quantity,
        availableQty: data.availableQty || data.quantity,
        assetTag: data.assetTag,
        condition: data.condition,
        osVersion: data.osVersion,
        capacity: data.capacity,
        speed: data.speed,
        formFactor: data.formFactor,
        powerRating: data.powerRating,
        purchaseOrderNo: data.purchaseOrderNo,
        invoiceNumber: data.invoiceNumber,
        specifications: data.specifications
      }
    })

    return NextResponse.json(updatedAsset)
  } catch (error: any) {
    console.error('Error updating asset:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Serial number or asset tag already exists' },
        { status: 400 }
      )
    }

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

    if (!userId || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Manager access required' },
        { status: 403 }
      )
    }

    const data = await request.json()

    // Check if asset exists
    const existingAsset = await prisma.asset.findUnique({
      where: { id: params.id }
    })

    if (!existingAsset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    // Update asset
    const updatedAsset = await prisma.asset.update({
      where: { id: params.id },
      data: {
        name: data.name,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        type: data.type,
        serialNumber: data.serialNumber,
        model: data.model,
        manufacturer: data.manufacturer,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchaseCost: data.purchaseCost,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
        status: data.status,
        location: data.location,
        quantity: data.quantity,
        availableQty: data.availableQty || data.quantity,
        assetTag: data.assetTag,
        condition: data.condition,
        osVersion: data.osVersion,
        capacity: data.capacity,
        speed: data.speed,
        formFactor: data.formFactor,
        powerRating: data.powerRating,
        purchaseOrderNo: data.purchaseOrderNo,
        invoiceNumber: data.invoiceNumber,
        specifications: data.specifications
      }
    })

    return NextResponse.json(updatedAsset)
  } catch (error: any) {
    console.error('Error updating asset:', error)

    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Serial number or asset tag already exists' },
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
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await prisma.asset.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Asset deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting asset:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
