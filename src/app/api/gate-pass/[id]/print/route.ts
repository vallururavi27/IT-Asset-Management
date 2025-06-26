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

    // Generate HTML for printing
    const printHTML = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Gate Pass - ${gatePass.gatePassNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .company-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .document-title { font-size: 18px; font-weight: bold; }
            .section { margin-bottom: 20px; }
            .section-title { font-weight: bold; font-size: 16px; margin-bottom: 10px; border-bottom: 1px solid #ccc; }
            .info-row { display: flex; margin-bottom: 8px; }
            .info-label { font-weight: bold; width: 150px; }
            .info-value { flex: 1; }
            .signatures { margin-top: 40px; display: flex; justify-content: space-between; }
            .signature-box { text-align: center; width: 200px; }
            .signature-line { border-top: 1px solid #000; margin-top: 50px; padding-top: 5px; }
            @media print {
                body { margin: 0; }
                .no-print { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="company-name">VARSITY EDIFICATION MANAGEMENT PRIVATE LIMITED</div>
            <div class="document-title">GATE PASS</div>
            <div style="margin-top: 10px;">
                <strong>Gate Pass No:</strong> ${gatePass.gatePassNumber} | 
                <strong>Date:</strong> ${new Date(gatePass.createdAt).toLocaleDateString('en-IN')}
            </div>
        </div>

        <div class="section">
            <div class="section-title">Asset Details</div>
            <div class="info-row">
                <div class="info-label">Asset Name:</div>
                <div class="info-value">${gatePass.asset.name}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Asset Tag:</div>
                <div class="info-value">${gatePass.asset.assetTag || 'N/A'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Serial Number:</div>
                <div class="info-value">${gatePass.asset.serialNumber || 'N/A'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Model:</div>
                <div class="info-value">${gatePass.asset.model || 'N/A'}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Store Manager Details</div>
            <div class="info-row">
                <div class="info-label">Name:</div>
                <div class="info-value">${gatePass.storeManagerName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Email:</div>
                <div class="info-value">${gatePass.storeManagerEmail}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Phone:</div>
                <div class="info-value">${gatePass.storeManagerPhone || 'N/A'}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">Delivery Details</div>
            <div class="info-row">
                <div class="info-label">Delivery Person:</div>
                <div class="info-value">${gatePass.deliveryPersonName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Contact Number:</div>
                <div class="info-value">${gatePass.deliveryPersonContact}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Delivery Date:</div>
                <div class="info-value">${new Date(gatePass.deliveryDate).toLocaleDateString('en-IN')}</div>
            </div>
        </div>

        ${gatePass.hardwareEngineerName || gatePass.approvedBy ? `
        <div class="section">
            <div class="section-title">Hardware Engineer & Approval</div>
            ${gatePass.hardwareEngineerName ? `
            <div class="info-row">
                <div class="info-label">Hardware Engineer:</div>
                <div class="info-value">${gatePass.hardwareEngineerName}</div>
            </div>
            ` : ''}
            ${gatePass.hardwareEngineerContact ? `
            <div class="info-row">
                <div class="info-label">Engineer Contact:</div>
                <div class="info-value">${gatePass.hardwareEngineerContact}</div>
            </div>
            ` : ''}
            ${gatePass.approvedBy ? `
            <div class="info-row">
                <div class="info-label">Approved By:</div>
                <div class="info-value">${gatePass.approvedBy}</div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        <div class="section">
            <div class="section-title">Destination Details</div>
            <div class="info-row">
                <div class="info-label">Campus:</div>
                <div class="info-value">${gatePass.campus}</div>
            </div>
            <div class="info-row">
                <div class="info-label">Department:</div>
                <div class="info-value">${gatePass.department}</div>
            </div>
            <div class="info-row">
                <div class="info-label">End User Name:</div>
                <div class="info-value">${gatePass.endUserName}</div>
            </div>
            <div class="info-row">
                <div class="info-label">End User Email:</div>
                <div class="info-value">${gatePass.endUserEmail || 'N/A'}</div>
            </div>
            <div class="info-row">
                <div class="info-label">End User Phone:</div>
                <div class="info-value">${gatePass.endUserPhone || 'N/A'}</div>
            </div>
        </div>

        ${gatePass.purpose ? `
        <div class="section">
            <div class="section-title">Purpose</div>
            <div>${gatePass.purpose}</div>
        </div>
        ` : ''}

        ${gatePass.remarks ? `
        <div class="section">
            <div class="section-title">Remarks</div>
            <div>${gatePass.remarks}</div>
        </div>
        ` : ''}

        <div class="signatures">
            <div class="signature-box">
                <div class="signature-line">Store Manager Signature</div>
                <div style="margin-top: 5px; font-size: 12px;">${gatePass.storeManagerName}</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Delivery Person Signature</div>
                <div style="margin-top: 5px; font-size: 12px;">${gatePass.deliveryPersonName}</div>
            </div>
            <div class="signature-box">
                <div class="signature-line">Security Signature</div>
                <div style="margin-top: 5px; font-size: 12px;">Gate Security</div>
            </div>
        </div>

        <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #666;">
            This is a computer generated gate pass. Valid for single use only.
        </div>

        <script>
            window.onload = function() {
                window.print();
            }
        </script>
    </body>
    </html>
    `

    return new NextResponse(printHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error generating gate pass print:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
