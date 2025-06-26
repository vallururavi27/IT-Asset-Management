'use client'

import { useState, useEffect, useRef } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import {
  BuildingOffice2Icon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface BranchInventoryItem {
  id: string
  branchId: string
  branchName: string
  branchCode: string
  city: string
  state: string
  itemName: string
  itemType: string
  category: string
  subCategory: string
  serialNumber: string | null
  model: string | null
  manufacturer: string | null
  purchaseDate: string | null
  purchaseCost: number | null
  warrantyExpiry: string | null
  status: string
  location: string
  quantity: number
  availableQty: number
  assignedQty: number
  condition: string
  lastUpdated: string
  notes: string | null
}

export default function BranchInventoryPage() {
  const [inventory, setInventory] = useState<BranchInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [branchFilter, setBranchFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showImportModal, setShowImportModal] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [branches, setBranches] = useState<{id: string, branchName: string, branchCode: string}[]>([])

  useEffect(() => {
    fetchBranchInventory()
    fetchBranches()
  }, [search, branchFilter, categoryFilter, statusFilter])

  const fetchBranches = async () => {
    try {
      const response = await fetch('/api/branches')
      if (response.ok) {
        const data = await response.json()
        setBranches(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    }
  }

  const fetchBranchInventory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (branchFilter) params.append('branchId', branchFilter)
      if (categoryFilter) params.append('category', categoryFilter)
      if (statusFilter) params.append('status', statusFilter)

      const response = await fetch(`/api/branch-inventory?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(Array.isArray(data) ? data : [])
      } else {
        setInventory([])
      }
    } catch (error) {
      console.error('Error fetching branch inventory:', error)
      setInventory([])
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async (type: string) => {
    try {
      setShowExportMenu(false)
      const params = new URLSearchParams()
      if (branchFilter) params.append('branchId', branchFilter)
      if (categoryFilter) params.append('category', categoryFilter)
      if (statusFilter) params.append('status', statusFilter)
      if (type !== 'all') params.append('type', type)

      const response = await fetch(`/api/branch-inventory/export?${params}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `branch_inventory_${type}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        alert('Export completed successfully!')
      } else {
        alert('Export failed. Please try again.')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  const downloadTemplate = () => {
    // Exact format matching D:\itstore\it-asset-management\inventory.csv
    const csvContent = `branchCode,itemName,itemType,category,subCategory,serialNumber,model,manufacturer,purchaseDate,purchaseCost,warrantyExpiry,status,location,quantity,availableQty,condition,notes
BR001,Dell Latitude 7420 Laptop,Laptop Computer,HARDWARE,Computing Devices,DL7420001,Latitude 7420,Dell,2024-01-15,75000,2027-01-15,AVAILABLE,IT Storage Room,5,5,EXCELLENT,New laptops for faculty
BR001,HP EliteDesk 800 Desktop,Desktop Computer,HARDWARE,Computing Devices,HP800001,EliteDesk 800,HP,2024-01-10,45000,2027-01-10,AVAILABLE,IT Storage Room,10,8,GOOD,Desktop computers for labs
BR001,Dell UltraSharp 24 Monitor,Monitor,HARDWARE,Peripherals,DU24001,UltraSharp U2422H,Dell,2024-01-20,15000,2027-01-20,AVAILABLE,IT Storage Room,15,12,EXCELLENT,Additional displays
BR001,Cisco Catalyst 2960 Switch,Network Switch,NETWORKING,Network Equipment,CS2960001,Catalyst 2960,Cisco,2024-02-01,25000,2027-02-01,ASSIGNED,Server Room,3,1,EXCELLENT,Network infrastructure
BR001,Microsoft Office 365,Software License,SOFTWARE,Productivity Software,,Office 365 Business,Microsoft,2024-01-01,5000,2025-01-01,AVAILABLE,Software Repository,50,25,EXCELLENT,Annual licenses
BR002,Dell Latitude 7420 Laptop,Laptop Computer,HARDWARE,Computing Devices,DL7420003,Latitude 7420,Dell,2024-02-10,75000,2027-02-10,AVAILABLE,Branch IT Room,8,6,EXCELLENT,Branch laptops
BR002,HP EliteDesk 800 Desktop,Desktop Computer,HARDWARE,Computing Devices,HP800003,EliteDesk 800,HP,2024-02-15,45000,2027-02-15,AVAILABLE,Branch IT Room,12,10,GOOD,Branch desktops`

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'branch_inventory_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setImportLoading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/branch-inventory/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      
      if (response.ok) {
        alert(`Import successful! ${result.imported} items imported, ${result.errors || 0} errors.`)
        fetchBranchInventory()
        setShowImportModal(false)
      } else {
        alert(`Import failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Import failed. Please try again.')
    } finally {
      setImportLoading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      RETIRED: 'bg-red-100 text-red-800',
      DAMAGED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getConditionBadge = (condition: string) => {
    const colors = {
      EXCELLENT: 'bg-green-100 text-green-800',
      GOOD: 'bg-blue-100 text-blue-800',
      FAIR: 'bg-yellow-100 text-yellow-800',
      POOR: 'bg-red-100 text-red-800'
    }
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Branch Inventory Management</h1>
              <p className="mt-2 text-gray-600">Manage inventory across all branches with import/export capabilities</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export CSV
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-50 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('all')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      >
                        Export All Branch Inventory
                      </button>
                      <button
                        onClick={() => handleExport('available')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      >
                        Export Available Items Only
                      </button>
                      <button
                        onClick={() => handleExport('assigned')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      >
                        Export Assigned Items Only
                      </button>
                      <button
                        onClick={() => handleExport('low-stock')}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-900 hover:bg-gray-100"
                      >
                        Export Low Stock Items
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import CSV
              </button>
              <Link
                href="/branch-inventory/add"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Item
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={branchFilter}
                  onChange={(e) => setBranchFilter(e.target.value)}
                >
                  <option value="">All Branches</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.branchCode} - {branch.branchName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="HARDWARE">Hardware</option>
                  <option value="SOFTWARE">Software</option>
                  <option value="NETWORKING">Networking</option>
                  <option value="DATACENTER">Data Center</option>
                  <option value="LEGACY">Legacy</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="AVAILABLE">Available</option>
                  <option value="ASSIGNED">Assigned</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="RETIRED">Retired</option>
                  <option value="DAMAGED">Damaged</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setBranchFilter('')
                    setCategoryFilter('')
                    setStatusFilter('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center justify-center"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading branch inventory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Branch & Item Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category & Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantities
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Purchase Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="flex items-center">
                              <BuildingOffice2Icon className="h-5 w-5 text-indigo-600 mr-2" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {item.branchCode} - {item.branchName}
                                </div>
                                <div className="text-sm text-gray-500">{item.city}, {item.state}</div>
                              </div>
                            </div>
                            <div className="mt-2">
                              <div className="text-sm font-medium text-gray-900">{item.itemName}</div>
                              <div className="text-sm text-gray-500">{item.itemType}</div>
                              {item.serialNumber && (
                                <div className="text-xs text-gray-400">SN: {item.serialNumber}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                              {item.category}
                            </span>
                            <span className="text-sm text-gray-600">{item.subCategory}</span>
                            {item.manufacturer && item.model && (
                              <span className="text-xs text-gray-500">{item.manufacturer} {item.model}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-1">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(item.status)}`}>
                              {item.status}
                            </span>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(item.condition)}`}>
                              {item.condition}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div>
                            <div>Total: <strong>{item.quantity}</strong></div>
                            <div>Available: <strong className="text-green-600">{item.availableQty}</strong></div>
                            <div>Assigned: <strong className="text-blue-600">{item.assignedQty}</strong></div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>
                            {item.purchaseDate && (
                              <div>Date: {new Date(item.purchaseDate).toLocaleDateString()}</div>
                            )}
                            {item.purchaseCost && (
                              <div>Cost: ₹{item.purchaseCost.toLocaleString()}</div>
                            )}
                            {item.warrantyExpiry && (
                              <div className={`text-xs ${
                                new Date(item.warrantyExpiry) < new Date()
                                  ? 'text-red-600'
                                  : new Date(item.warrantyExpiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                                    ? 'text-yellow-600'
                                    : 'text-green-600'
                              }`}>
                                Warranty: {new Date(item.warrantyExpiry).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Link
                              href={`/branch-inventory/${item.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                              href={`/branch-inventory/${item.id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Edit Item"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                            <button
                              className="text-red-600 hover:text-red-900"
                              title="Delete Item"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && inventory.length === 0 && (
              <div className="text-center py-8">
                <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No inventory items found</h3>
                <p className="text-gray-500">
                  {search || branchFilter || categoryFilter || statusFilter
                    ? 'Try adjusting your search criteria.'
                    : 'Get started by importing inventory data or adding items manually.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Branch Inventory</h3>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a CSV file with branch inventory data. Must match exact format from D:\itstore\it-asset-management\inventory.csv:
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    branchCode,itemName,itemType,category,subCategory,serialNumber,model,manufacturer,purchaseDate,purchaseCost,warrantyExpiry,status,location,quantity,availableQty,condition,notes
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    ✅ Exact 17 columns in this order<br/>
                    ✅ Compatible with your existing inventory.csv file<br/>
                    ✅ No extra spaces or different column names
                  </p>
                </div>

                <div>
                  <button
                    onClick={downloadTemplate}
                    className="text-indigo-600 hover:text-indigo-500 text-sm underline"
                  >
                    Download CSV Template with Examples
                  </button>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleImport}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    disabled={importLoading}
                  />
                </div>

                {importLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="ml-2 text-sm text-gray-600">Importing...</span>
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowImportModal(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                    disabled={importLoading}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">📋 Branch Inventory Management</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-blue-800 mb-2">✨ Features:</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Manage inventory across all branches</p>
                <p>• Import/export CSV data</p>
                <p>• Track quantities and assignments</p>
                <p>• Monitor warranty and conditions</p>
                <p>• Filter by branch, category, status</p>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">📊 CSV Format - Exact Match:</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• ✅ <strong>100% Compatible</strong> with D:\itstore\it-asset-management\inventory.csv</p>
                <p>• ✅ <strong>Exact 17 columns</strong> in same order</p>
                <p>• ✅ <strong>Same column names</strong> - no modifications needed</p>
                <p>• ✅ <strong>Direct import/export</strong> with your existing file</p>
                <p>• ✅ <strong>Template download</strong> matches your format exactly</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
