import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const branchId = searchParams.get('branchId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}

    if (search) {
      where.OR = [
        { itemName: { contains: search, mode: 'insensitive' } },
        { itemType: { contains: search, mode: 'insensitive' } },
        { serialNumber: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { branch: { branchName: { contains: search, mode: 'insensitive' } } },
        { branch: { branchCode: { contains: search, mode: 'insensitive' } } }
      ]
    }

    if (branchId) {
      where.branchId = branchId
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    const inventory = await prisma.branchInventory.findMany({
      where,
      include: {
        branch: {
          select: {
            id: true,
            branchName: true,
            branchCode: true,
            city: true,
            state: true
          }
        }
      },
      orderBy: [
        { branch: { branchCode: 'asc' } },
        { itemName: 'asc' }
      ],
      skip: (page - 1) * limit,
      take: limit
    })

    // Transform data to include branch information at the top level
    const transformedInventory = inventory.map(item => ({
      id: item.id,
      branchId: item.branchId,
      branchName: item.branch.branchName,
      branchCode: item.branch.branchCode,
      city: item.branch.city,
      state: item.branch.state,
      itemName: item.itemName,
      itemType: item.itemType,
      category: item.category,
      subCategory: item.subCategory,
      serialNumber: item.serialNumber,
      model: item.model,
      manufacturer: item.manufacturer,
      purchaseDate: item.purchaseDate,
      purchaseCost: item.purchaseCost,
      warrantyExpiry: item.warrantyExpiry,
      status: item.status,
      location: item.location,
      quantity: item.quantity,
      availableQty: item.availableQty,
      assignedQty: item.assignedQty,
      condition: item.condition,
      lastUpdated: item.lastUpdated,
      notes: item.notes
    }))

    return NextResponse.json(transformedInventory)
  } catch (error) {
    console.error('Error fetching branch inventory:', error)
    return NextResponse.json(
      { error: 'Failed to fetch branch inventory' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Validate required fields
    const requiredFields = ['branchId', 'itemName', 'itemType', 'category', 'quantity']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Verify branch exists
    const branch = await prisma.branch.findUnique({
      where: { id: data.branchId }
    })

    if (!branch) {
      return NextResponse.json(
        { error: 'Branch not found' },
        { status: 404 }
      )
    }

    // Calculate assigned quantity (total - available)
    const assignedQty = (data.quantity || 0) - (data.availableQty || data.quantity || 0)

    const inventoryItem = await prisma.branchInventory.create({
      data: {
        branchId: data.branchId,
        itemName: data.itemName,
        itemType: data.itemType,
        category: data.category,
        subCategory: data.subCategory || '',
        serialNumber: data.serialNumber || null,
        model: data.model || null,
        manufacturer: data.manufacturer || null,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
        purchaseCost: data.purchaseCost ? parseFloat(data.purchaseCost) : null,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
        status: data.status || 'AVAILABLE',
        location: data.location || '',
        quantity: parseInt(data.quantity),
        availableQty: parseInt(data.availableQty || data.quantity),
        assignedQty: assignedQty,
        condition: data.condition || 'GOOD',
        notes: data.notes || null
      },
      include: {
        branch: {
          select: {
            branchName: true,
            branchCode: true,
            city: true,
            state: true
          }
        }
      }
    })

    return NextResponse.json(inventoryItem, { status: 201 })
  } catch (error) {
    console.error('Error creating branch inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to create inventory item' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    // Calculate assigned quantity if quantities are being updated
    if (updateData.quantity !== undefined || updateData.availableQty !== undefined) {
      const currentItem = await prisma.branchInventory.findUnique({
        where: { id }
      })

      if (!currentItem) {
        return NextResponse.json(
          { error: 'Inventory item not found' },
          { status: 404 }
        )
      }

      const newQuantity = updateData.quantity !== undefined ? parseInt(updateData.quantity) : currentItem.quantity
      const newAvailableQty = updateData.availableQty !== undefined ? parseInt(updateData.availableQty) : currentItem.availableQty
      updateData.assignedQty = newQuantity - newAvailableQty
    }

    // Convert date strings to Date objects
    if (updateData.purchaseDate) {
      updateData.purchaseDate = new Date(updateData.purchaseDate)
    }
    if (updateData.warrantyExpiry) {
      updateData.warrantyExpiry = new Date(updateData.warrantyExpiry)
    }

    const updatedItem = await prisma.branchInventory.update({
      where: { id },
      data: updateData,
      include: {
        branch: {
          select: {
            branchName: true,
            branchCode: true,
            city: true,
            state: true
          }
        }
      }
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating branch inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory item' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Item ID is required' },
        { status: 400 }
      )
    }

    await prisma.branchInventory.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Inventory item deleted successfully' })
  } catch (error) {
    console.error('Error deleting branch inventory item:', error)
    return NextResponse.json(
      { error: 'Failed to delete inventory item' },
      { status: 500 }
    )
  }
}
