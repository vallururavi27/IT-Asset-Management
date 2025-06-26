'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ASSET_CATEGORIES, getSubCategories, getAssetTypes } from '@/lib/asset-types'

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
}

export default function EditAssetPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [asset, setAsset] = useState<Asset | null>(null)
  const [subCategories, setSubCategories] = useState<string[]>([])
  const [assetTypes, setAssetTypes] = useState<string[]>([])
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'HARDWARE',
    subCategory: '',
    type: '',
    serialNumber: '',
    model: '',
    manufacturer: '',
    purchaseDate: '',
    purchaseCost: '',
    warrantyExpiry: '',
    status: 'AVAILABLE',
    location: '',
    quantity: '1',
    assetTag: '',
    condition: 'NEW',
    osVersion: '',
    capacity: '',
    speed: '',
    formFactor: '',
    powerRating: '',
    purchaseOrderNo: '',
    invoiceNumber: ''
  })

  useEffect(() => {
    fetchAsset()
  }, [params.id])

  useEffect(() => {
    if (formData.category) {
      const subs = getSubCategories(formData.category)
      setSubCategories(subs)
    }
  }, [formData.category])

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const types = getAssetTypes(formData.category, formData.subCategory)
      setAssetTypes(types)
    }
  }, [formData.category, formData.subCategory])

  const fetchAsset = async () => {
    try {
      const response = await fetch(`/api/assets/${params.id}`)
      if (response.ok) {
        const assetData = await response.json()
        setAsset(assetData)
        
        // Populate form data
        setFormData({
          name: assetData.name || '',
          description: assetData.description || '',
          category: assetData.category || 'HARDWARE',
          subCategory: assetData.subCategory || '',
          type: assetData.type || '',
          serialNumber: assetData.serialNumber || '',
          model: assetData.model || '',
          manufacturer: assetData.manufacturer || '',
          purchaseDate: assetData.purchaseDate ? assetData.purchaseDate.split('T')[0] : '',
          purchaseCost: assetData.purchaseCost?.toString() || '',
          warrantyExpiry: assetData.warrantyExpiry ? assetData.warrantyExpiry.split('T')[0] : '',
          status: assetData.status || 'AVAILABLE',
          location: assetData.location || '',
          quantity: assetData.quantity?.toString() || '1',
          assetTag: assetData.assetTag || '',
          condition: assetData.condition || 'NEW',
          osVersion: assetData.osVersion || '',
          capacity: assetData.capacity || '',
          speed: assetData.speed || '',
          formFactor: assetData.formFactor || '',
          powerRating: assetData.powerRating || '',
          purchaseOrderNo: assetData.purchaseOrderNo || '',
          invoiceNumber: assetData.invoiceNumber || ''
        })
      } else {
        alert('Asset not found')
        router.push('/assets')
      }
    } catch (error) {
      console.error('Error fetching asset:', error)
      alert('Error loading asset')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/assets/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          purchaseCost: formData.purchaseCost ? parseFloat(formData.purchaseCost) : null,
          quantity: parseInt(formData.quantity),
          purchaseDate: formData.purchaseDate || null,
          warrantyExpiry: formData.warrantyExpiry || null,
          specifications: {
            capacity: formData.capacity || null,
            speed: formData.speed || null,
            formFactor: formData.formFactor || null,
            powerRating: formData.powerRating || null
          }
        })
      })

      if (response.ok) {
        alert('Asset updated successfully!')
        router.push('/assets')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating asset:', error)
      alert('Error updating asset')
    } finally {
      setLoading(false)
    }
  }

  if (!asset) {
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Asset</h1>
          <p className="mt-2 text-gray-600">Update asset information and specifications</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Name *
              </label>
              <input
                type="text"
                name="name"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.category}
                onChange={handleChange}
              >
                {Object.entries(ASSET_CATEGORIES).map(([key, value]) => (
                  <option key={key} value={key} className="text-gray-900 bg-white">{value.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sub Category
              </label>
              <select
                name="subCategory"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.subCategory}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500 bg-white">Select Sub Category</option>
                {subCategories.map((sub) => (
                  <option key={sub} value={sub} className="text-gray-900 bg-white">{sub}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Type *
              </label>
              <select
                name="type"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500 bg-white">Select Asset Type</option>
                {assetTypes.map((type) => (
                  <option key={type} value={type} className="text-gray-900 bg-white">{type}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.description}
                onChange={handleChange}
                placeholder="Detailed description of the asset"
              />
            </div>

            {/* Asset Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Serial Number
              </label>
              <input
                type="text"
                name="serialNumber"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.serialNumber}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Asset Tag
              </label>
              <input
                type="text"
                name="assetTag"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.assetTag}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Model
              </label>
              <input
                type="text"
                name="model"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.model}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manufacturer
              </label>
              <input
                type="text"
                name="manufacturer"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.manufacturer}
                onChange={handleChange}
              />
            </div>

            {/* Status & Location */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Status & Location</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="AVAILABLE" className="text-gray-900 bg-white">Available</option>
                <option value="ASSIGNED" className="text-gray-900 bg-white">Assigned</option>
                <option value="MAINTENANCE" className="text-gray-900 bg-white">Maintenance</option>
                <option value="RETIRED" className="text-gray-900 bg-white">Retired</option>
                <option value="DISPOSED" className="text-gray-900 bg-white">Disposed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Condition
              </label>
              <select
                name="condition"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.condition}
                onChange={handleChange}
              >
                <option value="NEW" className="text-gray-900 bg-white">New</option>
                <option value="REFURBISHED" className="text-gray-900 bg-white">Refurbished</option>
                <option value="USED" className="text-gray-900 bg-white">Used</option>
                <option value="DAMAGED" className="text-gray-900 bg-white">Damaged</option>
                <option value="OBSOLETE" className="text-gray-900 bg-white">Obsolete</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                name="quantity"
                min="1"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/assets"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Asset'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
