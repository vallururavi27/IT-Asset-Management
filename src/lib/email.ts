import nodemailer from 'nodemailer'

// Email configuration
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.office365.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
}

// Create transporter
const transporter = nodemailer.createTransporter(emailConfig)

// Email templates
export const emailTemplates = {
  dailyReport: (data: any) => ({
    subject: `Daily IT Asset Report - ${new Date().toLocaleDateString('en-IN')}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 800px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #4F46E5; padding-bottom: 20px; margin-bottom: 20px; }
          .company-name { font-size: 24px; font-weight: bold; color: #4F46E5; margin-bottom: 5px; }
          .report-title { font-size: 18px; color: #666; }
          .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
          .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; text-align: center; }
          .stat-number { font-size: 24px; font-weight: bold; color: #4F46E5; }
          .stat-label { font-size: 14px; color: #666; margin-top: 5px; }
          .alert-section { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .alert-title { font-weight: bold; color: #dc2626; margin-bottom: 10px; }
          .alert-item { margin: 5px 0; padding: 5px; background: white; border-radius: 4px; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-name">VARSITY EDIFICATION MANAGEMENT</div>
            <div class="report-title">Daily IT Asset Report</div>
            <div style="color: #666; font-size: 14px;">${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${data.totalAssets}</div>
              <div class="stat-label">Total Assets</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.availableAssets}</div>
              <div class="stat-label">Available Assets</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${data.assignedAssets}</div>
              <div class="stat-label">Assigned Assets</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">₹${data.totalValue.toLocaleString('en-IN')}</div>
              <div class="stat-label">Total Value</div>
            </div>
          </div>

          ${data.lowStockItems.length > 0 ? `
          <div class="alert-section">
            <div class="alert-title">⚠️ Low Stock Alerts (${data.lowStockItems.length} items)</div>
            ${data.lowStockItems.map((item: any) => `
              <div class="alert-item">
                <strong>${item.name}</strong> - Available: ${item.availableQty}/${item.quantity} 
                (${Math.round((item.availableQty/item.quantity)*100)}%)
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${data.expiringWarranties.length > 0 ? `
          <div class="alert-section">
            <div class="alert-title">📅 Warranties Expiring Soon (${data.expiringWarranties.length} items)</div>
            ${data.expiringWarranties.map((item: any) => `
              <div class="alert-item">
                <strong>${item.name}</strong> - Expires: ${new Date(item.warrantyExpiry).toLocaleDateString('en-IN')}
                (${Math.ceil((new Date(item.warrantyExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days)
              </div>
            `).join('')}
          </div>
          ` : ''}

          <div class="footer">
            <p>This is an automated report from VARSITY IT Asset Management System</p>
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  indentRequest: (data: any) => ({
    subject: `Indent Request: ${data.itemName} - ${data.quantity} units`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #F59E0B; padding-bottom: 20px; margin-bottom: 20px; }
          .company-name { font-size: 20px; font-weight: bold; color: #F59E0B; margin-bottom: 5px; }
          .request-details { background: #fef3c7; border: 1px solid #fbbf24; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .detail-row { margin: 8px 0; }
          .label { font-weight: bold; color: #92400e; }
          .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e2e8f0; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="company-name">VARSITY EDIFICATION MANAGEMENT</div>
            <div style="color: #666;">Indent Request Notification</div>
          </div>

          <div class="request-details">
            <h3 style="margin-top: 0; color: #92400e;">📋 Indent Request Details</h3>
            <div class="detail-row"><span class="label">Item Name:</span> ${data.itemName}</div>
            <div class="detail-row"><span class="label">Quantity Requested:</span> ${data.quantity}</div>
            <div class="detail-row"><span class="label">Current Stock:</span> ${data.currentStock}</div>
            <div class="detail-row"><span class="label">Requested By:</span> ${data.requestedBy}</div>
            <div class="detail-row"><span class="label">Department:</span> ${data.department}</div>
            <div class="detail-row"><span class="label">Justification:</span> ${data.justification}</div>
            <div class="detail-row"><span class="label">Request Date:</span> ${new Date().toLocaleDateString('en-IN')}</div>
          </div>

          <div style="text-align: center; margin: 20px 0;">
            <p style="color: #666;">Please review and approve this indent request in the IT Asset Management System.</p>
          </div>

          <div class="footer">
            <p>This is an automated notification from VARSITY IT Asset Management System</p>
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  lowStockAlert: (data: any) => ({
    subject: `🚨 Low Stock Alert: ${data.itemName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .header { text-align: center; border-bottom: 2px solid #DC2626; padding-bottom: 20px; margin-bottom: 20px; }
          .alert-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 15px; margin: 20px 0; }
          .alert-title { font-weight: bold; color: #dc2626; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div style="font-size: 20px; font-weight: bold; color: #DC2626;">⚠️ LOW STOCK ALERT</div>
            <div style="color: #666;">VARSITY EDIFICATION MANAGEMENT</div>
          </div>

          <div class="alert-box">
            <div class="alert-title">Stock Level Critical</div>
            <p><strong>Item:</strong> ${data.itemName}</p>
            <p><strong>Current Stock:</strong> ${data.availableQty} / ${data.totalQty}</p>
            <p><strong>Stock Level:</strong> ${Math.round((data.availableQty/data.totalQty)*100)}%</p>
            <p><strong>Location:</strong> ${data.location}</p>
          </div>

          <p style="color: #666; text-align: center;">
            Immediate action required to replenish stock levels.
          </p>
        </div>
      </body>
      </html>
    `
  })
}

// Send email function
export async function sendEmail(to: string | string[], template: any) {
  try {
    const recipients = Array.isArray(to) ? to.join(',') : to
    
    const mailOptions = {
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: recipients,
      subject: template.subject,
      html: template.html
    }

    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    return { success: true, messageId: result.messageId }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Get admin emails from environment
export function getAdminEmails(): string[] {
  const emails = process.env.ADMIN_EMAILS || ''
  return emails.split(',').map(email => email.trim()).filter(email => email.length > 0)
}

// Get store manager emails
export function getStoreManagerEmails(): string[] {
  const emails = process.env.STORE_MANAGER_EMAILS || 'manager@example.com'
  return emails.split(',').map(email => email.trim()).filter(email => email.length > 0)
}
