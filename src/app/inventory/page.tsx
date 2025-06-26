'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import {
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface InventoryItem {
  id: string
  name: string
  category: string
  subCategory?: string
  type: string
  totalQuantity: number
  availableQuantity: number
  assignedQuantity: number
  location: string
  manufacturer?: string
  model?: string
  warrantyExpiring: number
  lowStock: boolean
  lastUpdated: string
}

interface InventoryStats {
  totalItems: number
  lowStockItems: number
  expiringWarranties: number
  totalValue: number
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([])
  const [stats, setStats] = useState<InventoryStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [stockFilter, setStockFilter] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [search, categoryFilter, stockFilter])

  const fetchInventory = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(stockFilter && { stockFilter })
      })

      const response = await fetch(`/api/inventory?${params}`)
      if (response.ok) {
        const data = await response.json()
        setInventory(data.inventory)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStockStatus = (item: InventoryItem) => {
    const stockPercentage = (item.availableQuantity / item.totalQuantity) * 100
    
    if (stockPercentage === 0) {
      return { status: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: '❌' }
    } else if (stockPercentage <= 20) {
      return { status: 'Critical Low', color: 'bg-red-100 text-red-800', icon: '⚠️' }
    } else if (stockPercentage <= 50) {
      return { status: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: '⚡' }
    } else {
      return { status: 'In Stock', color: 'bg-green-100 text-green-800', icon: '✅' }
    }
  }

  const createIndentRequest = (itemId: string, itemName: string) => {
    // This would typically open a modal or navigate to indent creation page
    const quantity = prompt(`Create indent request for ${itemName}.\nEnter required quantity:`)
    if (quantity && parseInt(quantity) > 0) {
      alert(`Indent request created for ${quantity} units of ${itemName}`)
      // Here you would call an API to create the indent request
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
              <p className="mt-2 text-gray-600">Monitor store items, stock levels, and create indent requests</p>
            </div>
            <Link
              href="/inventory/create-indent"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
              Create Indent Request
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ArchiveBoxIcon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Items</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Low Stock</h3>
                  <p className="text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <CalendarIcon className="h-8 w-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Expiring Soon</h3>
                  <p className="text-2xl font-bold text-yellow-600">{stats.expiringWarranties}</p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-2xl">₹</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Total Value</h3>
                  <p className="text-2xl font-bold text-green-600">
                    ₹{stats.totalValue.toLocaleString('en-IN')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Level</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <option value="">All Stock Levels</option>
                  <option value="low">Low Stock</option>
                  <option value="critical">Critical Low</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setCategoryFilter('')
                    setStockFilter('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reset Filters
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
                <p className="mt-2 text-gray-600">Loading inventory...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantities
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Warranty Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventory.map((item) => {
                      const stockStatus = getStockStatus(item)
                      return (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.category} • {item.type}
                              </div>
                              {item.manufacturer && (
                                <div className="text-xs text-gray-400">
                                  {item.manufacturer} {item.model}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                              <span className="mr-1">{stockStatus.icon}</span>
                              {stockStatus.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>
                              <div>Total: <strong>{item.totalQuantity}</strong></div>
                              <div>Available: <strong>{item.availableQuantity}</strong></div>
                              <div>Assigned: <strong>{item.assignedQuantity}</strong></div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.warrantyExpiring > 0 ? (
                              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {item.warrantyExpiring} expiring
                              </span>
                            ) : (
                              <span className="text-sm text-gray-500">No issues</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => createIndentRequest(item.id, item.name)}
                              className="text-indigo-600 hover:text-indigo-900 flex items-center"
                            >
                              <PlusIcon className="h-4 w-4 mr-1" />
                              Create Indent
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
