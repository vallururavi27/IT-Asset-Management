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

    const { assignmentId, notes } = await request.json()

    if (!assignmentId) {
      return NextResponse.json(
        { error: 'Assignment ID is required' },
        { status: 400 }
      )
    }

    // Get assignment details
    const assignment = await prisma.assetAssignment.findUnique({
      where: { id: assignmentId },
      include: {
        asset: true,
        user: { select: { fullName: true, email: true } }
      }
    })

    if (!assignment) {
      return NextResponse.json(
        { error: 'Assignment not found' },
        { status: 404 }
      )
    }

    if (assignment.status === 'RETURNED') {
      return NextResponse.json(
        { error: 'Asset already returned' },
        { status: 400 }
      )
    }

    // Update assignment status
    const updatedAssignment = await prisma.assetAssignment.update({
      where: { id: assignmentId },
      data: {
        status: 'RETURNED',
        returnedDate: new Date(),
        notes: notes || assignment.notes
      }
    })

    // Update asset available quantity and status
    const newAvailableQty = assignment.asset.availableQty + assignment.quantity
    await prisma.asset.update({
      where: { id: assignment.assetId },
      data: {
        availableQty: newAvailableQty,
        status: newAvailableQty === assignment.asset.quantity ? 'AVAILABLE' : assignment.asset.status
      }
    })

    // Create inward movement record
    await prisma.assetMovement.create({
      data: {
        assetId: assignment.assetId,
        movementType: 'INWARD',
        quantity: assignment.quantity,
        toLocation: assignment.asset.location,
        supplier: assignment.userId,
        notes: `Asset returned by ${assignment.user.fullName || assignment.user.email}`,
        createdBy: userId
      }
    })

    return NextResponse.json(updatedAssignment)
  } catch (error) {
    console.error('Error returning asset:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
