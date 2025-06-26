import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const gatePass = await prisma.gatePass.findUnique({
      where: { id: params.id },
      include: {
        asset: true,
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    })

    if (!gatePass) {
      return NextResponse.json(
        { error: 'Gate pass not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(gatePass)
  } catch (error) {
    console.error('Error fetching gate pass:', error)
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

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const gatePass = await prisma.gatePass.update({
      where: { id: params.id },
      data: {
        ...data,
        ...(data.status === 'DELIVERED' && { deliveredDate: new Date() }),
        ...(data.grnNumber && { 
          grnDate: new Date(),
          status: 'RECEIVED'
        })
      },
      include: {
        asset: true,
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    })

    // If GRN is entered, update asset with GRN number
    if (data.grnNumber) {
      await prisma.asset.update({
        where: { id: gatePass.assetId },
        data: { 
          grnNumber: data.grnNumber,
          status: 'ASSIGNED'
        }
      })
    }

    return NextResponse.json(gatePass)
  } catch (error: any) {
    console.error('Error updating gate pass:', error)
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Gate pass not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
