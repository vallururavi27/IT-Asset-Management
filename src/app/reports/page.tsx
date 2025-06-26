'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  CurrencyRupeeIcon
} from '@heroicons/react/24/outline'

interface ReportData {
  totalAssets: number
  totalValue: number
  assetsByCategory: Array<{ category: string; count: number; value: number }>
  assetsByStatus: Array<{ status: string; count: number }>
  assetsByDepartment: Array<{ department: string; count: number }>
  recentMovements: Array<{
    date: string
    inward: number
    outward: number
  }>
  expiringWarranties: Array<{
    name: string
    warrantyExpiry: string
    daysLeft: number
  }>
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30') // days
  const [reportType, setReportType] = useState('overview')

  useEffect(() => {
    fetchReportData()
  }, [dateRange, reportType])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/reports?days=${dateRange}&type=${reportType}`)
      if (response.ok) {
        const data = await response.json()
        setReportData(data)
      }
    } catch (error) {
      console.error('Error fetching report data:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (type: 'pdf' | 'excel') => {
    try {
      const response = await fetch(`/api/reports/export?type=${type}&days=${dateRange}`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `asset-report-${new Date().toISOString().split('T')[0]}.${type === 'pdf' ? 'pdf' : 'xlsx'}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error exporting report:', error)
    }
  }

  const renderReportContent = () => {
    if (!reportData) return null

    switch (reportType) {
      case 'stock-inventory':
        return renderStockInventoryReport()
      case 'asset-wise':
        return renderAssetWiseReport()
      case 'financial':
        return renderFinancialReport()
      case 'overview':
      default:
        return renderOverviewReport()
    }
  }

  const renderStockInventoryReport = () => (
    <>
      {/* Stock Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Stock</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Available</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.availableAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Assigned</h3>
              <p className="text-2xl font-bold text-orange-600">{reportData.assignedAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Low Stock</h3>
              <p className="text-2xl font-bold text-red-600">{reportData.lowStockAssets?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stock by Location */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stock by Location</h3>
            <div className="space-y-3">
              {reportData.assetsByLocation?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.location}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count} assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Stock by Category</h3>
            <div className="space-y-3">
              {reportData.assetsByCategory?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <span className="text-sm font-medium text-gray-900">{item.totalQuantity} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {reportData.lowStockAssets?.length > 0 && (
        <div className="bg-white shadow rounded-lg mb-8">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reportData.lowStockAssets.map((asset: any) => (
                    <tr key={asset.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">{asset.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )

  const renderAssetWiseReport = () => (
    <>
      {/* Asset Utilization Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Depreciated Value</h3>
              <p className="text-2xl font-bold text-blue-600">₹{reportData.totalDepreciatedValue?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyRupeeIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Depreciation</h3>
              <p className="text-2xl font-bold text-red-600">₹{reportData.totalDepreciationAmount?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ComputerDesktopIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Utilized Assets</h3>
              <p className="text-2xl font-bold text-green-600">{reportData.assetUtilization?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Most Utilized Assets */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Most Utilized Assets</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignments</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current User</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.assetUtilization?.slice(0, 10).map((asset: any) => (
                  <tr key={asset.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.category}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asset.assignmentCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {asset.currentAssignment?.user?.fullName || 'Unassigned'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )

  const renderFinancialReport = () => (
    <>
      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Asset Value</h3>
              <p className="text-2xl font-bold text-green-600">₹{reportData.totalAssetValue?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Monthly Purchases</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.monthlyPurchases?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Cost Centers</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.costCenterAnalysis?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Center Analysis */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Center Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Asset Count</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Value</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.costCenterAnalysis?.map((dept: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{dept.assetCount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{dept.totalValue.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{Math.round(dept.totalValue / dept.assetCount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )

  const renderOverviewReport = () => (
    <>
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ComputerDesktopIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Assets</h3>
              <p className="text-2xl font-bold text-blue-600">{reportData.totalAssets}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyRupeeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Total Value</h3>
              <p className="text-2xl font-bold text-green-600">₹{reportData.totalValue?.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Categories</h3>
              <p className="text-2xl font-bold text-purple-600">{reportData.assetsByCategory?.length || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CalendarIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">Expiring Soon</h3>
              <p className="text-2xl font-bold text-red-600">{reportData.expiringWarranties?.length || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assets by Category</h3>
            <div className="space-y-3">
              {reportData.assetsByCategory?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{item.count} assets</span>
                    <br />
                    <span className="text-xs text-gray-500">₹{item.value?.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Assets by Status</h3>
            <div className="space-y-3">
              {reportData.assetsByStatus?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">{item.status}</span>
                  <span className="text-sm font-medium text-gray-900">{item.count} assets</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )

  if (loading) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            <p className="mt-4 text-gray-600">Generating reports...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
              <p className="mt-2 text-gray-600">Comprehensive asset management reports and insights</p>
            </div>
            <div className="flex space-x-3">
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="overview" className="text-gray-900 bg-white">Overview Report</option>
                <option value="stock-inventory" className="text-gray-900 bg-white">Stock Inventory</option>
                <option value="asset-wise" className="text-gray-900 bg-white">Asset-wise Analysis</option>
                <option value="financial" className="text-gray-900 bg-white">Financial Report</option>
              </select>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="7" className="text-gray-900 bg-white">Last 7 days</option>
                <option value="30" className="text-gray-900 bg-white">Last 30 days</option>
                <option value="90" className="text-gray-900 bg-white">Last 90 days</option>
                <option value="365" className="text-gray-900 bg-white">Last year</option>
              </select>
              <button
                onClick={() => exportReport('excel')}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export Excel
              </button>
              <button
                onClick={() => exportReport('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                Export PDF
              </button>
            </div>
          </div>
        </div>

        {reportData && renderReportContent()}
      </div>
    </Layout>
  )
}
