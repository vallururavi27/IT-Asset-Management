'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { ASSET_CATEGORIES, getSubCategories, getAssetTypes } from '@/lib/asset-types'

export default function AddAssetPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
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
    invoiceNumber: '',
    vendor: ''
  })

  const [subCategories, setSubCategories] = useState<string[]>([])
  const [assetTypes, setAssetTypes] = useState<string[]>([])

  useEffect(() => {
    if (formData.category) {
      const subs = getSubCategories(formData.category)
      setSubCategories(subs)
      setFormData(prev => ({ ...prev, subCategory: '', type: '' }))
      setAssetTypes([])
    }
  }, [formData.category])

  useEffect(() => {
    if (formData.category && formData.subCategory) {
      const types = getAssetTypes(formData.category, formData.subCategory)
      setAssetTypes(types)
      setFormData(prev => ({ ...prev, type: '' }))
    }
  }, [formData.category, formData.subCategory])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/assets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        router.push('/assets')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create asset')
      }
    } catch (error) {
      console.error('Error creating asset:', error)
      alert('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/assets"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Assets
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Asset</h1>
          <p className="mt-2 text-gray-600">Create a new asset record for VARSITY EDIFICATION MANAGEMENT</p>
        </div>

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
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
                  placeholder="e.g., Dell Laptop, Office License"
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
                  Sub Category *
                </label>
                <select
                  name="subCategory"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={formData.subCategory}
                  onChange={handleChange}
                  disabled={!formData.category}
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
                  disabled={!formData.subCategory}
                >
                  <option value="" className="text-gray-500 bg-white">Select Asset Type</option>
                  {assetTypes.map((type) => (
                    <option key={type} value={type} className="text-gray-900 bg-white">{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity *
                </label>
                <input
                  type="number"
                  name="quantity"
                  required
                  min="1"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.quantity}
                  onChange={handleChange}
                />
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
                  placeholder="Detailed description of the asset..."
                />
              </div>

              {/* Technical Details */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Details</h3>
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
                  placeholder="Unique serial number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Order No.
                </label>
                <input
                  type="text"
                  name="purchaseOrderNo"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.purchaseOrderNo || ''}
                  onChange={handleChange}
                  placeholder="PO number for tracking"
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
                  placeholder="Model number or name"
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
                  placeholder="e.g., Dell, HP, Microsoft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invoice Number
                </label>
                <input
                  type="text"
                  name="invoiceNumber"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.invoiceNumber || ''}
                  onChange={handleChange}
                  placeholder="Supplier invoice number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vendor Name
                </label>
                <input
                  type="text"
                  name="vendor"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.vendor || ''}
                  onChange={handleChange}
                  placeholder="Vendor/Supplier name"
                />
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
                  placeholder="Physical location or storage"
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
                  placeholder="e.g., VARSITY-LAP-001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  name="condition"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.condition}
                  onChange={handleChange}
                >
                  <option value="NEW">New</option>
                  <option value="REFURBISHED">Refurbished</option>
                  <option value="USED">Used</option>
                  <option value="DAMAGED">Damaged</option>
                  <option value="OBSOLETE">Obsolete</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  OS Version
                </label>
                <input
                  type="text"
                  name="osVersion"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.osVersion}
                  onChange={handleChange}
                  placeholder="e.g., Windows 11 Pro, Ubuntu 22.04"
                />
              </div>

              {/* Specifications */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Technical Specifications</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity
                </label>
                <input
                  type="text"
                  name="capacity"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="e.g., 1TB, 16GB, 500W"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Speed/Frequency
                </label>
                <input
                  type="text"
                  name="speed"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.speed}
                  onChange={handleChange}
                  placeholder="e.g., 3200 MHz, 7200 RPM, 2.4 GHz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Form Factor
                </label>
                <input
                  type="text"
                  name="formFactor"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.formFactor}
                  onChange={handleChange}
                  placeholder="e.g., DIMM, M.2, ATX, 2U Rack"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Power Rating
                </label>
                <input
                  type="text"
                  name="powerRating"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.powerRating}
                  onChange={handleChange}
                  placeholder="e.g., 650W, 120W TDP, 370W PoE"
                />
              </div>

              {/* Financial Information */}
              <div className="md:col-span-2 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Financial Information</h3>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Date
                </label>
                <input
                  type="date"
                  name="purchaseDate"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Purchase Cost (₹)
                </label>
                <input
                  type="number"
                  name="purchaseCost"
                  step="0.01"
                  min="0"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.purchaseCost}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Warranty Expiry
                </label>
                <input
                  type="date"
                  name="warrantyExpiry"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.warrantyExpiry}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="mt-8 flex justify-end space-x-4">
              <Link
                href="/assets"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
