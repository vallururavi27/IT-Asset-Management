'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

interface Asset {
  id: string
  name: string
  description: string | null
  category: 'HARDWARE' | 'SOFTWARE'
  type: string
  serialNumber: string | null
  manufacturer: string | null
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE' | 'RETIRED'
  quantity: number
  availableQty: number
  purchaseCost: number | null
  warrantyExpiry: string | null
  assignments: Array<{
    user: { fullName: string | null; email: string }
    department: { name: string } | null
  }>
}

interface AssetsResponse {
  assets: Asset[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<AssetsResponse['pagination'] | null>(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  useEffect(() => {
    fetchAssets()
  }, [search, category, status, page])

  const fetchAssets = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status })
      })

      const response = await fetch(`/api/assets?${params}`)
      if (response.ok) {
        const data: AssetsResponse = await response.json()
        setAssets(data.assets)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      RETIRED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getCategoryBadge = (category: string) => {
    return category === 'HARDWARE'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-indigo-100 text-indigo-800'
  }

  const handleExport = async (type: string) => {
    try {
      setShowExportMenu(false)
      const response = await fetch(`/api/assets/export?format=csv&type=${type}`)

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `assets_${type}_${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Export failed. Please try again.')
      }
    } catch (error) {
      console.error('Export error:', error)
      alert('Export failed. Please try again.')
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Assets Management</h1>
              <p className="mt-2 text-gray-600">Manage all IT assets for VARSITY EDIFICATION MANAGEMENT</p>
            </div>
            <div className="flex space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                  Export
                </button>
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-50 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleExport('all')}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Export All Assets
                      </button>
                      <button
                        onClick={() => handleExport('available')}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Export Available Assets
                      </button>
                      <button
                        onClick={() => handleExport('assigned')}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Export Assigned Assets
                      </button>
                      <button
                        onClick={() => handleExport('low-stock')}
                        className="block w-full text-left px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-gray-900"
                      >
                        Export Low Stock Items
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/assets/import"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Import CSV
              </Link>
              <Link
                href="/assets/add"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Asset
              </Link>
            </div>
          </div>
        </div>

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
                    placeholder="Search assets..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="" className="text-gray-500 bg-white">All Categories</option>
                  <option value="HARDWARE" className="text-gray-900 bg-white">Hardware</option>
                  <option value="SOFTWARE" className="text-gray-900 bg-white">Software</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="" className="text-gray-500 bg-white">All Status</option>
                  <option value="AVAILABLE" className="text-gray-900 bg-white">Available</option>
                  <option value="ASSIGNED" className="text-gray-900 bg-white">Assigned</option>
                  <option value="MAINTENANCE" className="text-gray-900 bg-white">Maintenance</option>
                  <option value="RETIRED" className="text-gray-900 bg-white">Retired</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setCategory('')
                    setStatus('')
                    setPage(1)
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

        {/* Assets Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading assets...</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Asset Details
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category & Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status & Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Assignment
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {assets.map((asset) => (
                        <tr key={asset.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{asset.name}</div>
                              <div className="text-sm text-gray-500">{asset.description}</div>
                              {asset.serialNumber && (
                                <div className="text-xs text-gray-400">SN: {asset.serialNumber}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryBadge(asset.category)}`}>
                                {asset.category}
                              </span>
                              <span className="text-sm text-gray-600">{asset.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(asset.status)}`}>
                                {asset.status}
                              </span>
                              <span className="text-sm text-gray-600">
                                {asset.availableQty}/{asset.quantity} available
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {asset.assignments.length > 0 ? (
                                <div>
                                  <div className="font-medium">
                                    {asset.assignments[0].user.fullName || asset.assignments[0].user.email}
                                  </div>
                                  {asset.assignments[0].department && (
                                    <div className="text-gray-500">{asset.assignments[0].department.name}</div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-400">Unassigned</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <Link
                                href={`/assets/${asset.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <EyeIcon className="h-5 w-5" />
                              </Link>
                              <Link
                                href={`/assets/${asset.id}/edit`}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </Link>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {pagination && pagination.pages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
                      {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
                      {pagination.total} results
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setPage(page - 1)}
                        disabled={page === 1}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(page + 1)}
                        disabled={page === pagination.pages}
                        className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}
