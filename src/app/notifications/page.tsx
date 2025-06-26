'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import {
  BellIcon,
  EnvelopeIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

export default function NotificationsPage() {
  const [loading, setLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')

  const sendDailyReport = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/reports/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sendToEmail: testEmail || undefined })
      })

      if (response.ok) {
        alert('Daily report sent successfully!')
      } else {
        const error = await response.json()
        alert(`Failed to send report: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending daily report:', error)
      alert('Failed to send daily report')
    } finally {
      setLoading(false)
    }
  }

  const sendTestNotification = async (type: string) => {
    try {
      setLoading(true)
      
      let testData: any = {}
      
      switch (type) {
        case 'low-stock':
          testData = {
            itemName: 'Dell Latitude 7420 Laptop',
            availableQty: 2,
            totalQty: 10,
            location: 'IT Storage Room'
          }
          break
        case 'indent-request':
          testData = {
            itemName: 'HP EliteBook 840 G9',
            quantity: 5,
            currentStock: 1,
            requestedBy: 'John Doe',
            department: 'Information Technology',
            justification: 'Replacement for damaged laptops'
          }
          break
      }

      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type === 'low-stock' ? 'low-stock-alert' : 'indent-request',
          data: testData,
          recipients: testEmail ? [testEmail] : undefined
        })
      })

      if (response.ok) {
        alert(`${type} notification sent successfully!`)
      } else {
        const error = await response.json()
        alert(`Failed to send notification: ${error.error}`)
      }
    } catch (error) {
      console.error('Error sending notification:', error)
      alert('Failed to send notification')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Notifications & Alerts</h1>
          <p className="mt-2 text-gray-600">
            Configure and test email notifications for asset management
          </p>
        </div>

        {/* Email Configuration */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <EnvelopeIcon className="h-6 w-6 text-indigo-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Email Configuration</h3>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-blue-900 mb-2">Current Email Settings</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p><strong>SMTP Server:</strong> smtp.office365.com:587</p>
              <p><strong>Admin Emails:</strong> ravi.v@varsitymgmt.com, it.manager@varsitymgmt.com</p>
              <p><strong>Store Manager:</strong> store.manager@varsitymgmt.com</p>
              <p><strong>Daily Report Time:</strong> 09:00 AM</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Test Email Address (Optional)
              </label>
              <input
                type="email"
                placeholder="test@varsitymgmt.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty to send to configured admin emails
              </p>
            </div>
          </div>
        </div>

        {/* Daily Reports */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <DocumentTextIcon className="h-6 w-6 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Daily Reports</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Daily Asset Report</h4>
                <p className="text-sm text-gray-600">
                  Comprehensive daily report with asset statistics, low stock alerts, and warranty expiry notifications
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Includes: Total assets, available/assigned counts, low stock items, expiring warranties
                </div>
              </div>
              <button
                onClick={sendDailyReport}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Alert Notifications */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <BellIcon className="h-6 w-6 text-yellow-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Alert Notifications</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Low Stock Alert</h4>
                <p className="text-sm text-gray-600">
                  Automatic alerts when asset stock levels drop below 20%
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Sent to: Store Manager + Admin emails
                </div>
              </div>
              <button
                onClick={() => sendTestNotification('low-stock')}
                disabled={loading}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                Test Alert
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">Indent Request Notification</h4>
                <p className="text-sm text-gray-600">
                  Notifications when store managers create new indent requests
                </p>
                <div className="mt-2 text-xs text-gray-500">
                  Sent to: Admin emails for approval
                </div>
              </div>
              <button
                onClick={() => sendTestNotification('indent-request')}
                disabled={loading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
              >
                Test Alert
              </button>
            </div>
          </div>
        </div>

        {/* Automated Schedules */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ClockIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Automated Schedules</h3>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Daily Report Schedule</h4>
                  <p className="text-sm text-gray-600">
                    Automatically sends daily asset reports every morning at 9:00 AM
                  </p>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Low Stock Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Continuously monitors stock levels and sends alerts when items are low
                  </p>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Warranty Expiry Alerts</h4>
                  <p className="text-sm text-gray-600">
                    Weekly alerts for assets with warranties expiring in the next 30 days
                  </p>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h4 className="font-medium text-blue-900 mb-2">Email Configuration Instructions</h4>
              <div className="text-sm text-blue-800 space-y-2">
                <p>1. Update the .env.local file with your Office 365 email credentials</p>
                <p>2. Configure SMTP_USER and SMTP_PASS with your admin email account</p>
                <p>3. Update ADMIN_EMAILS with comma-separated admin email addresses</p>
                <p>4. Set STORE_MANAGER_EMAIL for inventory alerts</p>
                <p>5. Restart the application after making changes</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
