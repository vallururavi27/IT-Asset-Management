import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates, getAdminEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { sendToEmail } = await request.json()

    // Get daily report data
    const reportData = await generateDailyReportData()

    // Send email to admins or specified email
    const recipients = sendToEmail ? [sendToEmail] : getAdminEmails()
    const emailTemplate = emailTemplates.dailyReport(reportData)
    
    const emailResult = await sendEmail(recipients, emailTemplate)

    if (emailResult.success) {
      return NextResponse.json({
        message: 'Daily report sent successfully',
        recipients,
        data: reportData
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResult.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending daily report:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily report' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Generate and return daily report data without sending email
    const reportData = await generateDailyReportData()
    
    return NextResponse.json({
      message: 'Daily report data generated',
      data: reportData,
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating daily report:', error)
    return NextResponse.json(
      { error: 'Failed to generate daily report' },
      { status: 500 }
    )
  }
}

async function generateDailyReportData() {
  // Get total assets count
  const totalAssets = await prisma.asset.count()

  // Get available assets count
  const availableAssets = await prisma.asset.count({
    where: { status: 'AVAILABLE' }
  })

  // Get assigned assets count
  const assignedAssets = await prisma.asset.count({
    where: { status: 'ASSIGNED' }
  })

  // Get total value
  const assetsWithCost = await prisma.asset.findMany({
    select: { purchaseCost: true }
  })
  const totalValue = assetsWithCost.reduce((sum, asset) => sum + (asset.purchaseCost || 0), 0)

  // Get low stock items (less than 20% available)
  const allAssets = await prisma.asset.findMany({
    select: {
      id: true,
      name: true,
      quantity: true,
      availableQty: true,
      location: true
    }
  })

  const lowStockItems = allAssets.filter(asset => {
    const stockPercentage = (asset.availableQty / asset.quantity) * 100
    return stockPercentage <= 20 && stockPercentage > 0
  })

  // Get warranties expiring in next 30 days
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

  const expiringWarranties = await prisma.asset.findMany({
    where: {
      warrantyExpiry: {
        gte: new Date(),
        lte: thirtyDaysFromNow
      }
    },
    select: {
      id: true,
      name: true,
      warrantyExpiry: true,
      serialNumber: true
    }
  })

  // Get recent movements (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const recentMovements = await prisma.assetMovement.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    }
  })

  // Get recent gate passes (last 7 days)
  const recentGatePasses = await prisma.gatePass.count({
    where: {
      createdAt: {
        gte: sevenDaysAgo
      }
    }
  })

  return {
    totalAssets,
    availableAssets,
    assignedAssets,
    totalValue,
    lowStockItems: lowStockItems.map(item => ({
      name: item.name,
      quantity: item.quantity,
      availableQty: item.availableQty,
      location: item.location
    })),
    expiringWarranties: expiringWarranties.map(item => ({
      name: item.name,
      warrantyExpiry: item.warrantyExpiry,
      serialNumber: item.serialNumber
    })),
    recentMovements,
    recentGatePasses,
    reportDate: new Date().toISOString()
  }
}
