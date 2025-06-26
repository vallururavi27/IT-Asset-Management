import { NextRequest, NextResponse } from 'next/server'
import { sendEmail, emailTemplates, getAdminEmails, getStoreManagerEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { type, data, recipients } = await request.json()

    let emailTemplate: any
    let emailRecipients: string[]

    switch (type) {
      case 'daily-report':
        emailTemplate = emailTemplates.dailyReport(data)
        emailRecipients = recipients || getAdminEmails()
        break

      case 'low-stock-alert':
        emailTemplate = emailTemplates.lowStockAlert(data)
        emailRecipients = [...getStoreManagerEmails(), ...getAdminEmails()]
        break

      case 'indent-request':
        emailTemplate = emailTemplates.indentRequest(data)
        emailRecipients = getAdminEmails()
        break

      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        )
    }

    const result = await sendEmail(emailRecipients, emailTemplate)

    if (result.success) {
      return NextResponse.json({
        message: 'Notification sent successfully',
        recipients: emailRecipients,
        messageId: result.messageId
      })
    } else {
      return NextResponse.json(
        { error: 'Failed to send notification', details: result.error },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Error sending notification:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
