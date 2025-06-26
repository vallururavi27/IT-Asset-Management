import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parse } from 'csv-parse/sync'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-email')
    const userRole = request.headers.get('x-user-role')

    if (!userId || userRole !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Read and parse CSV
    const csvText = await file.text()
    const records = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    const results = {
      total: records.length,
      successful: 0,
      failed: 0,
      errors: [] as string[],
      messages: [] as string[]
    }

    // Get the user who is importing
    const creator = await prisma.user.findUnique({
      where: { email: userId }
    })

    if (!creator) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Process each record
    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      
      try {
        // Validate required fields
        if (!record.branchName || !record.branchCode || !record.city || !record.location) {
          results.errors.push(`Row ${i + 2}: Missing required fields (branchName, branchCode, city, location)`)
          results.failed++
          continue
        }

        // Validate branch type
        const validBranchTypes = ['HEAD_OFFICE', 'BRANCH', 'REGIONAL_OFFICE', 'SUB_BRANCH']
        if (record.branchType && !validBranchTypes.includes(record.branchType)) {
          results.errors.push(`Row ${i + 2}: Invalid branch type. Must be one of: ${validBranchTypes.join(', ')}`)
          results.failed++
          continue
        }

        // Parse established date
        let establishedDate = null
        if (record.establishedDate) {
          establishedDate = new Date(record.establishedDate)
          if (isNaN(establishedDate.getTime())) {
            results.errors.push(`Row ${i + 2}: Invalid established date format. Use YYYY-MM-DD`)
            results.failed++
            continue
          }
        }

        // Check for duplicate branch name or code
        const existingBranch = await prisma.branch.findFirst({
          where: {
            OR: [
              { branchName: record.branchName },
              { branchCode: record.branchCode }
            ]
          }
        })

        if (existingBranch) {
          results.errors.push(`Row ${i + 2}: Branch name or code already exists`)
          results.failed++
          continue
        }

        // Validate email formats
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (record.hardwareEngineerEmail && !emailRegex.test(record.hardwareEngineerEmail)) {
          results.errors.push(`Row ${i + 2}: Invalid hardware engineer email format`)
          results.failed++
          continue
        }

        if (record.branchManagerEmail && !emailRegex.test(record.branchManagerEmail)) {
          results.errors.push(`Row ${i + 2}: Invalid branch manager email format`)
          results.failed++
          continue
        }

        // Create branch
        const branch = await prisma.branch.create({
          data: {
            branchName: record.branchName,
            branchCode: record.branchCode,
            city: record.city,
            location: record.location,
            state: record.state || null,
            pincode: record.pincode || null,
            branchType: record.branchType || 'BRANCH',
            hardwareEngineerName: record.hardwareEngineerName || null,
            hardwareEngineerEmail: record.hardwareEngineerEmail || null,
            hardwareEngineerPhone: record.hardwareEngineerPhone || null,
            branchManagerName: record.branchManagerName || null,
            branchManagerEmail: record.branchManagerEmail || null,
            branchManagerPhone: record.branchManagerPhone || null,
            establishedDate,
            isActive: true
          }
        })

        results.successful++
        results.messages.push(`Successfully created branch: ${record.branchName}`)

      } catch (error: any) {
        console.error(`Error processing row ${i + 2}:`, error)
        if (error.code === 'P2002') {
          results.errors.push(`Row ${i + 2}: Branch name or code already exists`)
        } else {
          results.errors.push(`Row ${i + 2}: ${error.message}`)
        }
        results.failed++
      }
    }

    return NextResponse.json({
      message: 'Branch CSV import completed',
      results
    })

  } catch (error: any) {
    console.error('Error importing branch CSV:', error)
    return NextResponse.json(
      { error: `Import failed: ${error.message}` },
      { status: 500 }
    )
  }
}
