'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/Layout'
import AddDepartmentModal from '@/components/AddDepartmentModal'
import EditDepartmentModal from '@/components/EditDepartmentModal'
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  BuildingOfficeIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface Department {
  id: string
  name: string
  description: string | null
  managerId: string | null
  branchId: string | null
  isActive: boolean
  createdAt: string
  _count: {
    users: number
    assetAssignments: number
  }
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    managerId: '',
    branchId: ''
  })
  const [users, setUsers] = useState<any[]>([])
  const [branches, setBranches] = useState<any[]>([])
  const [formLoading, setFormLoading] = useState(false)

  useEffect(() => {
    fetchDepartments()
  }, [search])

  const fetchDepartments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) params.append('search', search)

      const response = await fetch(`/api/departments?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDepartments(Array.isArray(data) ? data : [])
      } else {
        setDepartments([])
      }
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setShowEditModal(true)
  }

  const handleDelete = async (department: Department) => {
    if (confirm(`Are you sure you want to delete the department "${department.name}"? This action cannot be undone.`)) {
      try {
        const response = await fetch(`/api/departments/${department.id}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          alert('Department deleted successfully!')
          fetchDepartments()
        } else {
          const error = await response.json()
          alert(`Error: ${error.error}`)
        }
      } catch (error) {
        console.error('Error deleting department:', error)
        alert('Error deleting department')
      }
    }
  }

  const fetchUsersAndBranches = async () => {
    try {
      const [usersRes, branchesRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/branches')
      ])

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (branchesRes.ok) {
        const branchesData = await branchesRes.json()
        setBranches(branchesData.branches || [])
      }
    } catch (error) {
      console.error('Error fetching users and branches:', error)
    }
  }

  const handleShowAddForm = () => {
    setShowAddForm(true)
    fetchUsersAndBranches()
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const response = await fetch('/api/departments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          managerId: formData.managerId || null,
          branchId: formData.branchId || null
        })
      })

      if (response.ok) {
        alert('Department created successfully!')
        setFormData({ name: '', description: '', managerId: '', branchId: '' })
        setShowAddForm(false)
        fetchDepartments()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error creating department:', error)
      alert('Error creating department')
    } finally {
      setFormLoading(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Departments</h1>
              <p className="mt-2 text-gray-600">Manage organizational departments and their assignments</p>
            </div>
            <button
              onClick={handleShowAddForm}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Department
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="max-w-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Departments</label>
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or description..."
                  className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Add Department Form */}
        {showAddForm && (
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add New Department</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      value={formData.name}
                      onChange={handleFormChange}
                      placeholder="e.g., Information Technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department Manager
                    </label>
                    <select
                      name="managerId"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                      value={formData.managerId}
                      onChange={handleFormChange}
                    >
                      <option value="" className="text-gray-500 bg-white">Select a manager (optional)</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id} className="text-gray-900 bg-white">
                          {user.fullName || user.email}
                        </option>
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
                      onChange={handleFormChange}
                      placeholder="Brief description of the department"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </label>
                    <select
                      name="branchId"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white"
                      value={formData.branchId}
                      onChange={handleFormChange}
                    >
                      <option value="" className="text-gray-500 bg-white">Select a branch (optional)</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id} className="text-gray-900 bg-white">
                          {branch.branchName} ({branch.branchCode})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
                  >
                    {formLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create Department'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Departments Grid */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="mt-2 text-gray-600">Loading departments...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                  <div key={department.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <BuildingOfficeIcon className="h-8 w-8 text-indigo-600 mr-3" />
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{department.name}</h3>
                          <p className="text-sm text-gray-500">{department.description || 'No description'}</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(department)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit Department"
                        >
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(department)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Department"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-indigo-600">{department._count?.users || 0}</div>
                        <div className="text-sm text-gray-500">Users</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{department._count?.assetAssignments || 0}</div>
                        <div className="text-sm text-gray-500">Assets</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        department.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {department.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-400">
                        Created {new Date(department.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {!loading && departments.length === 0 && (
              <div className="text-center py-8">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
                <p className="text-gray-500">
                  {search ? 'Try adjusting your search criteria.' : 'Get started by creating your first department.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BuildingOfficeIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">{departments.length}</div>
                <div className="text-sm text-gray-500">Total Departments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {departments.filter(d => d.isActive).length}
                </div>
                <div className="text-sm text-gray-500">Active Departments</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, d) => sum + (d._count?.users || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-purple-600 rounded-full"></div>
                </div>
              </div>
              <div className="ml-4">
                <div className="text-2xl font-bold text-gray-900">
                  {departments.reduce((sum, d) => sum + (d._count?.assetAssignments || 0), 0)}
                </div>
                <div className="text-sm text-gray-500">Total Assets</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      <EditDepartmentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedDepartment(null)
        }}
        onSuccess={() => {
          fetchDepartments()
          setShowEditModal(false)
          setSelectedDepartment(null)
        }}
        department={selectedDepartment}
      />
    </Layout>
  )
}
