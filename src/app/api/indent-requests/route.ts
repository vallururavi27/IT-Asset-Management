import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail, emailTemplates, getAdminEmails } from '@/lib/email'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { indentNumber: { contains: search, mode: 'insensitive' } },
        { itemName: { contains: search, mode: 'insensitive' } },
        { requestedBy: { contains: search, mode: 'insensitive' } },
        { department: { contains: search, mode: 'insensitive' } }
      ]
    }

    const indentRequests = await prisma.indentRequest.findMany({
      where,
      include: {
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(indentRequests)
  } catch (error) {
    console.error('Error fetching indent requests:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-email')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const data = await request.json()
    
    // Generate indent number
    const indentCount = await prisma.indentRequest.count()
    const indentNumber = `IND-${new Date().getFullYear()}-${String(indentCount + 1).padStart(4, '0')}`

    // Get user details
    const creator = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create indent request
    const indentRequest = await prisma.indentRequest.create({
      data: {
        ...data,
        indentNumber,
        createdBy: creator.id
      },
      include: {
        creator: {
          select: {
            fullName: true,
            email: true
          }
        }
      }
    })

    // Send email notification to admins
    const adminEmails = getAdminEmails()
    if (adminEmails.length > 0) {
      const emailTemplate = emailTemplates.indentRequest({
        itemName: data.itemName,
        quantity: data.quantity,
        currentStock: 0, // You might want to fetch this
        requestedBy: data.requestedBy,
        department: data.department,
        justification: data.justification
      })

      await sendEmail(adminEmails, emailTemplate)
    }

    return NextResponse.json(indentRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating indent request:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
