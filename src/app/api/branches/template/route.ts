import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // CSV template for branch import
    const csvTemplate = `branchName,branchCode,city,location,state,pincode,branchType,hardwareEngineerName,hardwareEngineerEmail,hardwareEngineerPhone,branchManagerName,branchManagerEmail,branchManagerPhone,establishedDate
Main Campus,MC001,Delhi,"123 Education Street, Connaught Place, New Delhi",Delhi,110001,HEAD_OFFICE,Rajesh Kumar,rajesh.kumar@varsitymgmt.com,+91-9876543210,Priya Sharma,priya.sharma@varsitymgmt.com,+91-9876543211,2020-01-15
Delhi Branch,DEL001,Delhi,"456 Learning Avenue, Karol Bagh, New Delhi",Delhi,110005,BRANCH,Suresh Sharma,suresh.sharma@varsitymgmt.com,+91-9876543212,Amit Singh,amit.singh@varsitymgmt.com,+91-9876543213,2021-03-20
Mumbai Regional Office,MUM001,Mumbai,"789 Knowledge Road, Andheri East, Mumbai",Maharashtra,400069,REGIONAL_OFFICE,Amit Patel,amit.patel@varsitymgmt.com,+91-9876543214,Neha Gupta,neha.gupta@varsitymgmt.com,+91-9876543215,2021-06-10
Bangalore Branch,BLR001,Bangalore,"321 Tech Park, Electronic City, Bangalore",Karnataka,560100,BRANCH,Vikash Singh,vikash.singh@varsitymgmt.com,+91-9876543216,Ravi Kumar,ravi.kumar@varsitymgmt.com,+91-9876543217,2022-01-05
Chennai Sub Branch,CHE001,Chennai,"654 Innovation Hub, OMR, Chennai",Tamil Nadu,600096,SUB_BRANCH,Manoj Gupta,manoj.gupta@varsitymgmt.com,+91-9876543218,Kavitha Reddy,kavitha.reddy@varsitymgmt.com,+91-9876543219,2022-08-15`

    return new NextResponse(csvTemplate, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="branch_import_template.csv"'
      }
    })
  } catch (error) {
    console.error('Error generating branch CSV template:', error)
    return NextResponse.json(
      { error: 'Failed to generate template' },
      { status: 500 }
    )
  }
}
