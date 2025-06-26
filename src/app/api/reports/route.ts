import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30')
    const reportType = searchParams.get('type') || 'overview'

    const dateFrom = new Date()
    dateFrom.setDate(dateFrom.getDate() - days)

    // Handle different report types
    switch (reportType) {
      case 'stock-inventory':
        return NextResponse.json(await getStockInventoryReport())
      case 'asset-wise':
        return NextResponse.json(await getAssetWiseReport(days))
      case 'financial':
        return NextResponse.json(await getFinancialReport(days))
      case 'overview':
      default:
        return NextResponse.json(await getOverviewReport(days, dateFrom))
    }
  } catch (error) {
    console.error('Error generating reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function getOverviewReport(days: number, dateFrom: Date) {
    // Get total assets and value
    const totalAssets = await prisma.asset.count()
    
    const assetsWithCost = await prisma.asset.findMany({
      select: { purchaseCost: true }
    })
    
    const totalValue = assetsWithCost.reduce((sum, asset) => 
      sum + (asset.purchaseCost || 0), 0
    )

    // Assets by category
    const assetsByCategory = await prisma.asset.groupBy({
      by: ['category'],
      _count: { category: true },
      _sum: { purchaseCost: true }
    })

    // Assets by status
    const assetsByStatus = await prisma.asset.groupBy({
      by: ['status'],
      _count: { status: true }
    })

    // Assets by department (through assignments)
    const assetsByDepartment = await prisma.assetAssignment.groupBy({
      by: ['departmentId'],
      where: { status: 'ACTIVE' },
      _count: { departmentId: true }
    })

    // Get department names
    const departmentCounts = await Promise.all(
      assetsByDepartment.map(async (item) => {
        if (!item.departmentId) return { department: 'Unassigned', count: item._count.departmentId }
        
        const dept = await prisma.department.findUnique({
          where: { id: item.departmentId },
          select: { name: true }
        })
        
        return {
          department: dept?.name || 'Unknown',
          count: item._count.departmentId
        }
      })
    )

    // Expiring warranties (next 90 days)
    const warrantyExpiry = new Date()
    warrantyExpiry.setDate(warrantyExpiry.getDate() + 90)

    const expiringWarranties = await prisma.asset.findMany({
      where: {
        warrantyExpiry: {
          gte: new Date(),
          lte: warrantyExpiry
        }
      },
      select: {
        name: true,
        warrantyExpiry: true
      },
      orderBy: { warrantyExpiry: 'asc' }
    })

    const expiringWarrantiesWithDays = expiringWarranties.map(asset => ({
      name: asset.name,
      warrantyExpiry: asset.warrantyExpiry!,
      daysLeft: Math.ceil((new Date(asset.warrantyExpiry!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    }))

    const reportData = {
      totalAssets,
      totalValue,
      assetsByCategory: assetsByCategory.map(item => ({
        category: item.category,
        count: item._count.category,
        value: item._sum.purchaseCost || 0
      })),
      assetsByStatus: assetsByStatus.map(item => ({
        status: item.status,
        count: item._count.status
      })),
      assetsByDepartment: departmentCounts,
      expiringWarranties: expiringWarrantiesWithDays
    }

    return reportData
}

async function getStockInventoryReport() {
  // Total stock in store
  const totalAssets = await prisma.asset.count()

  // Assets by status
  const assetsByStatus = await prisma.asset.groupBy({
    by: ['status'],
    _count: { status: true }
  })

  // Assets by location
  const assetsByLocation = await prisma.asset.groupBy({
    by: ['location'],
    _count: { location: true }
  })

  // Available vs Assigned
  const availableAssets = await prisma.asset.count({
    where: { status: 'AVAILABLE' }
  })

  const assignedAssets = await prisma.asset.count({
    where: { status: 'ASSIGNED' }
  })

  // Assets by category with stock levels
  const assetsByCategory = await prisma.asset.groupBy({
    by: ['category'],
    _count: { category: true },
    _sum: { quantity: true }
  })

  // Low stock alerts (assets with quantity <= 5)
  const lowStockAssets = await prisma.asset.findMany({
    where: {
      quantity: { lte: 5 },
      status: 'AVAILABLE'
    },
    select: {
      id: true,
      name: true,
      quantity: true,
      location: true,
      category: true
    }
  })

  return {
    totalAssets,
    availableAssets,
    assignedAssets,
    assetsByStatus: assetsByStatus.map(item => ({
      status: item.status,
      count: item._count.status
    })),
    assetsByLocation: assetsByLocation.map(item => ({
      location: item.location || 'Unspecified',
      count: item._count.location
    })),
    assetsByCategory: assetsByCategory.map(item => ({
      category: item.category,
      count: item._count.category,
      totalQuantity: item._sum.quantity || 0
    })),
    lowStockAssets
  }
}

async function getAssetWiseReport(days: number) {
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - days)

  // Asset utilization (assignments)
  const assetUtilization = await prisma.asset.findMany({
    include: {
      assignments: {
        where: { status: 'ACTIVE' },
        include: {
          user: { select: { fullName: true, email: true } },
          department: { select: { name: true } }
        }
      },
      movements: {
        where: { createdAt: { gte: dateFrom } },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  // Asset depreciation (simplified calculation)
  const assetsWithDepreciation = await prisma.asset.findMany({
    where: {
      purchaseCost: { not: null },
      purchaseDate: { not: null }
    },
    select: {
      id: true,
      name: true,
      purchaseCost: true,
      purchaseDate: true,
      category: true,
      status: true
    }
  })

  const depreciationData = assetsWithDepreciation.map(asset => {
    const purchaseDate = new Date(asset.purchaseDate!)
    const currentDate = new Date()
    const ageInYears = (currentDate.getTime() - purchaseDate.getTime()) / (1000 * 60 * 60 * 24 * 365)

    // Simple straight-line depreciation over 5 years
    const depreciationRate = 0.2 // 20% per year
    const depreciatedValue = Math.max(0, (asset.purchaseCost || 0) * (1 - (ageInYears * depreciationRate)))

    return {
      ...asset,
      ageInYears: Math.round(ageInYears * 10) / 10,
      currentValue: Math.round(depreciatedValue),
      depreciationAmount: Math.round((asset.purchaseCost || 0) - depreciatedValue)
    }
  })

  // Most utilized assets
  const mostUtilizedAssets = assetUtilization
    .filter(asset => asset.assignments.length > 0)
    .sort((a, b) => b.assignments.length - a.assignments.length)
    .slice(0, 10)

  // Underutilized assets (available for long time)
  const underutilizedAssets = await prisma.asset.findMany({
    where: {
      status: 'AVAILABLE',
      createdAt: { lt: dateFrom }
    },
    orderBy: { createdAt: 'asc' },
    take: 10,
    select: {
      id: true,
      name: true,
      category: true,
      location: true,
      createdAt: true
    }
  })

  return {
    assetUtilization: mostUtilizedAssets.map(asset => ({
      id: asset.id,
      name: asset.name,
      category: asset.category,
      status: asset.status,
      assignmentCount: asset.assignments.length,
      currentAssignment: asset.assignments[0] || null,
      recentMovements: asset.movements
    })),
    depreciationData,
    underutilizedAssets,
    totalDepreciatedValue: depreciationData.reduce((sum, asset) => sum + asset.currentValue, 0),
    totalDepreciationAmount: depreciationData.reduce((sum, asset) => sum + asset.depreciationAmount, 0)
  }
}

async function getFinancialReport(days: number) {
  const dateFrom = new Date()
  dateFrom.setDate(dateFrom.getDate() - days)

  // Total asset value
  const totalAssetValue = await prisma.asset.aggregate({
    _sum: { purchaseCost: true }
  })

  // Purchase trends
  const purchaseTrends = await prisma.asset.groupBy({
    by: ['purchaseDate'],
    where: {
      purchaseDate: { gte: dateFrom }
    },
    _count: { purchaseDate: true },
    _sum: { purchaseCost: true }
  })

  // Monthly purchase analysis
  const monthlyPurchases = await prisma.asset.findMany({
    where: {
      purchaseDate: { gte: dateFrom },
      purchaseCost: { not: null }
    },
    select: {
      purchaseDate: true,
      purchaseCost: true,
      category: true
    }
  })

  // Group by month
  const monthlyData = monthlyPurchases.reduce((acc, asset) => {
    if (!asset.purchaseDate) return acc

    const month = asset.purchaseDate.toISOString().substring(0, 7) // YYYY-MM
    if (!acc[month]) {
      acc[month] = { count: 0, value: 0, categories: {} }
    }

    acc[month].count += 1
    acc[month].value += asset.purchaseCost || 0

    if (!acc[month].categories[asset.category]) {
      acc[month].categories[asset.category] = 0
    }
    acc[month].categories[asset.category] += asset.purchaseCost || 0

    return acc
  }, {} as Record<string, any>)

  // Cost center analysis (by department)
  const costCenterAnalysis = await prisma.assetAssignment.findMany({
    where: { status: 'ACTIVE' },
    include: {
      asset: { select: { purchaseCost: true, category: true } },
      department: { select: { name: true } }
    }
  })

  const costByDepartment = costCenterAnalysis.reduce((acc, assignment) => {
    const deptName = assignment.department?.name || 'Unassigned'
    if (!acc[deptName]) {
      acc[deptName] = { totalValue: 0, assetCount: 0, categories: {} }
    }

    const assetValue = assignment.asset.purchaseCost || 0
    acc[deptName].totalValue += assetValue
    acc[deptName].assetCount += 1

    const category = assignment.asset.category
    if (!acc[deptName].categories[category]) {
      acc[deptName].categories[category] = 0
    }
    acc[deptName].categories[category] += assetValue

    return acc
  }, {} as Record<string, any>)

  // Top expensive assets
  const expensiveAssets = await prisma.asset.findMany({
    where: { purchaseCost: { not: null } },
    orderBy: { purchaseCost: 'desc' },
    take: 10,
    select: {
      id: true,
      name: true,
      category: true,
      purchaseCost: true,
      purchaseDate: true,
      status: true
    }
  })

  return {
    totalAssetValue: totalAssetValue._sum.purchaseCost || 0,
    monthlyPurchases: Object.entries(monthlyData).map(([month, data]) => ({
      month,
      ...data
    })),
    costCenterAnalysis: Object.entries(costByDepartment).map(([department, data]) => ({
      department,
      ...data
    })),
    expensiveAssets,
    purchaseTrends: purchaseTrends.map(trend => ({
      date: trend.purchaseDate,
      count: trend._count.purchaseDate,
      value: trend._sum.purchaseCost || 0
    }))
  }
}
