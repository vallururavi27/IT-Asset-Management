import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parse } from 'csv-parse/sync'

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-email')
    const userRole = request.headers.get('x-user-role')

    if (!userId || (userRole !== 'ADMIN' && userRole !== 'MANAGER')) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin or Manager access required' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('csvFile') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      )
    }

    const csvContent = await file.text()
    
    // Parse CSV with headers
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    })

    const results = {
      total: records.length,
      successful: 0,
      failed: 0,
      errors: [] as string[]
    }

    // Get user for creator field
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
        if (!record.name || !record.category || !record.type) {
          results.errors.push(`Row ${i + 2}: Missing required fields (name, category, type)`)
          results.failed++
          continue
        }

        // Parse dates
        const purchaseDate = record.purchaseDate ? new Date(record.purchaseDate) : null
        const warrantyExpiry = record.warrantyExpiry ? new Date(record.warrantyExpiry) : null

        // Parse numeric fields
        const purchaseCost = record.purchaseCost ? parseFloat(record.purchaseCost) : null
        const quantity = record.quantity ? parseInt(record.quantity) : 1
        const availableQty = record.availableQty ? parseInt(record.availableQty) : quantity

        // Validate dates
        if (record.purchaseDate && isNaN(purchaseDate?.getTime() || 0)) {
          results.errors.push(`Row ${i + 2}: Invalid purchase date format`)
          results.failed++
          continue
        }

        if (record.warrantyExpiry && isNaN(warrantyExpiry?.getTime() || 0)) {
          results.errors.push(`Row ${i + 2}: Invalid warranty expiry date format`)
          results.failed++
          continue
        }

        // Check for duplicate serial number
        if (record.serialNumber) {
          const existingAsset = await prisma.asset.findUnique({
            where: { serialNumber: record.serialNumber }
          })
          
          if (existingAsset) {
            results.errors.push(`Row ${i + 2}: Serial number ${record.serialNumber} already exists`)
            results.failed++
            continue
          }
        }

        // Handle branch assignment
        let branchId = null
        if (record.branchName) {
          // Try to find existing branch by name
          let branch = await prisma.branch.findFirst({
            where: { branchName: record.branchName }
          })

          // If branch doesn't exist, create it
          if (!branch && record.city) {
            try {
              branch = await prisma.branch.create({
                data: {
                  branchName: record.branchName,
                  branchCode: record.branchName.replace(/\s+/g, '').toUpperCase().substring(0, 10),
                  city: record.city,
                  location: record.location || record.city,
                  branchType: 'BRANCH',
                  hardwareEngineerName: record.hardwareEngineerName || null,
                  isActive: true
                }
              })
              results.messages = results.messages || []
              results.messages.push(`Created new branch: ${record.branchName}`)
            } catch (branchError) {
              console.error('Error creating branch:', branchError)
              // Continue without branch assignment if creation fails
            }
          }

          if (branch) {
            branchId = branch.id
          }
        }

        // Basic specifications from description if needed
        const specifications: any = {}
        if (record.description) {
          specifications.description = record.description
        }

        // Create asset
        const asset = await prisma.asset.create({
          data: {
            name: record.name,
            description: record.description || null,
            category: record.category,
            subCategory: record.subCategory || null,
            type: record.type,
            serialNumber: record.serialNumber || null,
            model: record.model || null,
            manufacturer: record.manufacturer || null,
            branchId,
            purchaseDate,
            purchaseCost,
            warrantyExpiry,
            status: record.status || 'AVAILABLE',
            location: record.location || null,
            quantity,
            availableQty,
            purchaseOrderNo: record.purchaseOrderNo || null,
            grnNumber: null, // Will be set later when items are received
            invoiceNumber: record.invoiceNumber || null,
            vendor: record.vendor || record.supplier || null
            specifications: Object.keys(specifications).length > 0 ? specifications : null,
            assetTag: null, // Will be generated or set later
            condition: 'NEW', // Default condition for new imports
            osVersion: null,
            biosVersion: null,
            capacity: null,
            speed: null,
            formFactor: null,
            powerRating: null
          }
        })

        // Create inward movement record if this is a new purchase
        if (record.supplier || record.vendor) {
          await prisma.assetMovement.create({
            data: {
              assetId: asset.id,
              movementType: 'INWARD',
              quantity: quantity,
              supplier: record.vendor || record.supplier,
              toLocation: record.location || 'Warehouse',
              notes: `Bulk import - ${record.notes || 'Asset imported via CSV'}`,
              createdBy: creator.id
            }
          })
        }

        results.successful++
      } catch (error: any) {
        console.error(`Error processing row ${i + 2}:`, error)
        results.errors.push(`Row ${i + 2}: ${error.message}`)
        results.failed++
      }
    }

    return NextResponse.json({
      message: 'CSV import completed',
      results
    })

  } catch (error: any) {
    console.error('Error importing CSV:', error)
    return NextResponse.json(
      { error: `Import failed: ${error.message}` },
      { status: 500 }
    )
  }
}
