'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function AddBranchPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    branchName: '',
    branchCode: '',
    city: '',
    location: '',
    state: '',
    pincode: '',
    branchType: 'BRANCH',
    hardwareEngineerName: '',
    hardwareEngineerEmail: '',
    hardwareEngineerPhone: '',
    branchManagerName: '',
    branchManagerEmail: '',
    branchManagerPhone: '',
    establishedDate: '',
    isActive: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/branches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Branch created successfully!')
        router.push('/branches')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating branch:', error)
      alert('Error creating branch')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/branches"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Branches
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Branch</h1>
          <p className="mt-2 text-gray-600">Create a new branch for VARSITY EDIFICATION MANAGEMENT</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Basic Information */}
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name *
              </label>
              <input
                type="text"
                name="branchName"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchName}
                onChange={handleChange}
                placeholder="e.g., Main Campus, Delhi Branch"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Code *
              </label>
              <input
                type="text"
                name="branchCode"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchCode}
                onChange={handleChange}
                placeholder="e.g., MC001, DEL001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g., Delhi, Mumbai, Bangalore"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                type="text"
                name="state"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g., Delhi, Maharashtra, Karnataka"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address *
              </label>
              <textarea
                name="location"
                required
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.location}
                onChange={handleChange}
                placeholder="Complete address with landmarks"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode
              </label>
              <input
                type="text"
                name="pincode"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="e.g., 110001"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Type *
              </label>
              <select
                name="branchType"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchType}
                onChange={handleChange}
              >
                <option value="HEAD_OFFICE" className="text-gray-900 bg-white">Head Office</option>
                <option value="BRANCH" className="text-gray-900 bg-white">Branch</option>
                <option value="REGIONAL_OFFICE" className="text-gray-900 bg-white">Regional Office</option>
                <option value="SUB_BRANCH" className="text-gray-900 bg-white">Sub Branch</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Established Date
              </label>
              <input
                type="date"
                name="establishedDate"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.establishedDate}
                onChange={handleChange}
              />
            </div>

            {/* Hardware Engineer Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Hardware Engineer Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Engineer Name
              </label>
              <input
                type="text"
                name="hardwareEngineerName"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.hardwareEngineerName}
                onChange={handleChange}
                placeholder="Full name of hardware engineer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Engineer Email
              </label>
              <input
                type="email"
                name="hardwareEngineerEmail"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.hardwareEngineerEmail}
                onChange={handleChange}
                placeholder="engineer@varsitymgmt.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hardware Engineer Phone
              </label>
              <input
                type="tel"
                name="hardwareEngineerPhone"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.hardwareEngineerPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Branch Manager Details */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Branch Manager Details</h3>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Manager Name
              </label>
              <input
                type="text"
                name="branchManagerName"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchManagerName}
                onChange={handleChange}
                placeholder="Full name of branch manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Manager Email
              </label>
              <input
                type="email"
                name="branchManagerEmail"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchManagerEmail}
                onChange={handleChange}
                placeholder="manager@varsitymgmt.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Manager Phone
              </label>
              <input
                type="tel"
                name="branchManagerPhone"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                value={formData.branchManagerPhone}
                onChange={handleChange}
                placeholder="+91 9876543210"
              />
            </div>

            {/* Status */}
            <div className="md:col-span-2 mt-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="isActive"
                  id="isActive"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                  Branch is active
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/branches"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Branch'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}
