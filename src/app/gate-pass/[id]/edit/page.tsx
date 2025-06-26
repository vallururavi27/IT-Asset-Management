'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

interface GatePass {
  id: string
  gatePassNumber: string
  status: 'ISSUED' | 'IN_TRANSIT' | 'DELIVERED' | 'RECEIVED' | 'CANCELLED'
  deliveredDate?: string
  receivedBy?: string
  grnNumber?: string
  grnDate?: string
  hardwareEngineerName?: string
  hardwareEngineerContact?: string
  approvedBy?: string
  asset: {
    name: string
    serialNumber?: string
    assetTag?: string
  }
  endUserName: string
  campus: string
  department: string
}

export default function EditGatePassPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [gatePass, setGatePass] = useState<GatePass | null>(null)
  const [formData, setFormData] = useState({
    status: '',
    receivedBy: '',
    grnNumber: '',
    remarks: ''
  })

  useEffect(() => {
    fetchGatePass()
  }, [params.id])

  const fetchGatePass = async () => {
    try {
      const response = await fetch(`/api/gate-pass/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setGatePass(data)
        setFormData({
          status: data.status,
          receivedBy: data.receivedBy || '',
          grnNumber: data.grnNumber || '',
          remarks: ''
        })
      }
    } catch (error) {
      console.error('Error fetching gate pass:', error)
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
      const response = await fetch(`/api/gate-pass/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        alert('Gate Pass updated successfully!')
        router.push('/gate-pass')
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error updating gate pass:', error)
      alert('Error updating gate pass')
    } finally {
      setLoading(false)
    }
  }

  if (!gatePass) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <p className="mt-2 text-gray-600">Loading gate pass...</p>
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
            href="/gate-pass"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Gate Passes
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Update Gate Pass Status</h1>
          <p className="mt-2 text-gray-600">Gate Pass: {gatePass.gatePassNumber}</p>
        </div>

        {/* Gate Pass Details */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Gate Pass Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Asset:</span>
              <p className="text-sm text-gray-900">{gatePass.asset.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Asset Tag:</span>
              <p className="text-sm text-gray-900">{gatePass.asset.assetTag || 'N/A'}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Destination:</span>
              <p className="text-sm text-gray-900">{gatePass.campus} - {gatePass.department}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">End User:</span>
              <p className="text-sm text-gray-900">{gatePass.endUserName}</p>
            </div>
          </div>
        </div>

        {/* Status Update Form */}
        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Update Status & Tracking</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                name="status"
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="ISSUED">Issued</option>
                <option value="IN_TRANSIT">In Transit</option>
                <option value="DELIVERED">Delivered</option>
                <option value="RECEIVED">Received (GRN Created)</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            {(formData.status === 'DELIVERED' || formData.status === 'RECEIVED') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Received By
                </label>
                <input
                  type="text"
                  name="receivedBy"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.receivedBy}
                  onChange={handleChange}
                  placeholder="Name of person who received the asset"
                />
              </div>
            )}

            {formData.status === 'RECEIVED' && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  GRN Number *
                </label>
                <input
                  type="text"
                  name="grnNumber"
                  required={formData.status === 'RECEIVED'}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={formData.grnNumber}
                  onChange={handleChange}
                  placeholder="Goods Received Note number for tracking"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter the GRN number to complete the delivery tracking process
                </p>
              </div>
            )}

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Update Remarks
              </label>
              <textarea
                name="remarks"
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.remarks}
                onChange={handleChange}
                placeholder="Any remarks about the status update"
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
              {loading ? 'Updating...' : 'Update Status'}
            </button>
          </div>
        </form>

        {/* Status Flow Information */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Gate Pass Status Flow:</h4>
          <div className="text-sm text-blue-800">
            <p><strong>ISSUED</strong> → Asset ready for delivery</p>
            <p><strong>IN_TRANSIT</strong> → Asset picked up by delivery person</p>
            <p><strong>DELIVERED</strong> → Asset delivered to end user</p>
            <p><strong>RECEIVED</strong> → GRN created, delivery process complete</p>
            <p><strong>CANCELLED</strong> → Gate pass cancelled</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
