import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')

    const where: any = { isActive: true }
    if (departmentId) {
      where.departmentId = departmentId
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        department: { select: { name: true } },
        _count: {
          select: {
            assetAssignments: { where: { status: 'ACTIVE' } }
          }
        }
      },
      orderBy: { fullName: 'asc' }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
