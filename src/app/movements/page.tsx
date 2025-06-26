'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  MagnifyingGlassIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface AssetMovement {
  id: string
  movementType: 'INWARD' | 'OUTWARD'
  quantity: number
  fromLocation: string | null
  toLocation: string | null
  supplier: string | null
  recipient: string | null
  movementDate: string
  notes: string | null
  asset: {
    name: string
    serialNumber: string | null
  }
  creator: {
    fullName: string | null
    email: string
  }
}

export default function MovementsPage() {
  const [movements, setMovements] = useState<AssetMovement[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [movementType, setMovementType] = useState<string>('')

  useEffect(() => {
    fetchMovements()
  }, [search, movementType])

  const fetchMovements = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(movementType && { movementType })
      })

      const response = await fetch(`/api/movements?${params}`)
      if (response.ok) {
        const data = await response.json()
        setMovements(Array.isArray(data) ? data : [])
      } else {
        setMovements([])
      }
    } catch (error) {
      console.error('Error fetching movements:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMovementIcon = (type: string) => {
    return type === 'INWARD' ? (
      <ArrowDownIcon className="h-5 w-5 text-green-600" />
    ) : (
      <ArrowUpIcon className="h-5 w-5 text-blue-600" />
    )
  }

  const getMovementBadge = (type: string) => {
    return type === 'INWARD'
      ? 'bg-green-100 text-green-800'
      : 'bg-blue-100 text-blue-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Asset Movements</h1>
          <p className="mt-2 text-gray-600">Track all inward and outward asset movements</p>
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
                    placeholder="Search by asset name, supplier, recipient..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Movement Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value)}
                >
                  <option value="">All Movements</option>
                  <option value="INWARD">Inward</option>
                  <option value="OUTWARD">Outward</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setMovementType('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Movements List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading movements...</p>
              </div>
            ) : movements.length === 0 ? (
              <div className="text-center py-8">
                <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No movements found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No asset movements match your current filters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          {getMovementIcon(movement.movementType)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="text-lg font-medium text-gray-900">
                              {movement.asset.name}
                            </h3>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getMovementBadge(movement.movementType)}`}>
                              {movement.movementType}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div>
                              <span className="font-medium">Quantity:</span> {movement.quantity}
                            </div>
                            {movement.asset.serialNumber && (
                              <div>
                                <span className="font-medium">Serial:</span> {movement.asset.serialNumber}
                              </div>
                            )}
                            {movement.fromLocation && (
                              <div>
                                <span className="font-medium">From:</span> {movement.fromLocation}
                              </div>
                            )}
                            {movement.toLocation && (
                              <div>
                                <span className="font-medium">To:</span> {movement.toLocation}
                              </div>
                            )}
                            {movement.supplier && (
                              <div>
                                <span className="font-medium">Supplier:</span> {movement.supplier}
                              </div>
                            )}
                            {movement.recipient && (
                              <div>
                                <span className="font-medium">Recipient:</span> {movement.recipient}
                              </div>
                            )}
                          </div>
                          
                          {movement.notes && (
                            <div className="mt-2 text-sm text-gray-600">
                              <span className="font-medium">Notes:</span> {movement.notes}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-shrink-0 text-right">
                        <div className="text-sm text-gray-900 font-medium">
                          {formatDate(movement.movementDate)}
                        </div>
                        <div className="text-xs text-gray-500">
                          by {movement.creator.fullName || movement.creator.email}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Summary Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowDownIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Inward Movements</h3>
                <p className="text-2xl font-bold text-green-600">
                  {movements.filter(m => m.movementType === 'INWARD').length}
                </p>
                <p className="text-sm text-gray-500">Total assets received</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ArrowUpIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Outward Movements</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {movements.filter(m => m.movementType === 'OUTWARD').length}
                </p>
                <p className="text-sm text-gray-500">Total assets distributed</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
