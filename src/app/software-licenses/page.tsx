'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  KeyIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface SoftwareLicense {
  id: string
  softwareName: string
  version: string | null
  licenseKey: string | null
  licenseType: string
  totalLicenses: number
  usedLicenses: number
  availableLicenses: number
  purchaseDate: string | null
  expiryDate: string | null
  cost: number | null
  vendor: string | null
  isActive: boolean
  createdAt: string
}

export default function SoftwareLicensesPage() {
  const [licenses, setLicenses] = useState<SoftwareLicense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [licenseType, setLicenseType] = useState('')

  useEffect(() => {
    fetchLicenses()
  }, [search, licenseType])

  const fetchLicenses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (licenseType) params.append('licenseType', licenseType)

      const response = await fetch(`/api/software-licenses?${params}`)
      if (response.ok) {
        const data = await response.json()
        setLicenses(data.licenses || [])
      } else {
        setLicenses([])
      }
    } catch (error) {
      console.error('Error fetching software licenses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLicenseTypeBadge = (type: string) => {
    const colors = {
      PERPETUAL: 'bg-green-100 text-green-800',
      SUBSCRIPTION: 'bg-blue-100 text-blue-800',
      VOLUME: 'bg-purple-100 text-purple-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getExpiryStatus = (expiryDate: string | null) => {
    if (!expiryDate) return { status: 'No Expiry', color: 'text-gray-500' }
    
    const expiry = new Date(expiryDate)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysUntilExpiry < 0) return { status: 'Expired', color: 'text-red-600' }
    if (daysUntilExpiry <= 30) return { status: `${daysUntilExpiry} days left`, color: 'text-orange-600' }
    if (daysUntilExpiry <= 90) return { status: `${daysUntilExpiry} days left`, color: 'text-yellow-600' }
    return { status: `${daysUntilExpiry} days left`, color: 'text-green-600' }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Software Licenses</h1>
              <p className="mt-2 text-gray-600">Manage software licenses and track usage</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              Add License
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search software..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">License Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                >
                  <option value="" className="text-gray-500 bg-white">All Types</option>
                  <option value="PERPETUAL" className="text-gray-900 bg-white">Perpetual</option>
                  <option value="SUBSCRIPTION" className="text-gray-900 bg-white">Subscription</option>
                  <option value="VOLUME" className="text-gray-900 bg-white">Volume</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setLicenseType('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Licenses Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading software licenses...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Software Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        License Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usage
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Expiry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {licenses.map((license) => {
                      const expiryStatus = getExpiryStatus(license.expiryDate)
                      return (
                        <tr key={license.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
                              <div>
                                <div className="text-sm font-medium text-gray-900">{license.softwareName}</div>
                                <div className="text-sm text-gray-500">
                                  {license.version && `v${license.version}`}
                                  {license.vendor && ` • ${license.vendor}`}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col space-y-1">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLicenseTypeBadge(license.licenseType)}`}>
                                {license.licenseType}
                              </span>
                              {license.licenseKey && (
                                <div className="flex items-center text-xs text-gray-500">
                                  <KeyIcon className="h-3 w-3 mr-1" />
                                  {license.licenseKey.substring(0, 8)}...
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <div className="text-sm font-medium text-gray-900">
                                {license.usedLicenses} / {license.totalLicenses}
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                <div 
                                  className="bg-indigo-600 h-2 rounded-full" 
                                  style={{ width: `${(license.usedLicenses / license.totalLicenses) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                {license.availableLicenses} available
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                              <span className={`text-sm ${expiryStatus.color}`}>
                                {expiryStatus.status}
                              </span>
                            </div>
                            {license.expiryDate && (
                              <div className="text-xs text-gray-500">
                                {new Date(license.expiryDate).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-indigo-600 hover:text-indigo-900">
                                <PencilIcon className="h-5 w-5" />
                              </button>
                              <button className="text-red-600 hover:text-red-900">
                                <TrashIcon className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
            
            {!loading && licenses.length === 0 && (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No software licenses found</h3>
                <p className="text-gray-500">
                  {search || licenseType ? 'Try adjusting your search criteria.' : 'Get started by adding your first software license.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{licenses.length}</div>
                <div className="text-sm text-gray-500">Total Licenses</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {licenses.reduce((sum, l) => sum + l.totalLicenses, 0)}
                </div>
                <div className="text-sm text-gray-500">Total Seats</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {licenses.reduce((sum, l) => sum + l.usedLicenses, 0)}
                </div>
                <div className="text-sm text-gray-500">Used Seats</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                <div className="h-4 w-4 bg-orange-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {licenses.filter(l => {
                    if (!l.expiryDate) return false
                    const daysUntilExpiry = Math.ceil((new Date(l.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
                    return daysUntilExpiry <= 90 && daysUntilExpiry > 0
                  }).length}
                </div>
                <div className="text-sm text-gray-500">Expiring Soon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
