import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // CSV template with branch fields included
    const csvTemplate = `name,description,category,subCategory,type,serialNumber,model,manufacturer,purchaseDate,purchaseCost,warrantyExpiry,status,location,quantity,availableQty,purchaseOrderNo,branchName,city,hardwareEngineerName
Dell Laptop Main Branch,Business laptop for main branch,HARDWARE,Computing Devices,Laptop Computer,DL001MAIN,Latitude 7420,Dell,2024-01-15,55000.00,2027-01-15,AVAILABLE,Main Branch - IT Department,1,1,PO-2024-001,Main Campus,Delhi,Rajesh Kumar
HP Desktop Branch Office,Desktop computer for branch office,HARDWARE,Computing Devices,Desktop Computer,HP002BRANCH,EliteDesk 800,HP,2024-02-01,35000.00,2027-02-01,AVAILABLE,Branch Office - Admin,1,1,PO-2024-002,Delhi Branch,Delhi,Suresh Sharma
Canon Printer Regional,Multifunction printer for regional office,HARDWARE,Peripherals,Printer (Laser),CN003REG,ImageCLASS MF445dw,Canon,2024-01-20,25000.00,2026-01-20,AVAILABLE,Regional Office - Reception,1,1,PO-2024-003,Regional Office Mumbai,Mumbai,Amit Patel
Network Switch Head Office,Managed switch for head office,NETWORKING,Network Infrastructure,Switch (Managed),SW004HEAD,Catalyst 2960-X,Cisco,2024-01-10,45000.00,2027-01-10,AVAILABLE,Head Office - Network Room,1,1,PO-2024-004,Head Office,Delhi,Vikash Singh
Server Rack Data Center,42U server rack for data center,DATACENTER,Rack & Infrastructure,Server Rack (42U),RACK005DC,NetShelter SX,APC,2024-01-05,85000.00,2029-01-05,AVAILABLE,Data Center - Rack Room,1,1,PO-2024-005,Head Office,Delhi,Manoj Gupta`

    return new NextResponse(csvTemplate, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="asset_import_template.csv"'
      }
    })
  } catch (error) {
    console.error('Error generating CSV template:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}
