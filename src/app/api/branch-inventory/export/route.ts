import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const branchId = searchParams.get('branchId')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const type = searchParams.get('type') || 'all'

    const where: any = {}

    if (branchId) {
      where.branchId = branchId
    }

    if (category) {
      where.category = category
    }

    if (status) {
      where.status = status
    }

    // Apply type-specific filters
    switch (type) {
      case 'available':
        where.status = 'AVAILABLE'
        where.availableQty = { gt: 0 }
        break
      case 'assigned':
        where.assignedQty = { gt: 0 }
        break
      case 'low-stock':
        where.OR = [
          { availableQty: { lte: 2 } },
          { AND: [{ quantity: { gt: 10 } }, { availableQty: { lte: 5 } }] }
        ]
        break
    }

    const inventory = await prisma.branchInventory.findMany({
      where,
      include: {
        branch: {
          select: {
            branchName: true,
            branchCode: true,
            city: true,
            state: true,
            location: true
          }
        }
      },
      orderBy: [
        { branch: { branchCode: 'asc' } },
        { itemName: 'asc' }
      ]
    })

    // Generate CSV content - exact format matching D:\itstore\it-asset-management\inventory.csv
    const headers = [
      'branchCode',
      'itemName',
      'itemType',
      'category',
      'subCategory',
      'serialNumber',
      'model',
      'manufacturer',
      'purchaseDate',
      'purchaseCost',
      'warrantyExpiry',
      'status',
      'location',
      'quantity',
      'availableQty',
      'condition',
      'notes'
    ]

    const csvRows = [headers.join(',')]

    inventory.forEach(item => {
      const row = [
        item.branch.branchCode || '',
        `"${item.itemName || ''}"`,
        `"${item.itemType || ''}"`,
        item.category || '',
        `"${item.subCategory || ''}"`,
        item.serialNumber || '',
        `"${item.model || ''}"`,
        `"${item.manufacturer || ''}"`,
        item.purchaseDate ? item.purchaseDate.toISOString().split('T')[0] : '',
        item.purchaseCost || '',
        item.warrantyExpiry ? item.warrantyExpiry.toISOString().split('T')[0] : '',
        item.status || '',
        `"${item.location || ''}"`,
        item.quantity || 0,
        item.availableQty || 0,
        item.condition || '',
        `"${item.notes || ''}"`
      ]
      csvRows.push(row.join(','))
    })

    const csvContent = csvRows.join('\n')

    // Set headers for file download
    const headers_response = new Headers()
    headers_response.set('Content-Type', 'text/csv')
    headers_response.set('Content-Disposition', `attachment; filename="branch_inventory_${type}_${new Date().toISOString().split('T')[0]}.csv"`)

    return new NextResponse(csvContent, {
      status: 200,
      headers: headers_response
    })
  } catch (error) {
    console.error('Error exporting branch inventory:', error)
    return NextResponse.json(
      { error: 'Failed to export branch inventory' },
      { status: 500 }
    )
  }
}
