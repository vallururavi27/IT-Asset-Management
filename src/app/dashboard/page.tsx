'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/Layout'
import {
  ComputerDesktopIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusIcon,
  ArrowsRightLeftIcon,
  EyeIcon,
  TruckIcon,
  CloudArrowUpIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline'

interface DashboardStats {
  overview: {
    totalAssets: number
    availableAssets: number
    assignedAssets: number
    totalUsers: number
    totalDepartments: number
    totalSoftwareLicenses: number
    usedSoftwareLicenses: number
    availableSoftwareLicenses: number
  }
  recentMovements: Array<{
    id: string
    movementType: string
    quantity: number
    movementDate: string
    asset: { name: string }
    creator: { fullName: string | null, email: string }
  }>
  charts: {
    assetsByCategory: Array<{ category: string, count: number }>
    assetsByStatus: Array<{ status: string, count: number }>
  }
  alerts: {
    upcomingWarrantyExpiry: Array<{
      id: string
      name: string
      warrantyExpiry: string
      manufacturer: string | null
    }>
  }
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">Error loading dashboard</div>
      </div>
    )
  }

  const statCards = [
    {
      title: 'Total Assets',
      value: stats.overview.totalAssets,
      icon: ComputerDesktopIcon,
      color: 'bg-blue-500'
    },
    {
      title: 'Available Assets',
      value: stats.overview.availableAssets,
      icon: ComputerDesktopIcon,
      color: 'bg-green-500'
    },
    {
      title: 'Assigned Assets',
      value: stats.overview.assignedAssets,
      icon: ComputerDesktopIcon,
      color: 'bg-yellow-500'
    },
    {
      title: 'Total Users',
      value: stats.overview.totalUsers,
      icon: UserGroupIcon,
      color: 'bg-purple-500'
    },
    {
      title: 'Departments',
      value: stats.overview.totalDepartments,
      icon: BuildingOfficeIcon,
      color: 'bg-indigo-500'
    },
    {
      title: 'Software Licenses',
      value: `${stats.overview.usedSoftwareLicenses}/${stats.overview.totalSoftwareLicenses}`,
      icon: DocumentTextIcon,
      color: 'bg-pink-500'
    }
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IT Asset Management
              </h1>
              <h2 className="text-xl font-medium text-gray-600 mt-2">Professional Dashboard Overview</h2>
            </div>
            <div className="flex space-x-3">
              <Link
                href="/assets/add"
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Asset
              </Link>
              <Link
                href="/assets/import"
                className="btn-secondary inline-flex items-center"
              >
                <CloudArrowUpIcon className="h-4 w-4 mr-2" />
                Import Assets
              </Link>
            </div>
          </div>
        </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, index) => (
              <div key={index} className="card group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="card-body">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {card.value}
                      </p>
                    </div>
                    <div className={`${card.color} p-4 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <card.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Movements */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Asset Movements
                </h3>
                <div className="space-y-3">
                  {stats.recentMovements.slice(0, 5).map((movement) => (
                    <div key={movement.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {movement.asset.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {movement.movementType} - Qty: {movement.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">
                          {new Date(movement.movementDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">
                          by {movement.creator.fullName || movement.creator.email}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Warranty Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4 flex items-center">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                  Warranty Expiring Soon
                </h3>
                <div className="space-y-3">
                  {stats.alerts.upcomingWarrantyExpiry.length === 0 ? (
                    <p className="text-sm text-gray-500">No warranties expiring soon</p>
                  ) : (
                    stats.alerts.upcomingWarrantyExpiry.map((asset) => (
                      <div key={asset.id} className="flex items-center justify-between py-2 border-b border-gray-200">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {asset.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {asset.manufacturer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-red-600">
                            {new Date(asset.warrantyExpiry).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
              <Link
                href="/assets/add"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Asset
              </Link>
              <Link
                href="/assets/import"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                Import CSV
              </Link>
              <Link
                href="/inventory"
                className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <ArchiveBoxIcon className="h-5 w-5 mr-2" />
                Inventory
              </Link>
              <Link
                href="/gate-pass/create"
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <TruckIcon className="h-5 w-5 mr-2" />
                Gate Pass
              </Link>
              <Link
                href="/assets"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <EyeIcon className="h-5 w-5 mr-2" />
                View Assets
              </Link>
              <Link
                href="/reports"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium text-center flex items-center justify-center"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Reports
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
