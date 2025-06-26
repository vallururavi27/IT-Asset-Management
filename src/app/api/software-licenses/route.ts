import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { LicenseType } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const licenseType = searchParams.get('licenseType') as LicenseType | null
    const search = searchParams.get('search')

    const skip = (page - 1) * limit

    const where: any = {}
    if (licenseType) where.licenseType = licenseType
    if (search) {
      where.OR = [
        { softwareName: { contains: search, mode: 'insensitive' } },
        { vendor: { contains: search, mode: 'insensitive' } },
        { version: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [licenses, total] = await Promise.all([
      prisma.softwareLicense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.softwareLicense.count({ where })
    ])

    return NextResponse.json({
      licenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching software licenses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role')

    if (userRole !== 'ADMIN' && userRole !== 'MANAGER') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    const license = await prisma.softwareLicense.create({
      data: {
        ...data,
        availableLicenses: data.totalLicenses - (data.usedLicenses || 0)
      }
    })

    return NextResponse.json(license, { status: 201 })
  } catch (error) {
    console.error('Error creating software license:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
