import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id')
    const userRole = request.headers.get('x-user-role')

    if (!userId || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { assetId, assignToUserId, departmentId, quantity = 1, notes } = await request.json()

    if (!assetId || !assignToUserId) {
      return NextResponse.json(
        { error: 'Asset ID and user ID are required' },
        { status: 400 }
      )
    }

    // Check if asset exists and has available quantity
    const asset = await prisma.asset.findUnique({
      where: { id: assetId }
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    if (asset.availableQty < quantity) {
      return NextResponse.json(
        { error: 'Insufficient available quantity' },
        { status: 400 }
      )
    }

    // Create assignment
    const assignment = await prisma.assetAssignment.create({
      data: {
        assetId,
        userId: assignToUserId,
        departmentId,
        quantity,
        notes
      },
      include: {
        asset: true,
        user: { select: { fullName: true, email: true } },
        department: { select: { name: true } }
      }
    })

    // Update asset available quantity and status
    await prisma.asset.update({
      where: { id: assetId },
      data: {
        availableQty: asset.availableQty - quantity,
        status: asset.availableQty - quantity === 0 ? 'ASSIGNED' : asset.status
      }
    })

    // Create outward movement record
    await prisma.assetMovement.create({
      data: {
        assetId,
        movementType: 'OUTWARD',
        quantity,
        fromLocation: asset.location,
        recipient: assignToUserId,
        notes: `Asset assigned to ${assignment.user.fullName || assignment.user.email}`,
        createdBy: userId
      }
    })

    return NextResponse.json(assignment, { status: 201 })
  } catch (error) {
    console.error('Error assigning asset:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
