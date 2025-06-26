import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const category = searchParams.get('category')
    const stockFilter = searchParams.get('stockFilter')

    // Build where clause for filtering
    const where: any = {}
    
    if (category) {
      where.category = category
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { type: { contains: search, mode: 'insensitive' } },
        { manufacturer: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get aggregated inventory data
    const assets = await prisma.asset.findMany({
      where,
      select: {
        id: true,
        name: true,
        category: true,
        subCategory: true,
        type: true,
        manufacturer: true,
        model: true,
        location: true,
        quantity: true,
        availableQty: true,
        purchaseCost: true,
        warrantyExpiry: true,
        updatedAt: true
      }
    })

    // Group assets by name, type, and model for inventory aggregation
    const inventoryMap = new Map()

    assets.forEach(asset => {
      const key = `${asset.name}-${asset.type}-${asset.model || 'no-model'}`
      
      if (inventoryMap.has(key)) {
        const existing = inventoryMap.get(key)
        existing.totalQuantity += asset.quantity
        existing.availableQuantity += asset.availableQty
        existing.assignedQuantity += (asset.quantity - asset.availableQty)
        existing.assets.push(asset)
      } else {
        inventoryMap.set(key, {
          id: asset.id,
          name: asset.name,
          category: asset.category,
          subCategory: asset.subCategory,
          type: asset.type,
          manufacturer: asset.manufacturer,
          model: asset.model,
          location: asset.location,
          totalQuantity: asset.quantity,
          availableQuantity: asset.availableQty,
          assignedQuantity: asset.quantity - asset.availableQty,
          lastUpdated: asset.updatedAt.toISOString(),
          assets: [asset]
        })
      }
    })

    // Convert map to array and calculate additional metrics
    const inventory = Array.from(inventoryMap.values()).map(item => {
      // Check for expiring warranties (next 90 days)
      const now = new Date()
      const ninetyDaysFromNow = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
      
      const warrantyExpiring = item.assets.filter((asset: any) => 
        asset.warrantyExpiry && 
        new Date(asset.warrantyExpiry) >= now && 
        new Date(asset.warrantyExpiry) <= ninetyDaysFromNow
      ).length

      // Determine if stock is low (less than 20% available)
      const stockPercentage = (item.availableQuantity / item.totalQuantity) * 100
      const lowStock = stockPercentage <= 20

      return {
        ...item,
        warrantyExpiring,
        lowStock
      }
    })

    // Apply stock filter
    let filteredInventory = inventory
    if (stockFilter) {
      filteredInventory = inventory.filter(item => {
        const stockPercentage = (item.availableQuantity / item.totalQuantity) * 100
        
        switch (stockFilter) {
          case 'out':
            return stockPercentage === 0
          case 'critical':
            return stockPercentage > 0 && stockPercentage <= 10
          case 'low':
            return stockPercentage > 10 && stockPercentage <= 20
          default:
            return true
        }
      })
    }

    // Calculate stats
    const stats = {
      totalItems: inventory.length,
      lowStockItems: inventory.filter(item => item.lowStock).length,
      expiringWarranties: inventory.reduce((sum, item) => sum + item.warrantyExpiring, 0),
      totalValue: assets.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0)
    }

    return NextResponse.json({
      inventory: filteredInventory,
      stats
    })

  } catch (error) {
    console.error('Error fetching inventory:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
