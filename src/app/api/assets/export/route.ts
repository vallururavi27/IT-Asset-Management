import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const type = searchParams.get('type') || 'all' // all, available, assigned, low-stock

    // Build where clause based on type
    let where: any = {}
    switch (type) {
      case 'available':
        where.status = 'AVAILABLE'
        break
      case 'assigned':
        where.status = 'ASSIGNED'
        break
      case 'low-stock':
        where.availableQty = { lte: { quantity: { multiply: 0.2 } } } // Less than 20% available
        break
      default:
        // All assets
        break
    }

    const assets = await prisma.asset.findMany({
      where,
      include: {
        assignments: {
          where: { status: 'ACTIVE' },
          include: {
            user: {
              select: { fullName: true, email: true }
            },
            department: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'Asset Name',
        'Category',
        'Sub Category',
        'Type',
        'Serial Number',
        'Asset Tag',
        'Model',
        'Manufacturer',
        'Purchase Date',
        'Purchase Cost',
        'Warranty Expiry',
        'Status',
        'Condition',
        'Location',
        'Total Quantity',
        'Available Quantity',
        'Assigned To',
        'Department',
        'Purchase Order No',
        'GRN Number',
        'Invoice Number',
        'OS Version',
        'Capacity',
        'Speed',
        'Form Factor',
        'Power Rating',
        'Created Date',
        'Last Updated'
      ].join(',')

      const csvRows = assets.map(asset => {
        const assignment = asset.assignments[0] // Get first active assignment
        return [
          `"${asset.name}"`,
          `"${asset.category}"`,
          `"${asset.subCategory || ''}"`,
          `"${asset.type}"`,
          `"${asset.serialNumber || ''}"`,
          `"${asset.assetTag || ''}"`,
          `"${asset.model || ''}"`,
          `"${asset.manufacturer || ''}"`,
          asset.purchaseDate ? `"${asset.purchaseDate.toISOString().split('T')[0]}"` : '""',
          asset.purchaseCost || '',
          asset.warrantyExpiry ? `"${asset.warrantyExpiry.toISOString().split('T')[0]}"` : '""',
          `"${asset.status}"`,
          `"${asset.condition}"`,
          `"${asset.location || ''}"`,
          asset.quantity,
          asset.availableQty,
          assignment ? `"${assignment.user.fullName || assignment.user.email}"` : '""',
          assignment ? `"${assignment.department?.name || ''}"` : '""',
          `"${asset.purchaseOrderNo || ''}"`,
          `"${asset.grnNumber || ''}"`,
          `"${asset.invoiceNumber || ''}"`,
          `"${asset.osVersion || ''}"`,
          `"${asset.capacity || ''}"`,
          `"${asset.speed || ''}"`,
          `"${asset.formFactor || ''}"`,
          `"${asset.powerRating || ''}"`,
          `"${asset.createdAt.toISOString().split('T')[0]}"`,
          `"${asset.updatedAt.toISOString().split('T')[0]}"`
        ].join(',')
      })

      const csvContent = [csvHeaders, ...csvRows].join('\n')
      const filename = `assets_${type}_${new Date().toISOString().split('T')[0]}.csv`

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`
        }
      })
    } else {
      // Return JSON for other formats or API consumption
      return NextResponse.json({
        assets: assets.map(asset => ({
          id: asset.id,
          name: asset.name,
          category: asset.category,
          subCategory: asset.subCategory,
          type: asset.type,
          serialNumber: asset.serialNumber,
          assetTag: asset.assetTag,
          model: asset.model,
          manufacturer: asset.manufacturer,
          purchaseDate: asset.purchaseDate,
          purchaseCost: asset.purchaseCost,
          warrantyExpiry: asset.warrantyExpiry,
          status: asset.status,
          condition: asset.condition,
          location: asset.location,
          quantity: asset.quantity,
          availableQty: asset.availableQty,
          assignedTo: asset.assignments[0]?.user.fullName || asset.assignments[0]?.user.email || null,
          department: asset.assignments[0]?.department?.name || null,
          purchaseOrderNo: asset.purchaseOrderNo,
          grnNumber: asset.grnNumber,
          invoiceNumber: asset.invoiceNumber,
          osVersion: asset.osVersion,
          capacity: asset.capacity,
          speed: asset.speed,
          formFactor: asset.formFactor,
          powerRating: asset.powerRating,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt
        })),
        exportInfo: {
          type,
          format,
          totalRecords: assets.length,
          exportDate: new Date().toISOString()
        }
      })
    }

  } catch (error) {
    console.error('Error exporting assets:', error)
    return NextResponse.json(
      { error: 'Export failed' },
      { status: 500 }
    )
  }
}
