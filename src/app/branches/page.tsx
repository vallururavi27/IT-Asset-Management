'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import Link from 'next/link'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOffice2Icon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'

interface Branch {
  id: string
  branchName: string
  branchCode: string
  city: string
  location: string
  state?: string
  pincode?: string
  branchType: string
  hardwareEngineerName?: string
  hardwareEngineerEmail?: string
  hardwareEngineerPhone?: string
  branchManagerName?: string
  branchManagerEmail?: string
  branchManagerPhone?: string
  isActive: boolean
  establishedDate?: string
  createdAt: string
  _count?: {
    assets: number
    users: number
    departments: number
    gatePasses: number
  }
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [branchType, setBranchType] = useState('')

  useEffect(() => {
    fetchBranches()
  }, [search, branchType])

  const fetchBranches = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (branchType) params.append('branchType', branchType)

      const response = await fetch(`/api/branches?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBranches(Array.isArray(data) ? data : [])
      } else {
        setBranches([])
      }
    } catch (error) {
      console.error('Error fetching branches:', error)
    } finally {
      setLoading(false)
    }
  }

  const getBranchTypeBadge = (type: string) => {
    const colors = {
      HEAD_OFFICE: 'bg-purple-100 text-purple-800',
      BRANCH: 'bg-blue-100 text-blue-800',
      REGIONAL_OFFICE: 'bg-green-100 text-green-800',
      SUB_BRANCH: 'bg-yellow-100 text-yellow-800'
    }
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getBranchTypeLabel = (type: string) => {
    const labels = {
      HEAD_OFFICE: 'Head Office',
      BRANCH: 'Branch',
      REGIONAL_OFFICE: 'Regional Office',
      SUB_BRANCH: 'Sub Branch'
    }
    return labels[type as keyof typeof labels] || type
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
              <p className="mt-2 text-gray-600">Manage all branches and their details for VARSITY EDIFICATION MANAGEMENT</p>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/branches/import"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Import Branches
              </Link>
              <Link
                href="/branches/add"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Branch
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Branches</label>
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, city, or code..."
                    className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Branch Type</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                  value={branchType}
                  onChange={(e) => setBranchType(e.target.value)}
                >
                  <option value="" className="text-gray-500 bg-white">All Types</option>
                  <option value="HEAD_OFFICE" className="text-gray-900 bg-white">Head Office</option>
                  <option value="BRANCH" className="text-gray-900 bg-white">Branch</option>
                  <option value="REGIONAL_OFFICE" className="text-gray-900 bg-white">Regional Office</option>
                  <option value="SUB_BRANCH" className="text-gray-900 bg-white">Sub Branch</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearch('')
                    setBranchType('')
                  }}
                  className="w-full bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branches Grid */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading branches...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {branches.map((branch) => (
                  <div key={branch.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <BuildingOffice2Icon className="h-8 w-8 text-indigo-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{branch.branchName}</h3>
                          <p className="text-sm text-gray-500">{branch.branchCode}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBranchTypeBadge(branch.branchType)}`}>
                        {getBranchTypeLabel(branch.branchType)}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPinIcon className="h-4 w-4 mr-2" />
                        <span>{branch.city}, {branch.state}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Address:</span> {branch.location}
                      </div>
                      {branch.pincode && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Pincode:</span> {branch.pincode}
                        </div>
                      )}
                    </div>

                    {/* Hardware Engineer */}
                    {branch.hardwareEngineerName && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">Hardware Engineer</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-blue-800">
                            <UserIcon className="h-3 w-3 mr-2" />
                            <span>{branch.hardwareEngineerName}</span>
                          </div>
                          {branch.hardwareEngineerEmail && (
                            <div className="flex items-center text-sm text-blue-800">
                              <EnvelopeIcon className="h-3 w-3 mr-2" />
                              <span>{branch.hardwareEngineerEmail}</span>
                            </div>
                          )}
                          {branch.hardwareEngineerPhone && (
                            <div className="flex items-center text-sm text-blue-800">
                              <PhoneIcon className="h-3 w-3 mr-2" />
                              <span>{branch.hardwareEngineerPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Branch Manager */}
                    {branch.branchManagerName && (
                      <div className="bg-green-50 rounded-lg p-3 mb-4">
                        <h4 className="text-sm font-medium text-green-900 mb-2">Branch Manager</h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-green-800">
                            <UserIcon className="h-3 w-3 mr-2" />
                            <span>{branch.branchManagerName}</span>
                          </div>
                          {branch.branchManagerEmail && (
                            <div className="flex items-center text-sm text-green-800">
                              <EnvelopeIcon className="h-3 w-3 mr-2" />
                              <span>{branch.branchManagerEmail}</span>
                            </div>
                          )}
                          {branch.branchManagerPhone && (
                            <div className="flex items-center text-sm text-green-800">
                              <PhoneIcon className="h-3 w-3 mr-2" />
                              <span>{branch.branchManagerPhone}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Statistics */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{branch._count?.assets || 0}</div>
                        <div className="text-sm text-gray-500">Assets</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{branch._count?.users || 0}</div>
                        <div className="text-sm text-gray-500">Users</div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/branches/${branch.id}`}
                        className="flex-1 bg-indigo-50 text-indigo-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-100 text-center"
                      >
                        View Details
                      </Link>
                      <Link
                        href={`/branches/${branch.id}/edit`}
                        className="flex-1 bg-gray-50 text-gray-700 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 text-center"
                      >
                        Edit
                      </Link>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        branch.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-400">
                        {branch.establishedDate 
                          ? `Est. ${new Date(branch.establishedDate).getFullYear()}`
                          : `Added ${new Date(branch.createdAt).toLocaleDateString()}`
                        }
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && branches.length === 0 && (
              <div className="text-center py-8">
                <BuildingOffice2Icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No branches found</h3>
                <p className="text-gray-500">
                  {search || branchType ? 'Try adjusting your search criteria.' : 'Get started by adding your first branch.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BuildingOffice2Icon className="h-8 w-8 text-indigo-600 mr-3" />
              <div>
                <div className="text-2xl font-bold text-gray-900">{branches.length}</div>
                <div className="text-sm text-gray-500">Total Branches</div>
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
                  {branches.filter(b => b.isActive).length}
                </div>
                <div className="text-sm text-gray-500">Active Branches</div>
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
                  {branches.reduce((sum, b) => sum + (b._count?.assets || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Assets</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {branches.reduce((sum, b) => sum + (b._count?.users || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
