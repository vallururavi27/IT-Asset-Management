import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MovementType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')
    const movementType = searchParams.get('movementType') as MovementType | null

    const where: any = {}
    
    if (movementType) {
      where.movementType = movementType
    }
    
    if (search) {
      where.OR = [
        { asset: { name: { contains: search, mode: 'insensitive' } } },
        { supplier: { contains: search, mode: 'insensitive' } },
        { recipient: { contains: search, mode: 'insensitive' } },
        { fromLocation: { contains: search, mode: 'insensitive' } },
        { toLocation: { contains: search, mode: 'insensitive' } },
        { notes: { contains: search, mode: 'insensitive' } }
      ]
    }

    const movements = await prisma.assetMovement.findMany({
      where,
      include: {
        asset: {
          select: {
            name: true,
            serialNumber: true
          }
        },
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to recent 50 movements
    })

    return NextResponse.json(movements)
  } catch (error) {
    console.error('Error fetching movements:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
