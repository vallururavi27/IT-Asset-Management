'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon, PencilIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Asset {
  id: string
  name: string
  description?: string
  category: string
  subCategory?: string
  type: string
  serialNumber?: string
  model?: string
  manufacturer?: string
  purchaseDate?: string
  purchaseCost?: number
  warrantyExpiry?: string
  status: string
  location?: string
  quantity: number
  availableQty: number
  assetTag?: string
  condition: string
  osVersion?: string
  capacity?: string
  speed?: string
  formFactor?: string
  powerRating?: string
  purchaseOrderNo?: string
  invoiceNumber?: string
  vendor?: string
  createdAt: string
  updatedAt: string
  assignments: Array<{
    user: { fullName: string | null; email: string }
    department: { name: string } | null
    assignedAt: string
    status: string
  }>
  movements: Array<{
    movementType: string
    quantity: number
    fromLocation?: string
    toLocation?: string
    createdAt: string
    creator: { fullName: string | null; email: string }
  }>
}

export default function AssetDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [asset, setAsset] = useState<Asset | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAsset()
  }, [params.id])

  const fetchAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setAsset(data)
      } else if (response.status === 404) {
        alert('Asset not found')
        router.push('/assets')
      }
    } catch (error) {
      console.error('Error fetching asset:', error)
      alert('Error loading asset')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      AVAILABLE: 'bg-green-100 text-green-800',
      ASSIGNED: 'bg-blue-100 text-blue-800',
      MAINTENANCE: 'bg-yellow-100 text-yellow-800',
      RETIRED: 'bg-red-100 text-red-800',
      DISPOSED: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getConditionBadge = (condition: string) => {
    const colors = {
      NEW: 'bg-green-100 text-green-800',
      REFURBISHED: 'bg-blue-100 text-blue-800',
      USED: 'bg-yellow-100 text-yellow-800',
      DAMAGED: 'bg-red-100 text-red-800',
      OBSOLETE: 'bg-gray-100 text-gray-800'
    }
    return colors[condition as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading asset...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (!asset) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <ComputerDesktopIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Asset not found</h3>
            <p className="text-gray-500 mb-4">The asset you're looking for doesn't exist.</p>
            <Link
              href="/assets"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Assets
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/assets"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Assets
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{asset.name}</h1>
              <p className="mt-2 text-gray-600">{asset.description}</p>
            </div>
            <Link
              href={`/assets/${asset.id}/edit`}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              Edit Asset
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Category</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.category}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Sub Category</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.subCategory || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Type</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Serial Number</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.serialNumber || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Model</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.model || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Manufacturer</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.manufacturer || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Status & Location */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Location</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(asset.status)}`}>
                    {asset.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Condition</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getConditionBadge(asset.condition)}`}>
                    {asset.condition}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Location</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.location || 'N/A'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Quantity</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {asset.availableQty} / {asset.quantity} available
                  </p>
                </div>
              </div>
            </div>

            {/* Purchase Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Purchase Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Date</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {asset.purchaseDate ? new Date(asset.purchaseDate).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Cost</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {asset.purchaseCost ? `₹${asset.purchaseCost.toLocaleString()}` : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Warranty Expiry</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {asset.warrantyExpiry ? new Date(asset.warrantyExpiry).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Purchase Order</label>
                  <p className="mt-1 text-sm text-gray-900">{asset.purchaseOrderNo || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Assignment */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Assignment</h3>
              {asset.assignments.length > 0 ? (
                <div className="space-y-3">
                  {asset.assignments.map((assignment, index) => (
                    <div key={index} className="border-l-4 border-indigo-400 pl-4">
                      <p className="text-sm font-medium text-gray-900">
                        {assignment.user.fullName || assignment.user.email}
                      </p>
                      {assignment.department && (
                        <p className="text-sm text-gray-500">{assignment.department.name}</p>
                      )}
                      <p className="text-xs text-gray-400">
                        Assigned {new Date(assignment.assignedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Not currently assigned</p>
              )}
            </div>

            {/* Recent Movements */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Movements</h3>
              {asset.movements.length > 0 ? (
                <div className="space-y-3">
                  {asset.movements.slice(0, 5).map((movement, index) => (
                    <div key={index} className="border-l-4 border-gray-200 pl-4">
                      <p className="text-sm font-medium text-gray-900">
                        {movement.movementType} ({movement.quantity})
                      </p>
                      <p className="text-sm text-gray-500">
                        {movement.fromLocation && `From: ${movement.fromLocation}`}
                        {movement.toLocation && ` To: ${movement.toLocation}`}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(movement.createdAt).toLocaleDateString()} by{' '}
                        {movement.creator.fullName || movement.creator.email}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No movements recorded</p>
              )}
            </div>

            {/* Asset Metadata */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Metadata</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Asset ID</label>
                  <p className="mt-1 text-sm text-gray-900 font-mono">{asset.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(asset.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(asset.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
