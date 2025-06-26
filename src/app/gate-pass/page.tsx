'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  EyeIcon,
  PencilIcon,
  TruckIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface GatePass {
  id: string
  gatePassNumber: string
  storeManagerName: string
  deliveryPersonName: string
  deliveryPersonContact: string
  hardwareEngineerName?: string
  hardwareEngineerContact?: string
  approvedBy?: string
  campus: string
  department: string
  endUserName: string
  status: 'ISSUED' | 'IN_TRANSIT' | 'DELIVERED' | 'RECEIVED' | 'CANCELLED'
  deliveryDate: string
  deliveredDate?: string
  grnNumber?: string
  grnDate?: string
  asset: {
    name: string
    serialNumber?: string
    assetTag?: string
  }
  creator: {
    fullName?: string
    email: string
  }
  createdAt: string
}

export default function GatePassPage() {
  const [gatePasses, setGatePasses] = useState<GatePass[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    fetchGatePasses()
  }, [search, statusFilter])

  const fetchGatePasses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter })
      })

      const response = await fetch(`/api/gate-pass?${params}`)
      if (response.ok) {
        const data = await response.json()
        setGatePasses(Array.isArray(data) ? data : [])
      } else {
        setGatePasses([])
      }
    } catch (error) {
      console.error('Error fetching gate passes:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      ISSUED: 'bg-blue-100 text-blue-800',
      IN_TRANSIT: 'bg-yellow-100 text-yellow-800',
      DELIVERED: 'bg-green-100 text-green-800',
      RECEIVED: 'bg-purple-100 text-purple-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ISSUED':
        return <PlusIcon className="h-4 w-4" />
      case 'IN_TRANSIT':
        return <TruckIcon className="h-4 w-4" />
      case 'DELIVERED':
      case 'RECEIVED':
        return <CheckCircleIcon className="h-4 w-4" />
      default:
        return null
    }
  }

  const handlePrint = (gatePassId: string) => {
    window.open(`/api/gate-pass/${gatePassId}/print`, '_blank')
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gate Pass Management</h1>
              <p className="mt-2 text-gray-600">Track asset deliveries with gate passes and GRN</p>
            </div>
            <Link
              href="/gate-pass/create"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Gate Pass
            </Link>
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
                    placeholder="Search gate passes..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Status</option>
                  <option value="ISSUED">Issued</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="RECEIVED">Received (GRN)</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setStatusFilter('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Gate Passes Table */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading gate passes...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Gate Pass Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Asset & Destination
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status & Tracking
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {gatePasses.map((gatePass) => (
                      <tr key={gatePass.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {gatePass.gatePassNumber}
                            </div>
                            <div className="text-sm text-gray-500">
                              Created: {new Date(gatePass.createdAt).toLocaleDateString('en-IN')}
                            </div>
                            <div className="text-xs text-gray-400">
                              by {gatePass.creator.fullName || gatePass.creator.email}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {gatePass.asset.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {gatePass.campus} - {gatePass.department}
                            </div>
                            <div className="text-sm text-gray-500">
                              To: {gatePass.endUserName}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {gatePass.deliveryPersonName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {gatePass.deliveryPersonContact}
                            </div>
                            <div className="text-sm text-gray-500">
                              Store: {gatePass.storeManagerName}
                            </div>
                            {gatePass.hardwareEngineerName && (
                              <div className="text-sm text-gray-500">
                                HW Eng: {gatePass.hardwareEngineerName}
                              </div>
                            )}
                            {gatePass.approvedBy && (
                              <div className="text-sm text-gray-500">
                                Approved: {gatePass.approvedBy}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(gatePass.status)}`}>
                              {getStatusIcon(gatePass.status)}
                              <span className="ml-1">{gatePass.status}</span>
                            </span>
                            {gatePass.grnNumber && (
                              <div className="text-xs text-gray-600">
                                GRN: {gatePass.grnNumber}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handlePrint(gatePass.id)}
                              className="text-blue-600 hover:text-blue-900"
                              title="Print Gate Pass"
                            >
                              <PrinterIcon className="h-5 w-5" />
                            </button>
                            <Link
                              href={`/gate-pass/${gatePass.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <EyeIcon className="h-5 w-5" />
                            </Link>
                            <Link
                              href={`/gate-pass/${gatePass.id}/edit`}
                              className="text-yellow-600 hover:text-yellow-900"
                              title="Update Status"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          {['ISSUED', 'IN_TRANSIT', 'DELIVERED', 'RECEIVED'].map((status) => (
            <div key={status} className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  {getStatusIcon(status)}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">{status.replace('_', ' ')}</h3>
                  <p className="text-2xl font-bold text-indigo-600">
                    {gatePasses.filter(gp => gp.status === status).length}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
