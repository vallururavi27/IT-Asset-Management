import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const csvText = await file.text()
    const lines = csvText.split('\n').filter(line => line.trim())
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file must contain headers and at least one data row' },
        { status: 400 }
      )
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
    const dataLines = lines.slice(1)

    // Expected headers - exact match with D:\itstore\it-asset-management\inventory.csv format
    const expectedHeaders = [
      'branchCode',
      'itemName',
      'itemType',
      'category',
      'subCategory',
      'serialNumber',
      'model',
      'manufacturer',
      'purchaseDate',
      'purchaseCost',
      'warrantyExpiry',
      'status',
      'location',
      'quantity',
      'availableQty',
      'condition',
      'notes'
    ]

    // Header mapping for flexibility (case-insensitive)
    const headerMapping = {
      'branchCode': ['branchcode', 'branch code', 'branch_code'],
      'itemName': ['itemname', 'item name', 'item_name', 'name'],
      'itemType': ['itemtype', 'item type', 'item_type', 'type'],
      'category': ['category'],
      'subCategory': ['subcategory', 'sub category', 'sub_category'],
      'serialNumber': ['serialnumber', 'serial number', 'serial_number', 'sn'],
      'model': ['model'],
      'manufacturer': ['manufacturer', 'brand'],
      'purchaseDate': ['purchasedate', 'purchase date', 'purchase_date'],
      'purchaseCost': ['purchasecost', 'purchase cost', 'purchase_cost', 'cost'],
      'warrantyExpiry': ['warrantyexpiry', 'warranty expiry', 'warranty_expiry', 'warranty'],
      'status': ['status'],
      'location': ['location', 'item location', 'item_location'],
      'quantity': ['quantity', 'total quantity', 'total_quantity'],
      'availableQty': ['availableqty', 'available quantity', 'available_quantity', 'available qty', 'available_qty'],
      'condition': ['condition'],
      'notes': ['notes', 'remarks', 'comments']
    }

    // Create header index mapping
    const headerIndexes: { [key: string]: number } = {}
    
    Object.entries(headerMapping).forEach(([field, variations]) => {
      const headerIndex = headers.findIndex(h => 
        variations.some(v => h.toLowerCase() === v.toLowerCase())
      )
      if (headerIndex !== -1) {
        headerIndexes[field] = headerIndex
      }
    })

    // Validate required headers
    const requiredFields = ['branchCode', 'itemName', 'itemType', 'category']
    const missingFields = requiredFields.filter(field => headerIndexes[field] === undefined)
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required columns: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Get all branches for validation
    const branches = await prisma.branch.findMany({
      select: { id: true, branchCode: true }
    })
    const branchMap = new Map(branches.map(b => [b.branchCode.toLowerCase(), b.id]))

    let imported = 0
    let errors = 0
    const errorDetails: string[] = []

    for (let i = 0; i < dataLines.length; i++) {
      try {
        const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        
        // Extract data using header mapping
        const branchCode = values[headerIndexes.branchCode]?.trim()
        const itemName = values[headerIndexes.itemName]?.trim()
        const itemType = values[headerIndexes.itemType]?.trim()
        const category = values[headerIndexes.category]?.trim()

        // Validate required fields
        if (!branchCode || !itemName || !itemType || !category) {
          errors++
          errorDetails.push(`Row ${i + 2}: Missing required fields`)
          continue
        }

        // Find branch ID
        const branchId = branchMap.get(branchCode.toLowerCase())
        if (!branchId) {
          errors++
          errorDetails.push(`Row ${i + 2}: Branch code '${branchCode}' not found`)
          continue
        }

        // Parse optional fields
        const quantity = parseInt(values[headerIndexes.quantity] || '1') || 1
        const availableQty = parseInt(values[headerIndexes.availableQty] || quantity.toString()) || quantity
        const assignedQty = quantity - availableQty

        const inventoryData = {
          branchId,
          itemName,
          itemType,
          category: category.toUpperCase(),
          subCategory: values[headerIndexes.subCategory] || '',
          serialNumber: values[headerIndexes.serialNumber] || null,
          model: values[headerIndexes.model] || null,
          manufacturer: values[headerIndexes.manufacturer] || null,
          purchaseDate: values[headerIndexes.purchaseDate] ? new Date(values[headerIndexes.purchaseDate]) : null,
          purchaseCost: values[headerIndexes.purchaseCost] ? parseFloat(values[headerIndexes.purchaseCost]) : null,
          warrantyExpiry: values[headerIndexes.warrantyExpiry] ? new Date(values[headerIndexes.warrantyExpiry]) : null,
          status: values[headerIndexes.status]?.toUpperCase() || 'AVAILABLE',
          location: values[headerIndexes.location] || '',
          quantity,
          availableQty,
          assignedQty,
          condition: values[headerIndexes.condition]?.toUpperCase() || 'GOOD',
          notes: values[headerIndexes.notes] || null
        }

        // Check if item already exists (by branch, name, and serial number)
        const existingItem = await prisma.branchInventory.findFirst({
          where: {
            branchId,
            itemName,
            serialNumber: inventoryData.serialNumber
          }
        })

        if (existingItem) {
          // Update existing item
          await prisma.branchInventory.update({
            where: { id: existingItem.id },
            data: inventoryData
          })
        } else {
          // Create new item
          await prisma.branchInventory.create({
            data: inventoryData
          })
        }

        imported++
      } catch (error) {
        errors++
        errorDetails.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }
    }

    return NextResponse.json({
      imported,
      errors,
      errorDetails: errorDetails.slice(0, 10), // Limit error details to first 10
      message: `Import completed. ${imported} items imported, ${errors} errors.`
    })
  } catch (error) {
    console.error('Error importing branch inventory:', error)
    return NextResponse.json(
      { error: 'Failed to import branch inventory' },
      { status: 500 }
    )
  }
}
