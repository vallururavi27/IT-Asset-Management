import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const [
      totalAssets,
      availableAssets,
      assignedAssets,
      totalUsers,
      totalDepartments,
      totalSoftwareLicenses,
      usedLicenses,
      recentMovements,
      assetsByCategory,
      assetsByStatus,
      upcomingWarrantyExpiry
    ] = await Promise.all([
      // Total assets
      prisma.asset.count(),
      
      // Available assets
      prisma.asset.count({ where: { status: 'AVAILABLE' } }),
      
      // Assigned assets
      prisma.asset.count({ where: { status: 'ASSIGNED' } }),
      
      // Total users
      prisma.user.count({ where: { isActive: true } }),
      
      // Total departments
      prisma.department.count({ where: { isActive: true } }),
      
      // Total software licenses
      prisma.softwareLicense.aggregate({
        _sum: { totalLicenses: true }
      }),
      
      // Used software licenses
      prisma.softwareLicense.aggregate({
        _sum: { usedLicenses: true }
      }),
      
      // Recent movements (last 10)
      prisma.assetMovement.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          asset: { select: { name: true } },
          creator: { select: { fullName: true, email: true } }
        }
      }),
      
      // Assets by category
      prisma.asset.groupBy({
        by: ['category'],
        _count: { category: true }
      }),
      
      // Assets by status
      prisma.asset.groupBy({
        by: ['status'],
        _count: { status: true }
      }),
      
      // Assets with warranty expiring in next 30 days
      prisma.asset.findMany({
        where: {
          warrantyExpiry: {
            gte: new Date(),
            lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        },
        select: {
          id: true,
          name: true,
          warrantyExpiry: true,
          manufacturer: true
        },
        orderBy: { warrantyExpiry: 'asc' }
      })
    ])

    const stats = {
      overview: {
        totalAssets,
        availableAssets,
        assignedAssets,
        totalUsers,
        totalDepartments,
        totalSoftwareLicenses: totalSoftwareLicenses._sum.totalLicenses || 0,
        usedSoftwareLicenses: usedLicenses._sum.usedLicenses || 0,
        availableSoftwareLicenses: (totalSoftwareLicenses._sum.totalLicenses || 0) - (usedLicenses._sum.usedLicenses || 0)
      },
      recentMovements,
      charts: {
        assetsByCategory: assetsByCategory.map(item => ({
          category: item.category,
          count: item._count.category
        })),
        assetsByStatus: assetsByStatus.map(item => ({
          status: item.status,
          count: item._count.status
        }))
      },
      alerts: {
        upcomingWarrantyExpiry
      }
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
