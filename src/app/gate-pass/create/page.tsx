'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Asset {
  id: string
  name: string
  serialNumber?: string
  assetTag?: string
  model?: string
  status: string
}

export default function CreateGatePassPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [assets, setAssets] = useState<Asset[]>([])
  const [formData, setFormData] = useState({
    assetId: '',
    storeManagerName: '',
    storeManagerEmail: '',
    storeManagerPhone: '',
    deliveryPersonName: '',
    deliveryPersonContact: '',
    hardwareEngineerName: '',
    hardwareEngineerContact: '',
    approvedBy: '',
    campus: '',
    department: '',
    endUserName: '',
    endUserEmail: '',
    endUserPhone: '',
    purpose: '',
    remarks: ''
  })

  useEffect(() => {
    fetchAvailableAssets()
  }, [])

  const fetchAvailableAssets = async () => {
    try {
      const response = await fetch('/api/assets?status=AVAILABLE&limit=100')
      if (response.ok) {
        const data = await response.json()
        setAssets(data.assets || [])
      }
    } catch (error) {
      console.error('Error fetching assets:', error)
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
      const response = await fetch('/api/gate-pass', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const gatePass = await response.json()
        alert(`Gate Pass ${gatePass.gatePassNumber} created successfully!`)
        router.push('/gate-pass')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating gate pass:', error)
      alert('Error creating gate pass')
    } finally {
      setLoading(false)
    }
  }

  const campuses = [
    'Main Campus - Hyderabad',
    'Branch Campus - Bangalore',
    'Branch Campus - Chennai',
    'Branch Campus - Mumbai',
    'Branch Campus - Delhi'
  ]

  const departments = [
    'Information Technology',
    'Computer Science',
    'Electronics & Communication',
    'Mechanical Engineering',
    'Civil Engineering',
    'Administration',
    'Finance & Accounts',
    'Human Resources',
    'Library',
    'Hostel Management'
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/gate-pass"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Gate Passes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create Gate Pass</h1>
          <p className="mt-2 text-gray-600">Generate a gate pass for asset delivery</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Asset Selection */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Asset Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Asset *
              </label>
              <select
                name="assetId"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.assetId}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500 bg-white">Select an asset</option>
                {assets.map((asset) => (
                  <option key={asset.id} value={asset.id} className="text-gray-900 bg-white">
                    {asset.name} - {asset.assetTag || asset.serialNumber || 'No Tag'}
                  </option>
                ))}
              </select>
            </div>

            {/* Store Manager Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Store Manager Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Manager Name *
              </label>
              <input
                type="text"
                name="storeManagerName"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.storeManagerName}
                onChange={handleChange}
                placeholder="Full name of store manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Manager Email *
              </label>
              <input
                type="email"
                name="storeManagerEmail"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.storeManagerEmail}
                onChange={handleChange}
                placeholder="store.manager@varsitymgmt.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Store Manager Phone
              </label>
              <input
                type="tel"
                name="storeManagerPhone"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.storeManagerPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Delivery Person Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delivery Person Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Person Name *
              </label>
              <input
                type="text"
                name="deliveryPersonName"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.deliveryPersonName}
                onChange={handleChange}
                placeholder="Name of person delivering the asset"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Delivery Person Contact *
              </label>
              <input
                type="tel"
                name="deliveryPersonContact"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.deliveryPersonContact}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Engineer Name
              </label>
              <input
                type="text"
                name="hardwareEngineerName"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.hardwareEngineerName}
                onChange={handleChange}
                placeholder="Name of hardware engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Engineer Contact
              </label>
              <input
                type="tel"
                name="hardwareEngineerContact"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.hardwareEngineerContact}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Approved By
              </label>
              <input
                type="text"
                name="approvedBy"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.approvedBy}
                onChange={handleChange}
                placeholder="Name of person who approved this gate pass"
              />
            </div>

            {/* Destination Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Destination Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Campus *
              </label>
              <select
                name="campus"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.campus}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500 bg-white">Select Campus</option>
                {campuses.map((campus) => (
                  <option key={campus} value={campus} className="text-gray-900 bg-white">{campus}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <select
                name="department"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="" className="text-gray-500 bg-white">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept} className="text-gray-900 bg-white">{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End User Name *
              </label>
              <input
                type="text"
                name="endUserName"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endUserName}
                onChange={handleChange}
                placeholder="Name of the person receiving the asset"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End User Email
              </label>
              <input
                type="email"
                name="endUserEmail"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endUserEmail}
                onChange={handleChange}
                placeholder="user@varsitymgmt.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End User Phone
              </label>
              <input
                type="tel"
                name="endUserPhone"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.endUserPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Additional Information */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Purpose
              </label>
              <input
                type="text"
                name="purpose"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.purpose}
                onChange={handleChange}
                placeholder="Purpose of asset delivery"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks
              </label>
              <textarea
                name="remarks"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any additional remarks or instructions"
              />
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/gate-pass"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Gate Pass'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
