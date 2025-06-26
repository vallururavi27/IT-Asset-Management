'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  HomeIcon,
  ComputerDesktopIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  ArrowsRightLeftIcon,
  ChartBarIcon,
  TruckIcon,
  ArchiveBoxIcon,
  CloudArrowUpIcon,
  BellIcon,
  KeyIcon,
  DocumentPlusIcon
} from '@heroicons/react/24/outline'

interface LayoutProps {
  children: React.ReactNode
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Assets', href: '/assets', icon: ComputerDesktopIcon },
  { name: 'Add Asset', href: '/assets/add', icon: PlusIcon },
  { name: 'Import Assets', href: '/assets/import', icon: CloudArrowUpIcon },
  { name: 'Create Indent', href: '/inventory/create-indent', icon: DocumentPlusIcon },
  { name: 'Branches', href: '/branches', icon: BuildingOfficeIcon },
  { name: 'Branch Inventory', href: '/branch-inventory', icon: BuildingOffice2Icon },
  { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon },
  { name: 'Asset Movements', href: '/movements', icon: ArrowsRightLeftIcon },
  { name: 'Gate Pass', href: '/gate-pass', icon: TruckIcon },
  { name: 'Users', href: '/users', icon: UserGroupIcon },
  { name: 'Departments', href: '/departments', icon: BuildingOfficeIcon },
  { name: 'Software Licenses', href: '/software-licenses', icon: DocumentTextIcon },
  { name: 'Notifications', href: '/notifications', icon: BellIcon },
  { name: 'Reports', href: '/reports', icon: ChartBarIcon },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-72 flex-col sidebar-modern animate-slide-in">
          <div className="flex h-20 items-center justify-between px-6 border-b border-white border-opacity-20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">IT</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-white">IT ASSET</h1>
                <p className="text-xs text-blue-200">Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          <nav className="flex-1 space-y-2 px-4 py-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="sidebar-item text-blue-100 hover:text-white group"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Donation Section in Mobile Sidebar */}
          <div className="px-4 py-6 border-t border-white border-opacity-20">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 text-center">
              <h3 className="text-white font-semibold text-sm mb-2">💖 Support This Project</h3>
              <p className="text-blue-100 text-xs mb-3">Help us maintain this free tool</p>
              <a
                href="https://github.com/sponsors/vallururavi27"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-xs font-medium transition-all duration-200"
              >
                ❤️ Sponsor
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow sidebar-modern">
          <div className="flex items-center h-24 px-6 border-b border-white border-opacity-20">
            <div className="flex flex-col items-center w-full">
              <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              <h1 className="text-sm font-bold text-white text-center">IT ASSET MANAGEMENT</h1>
              <p className="text-xs text-blue-200 text-center">Professional System</p>
            </div>
          </div>
          <div className="flex flex-col flex-grow">
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="sidebar-item text-blue-100 hover:text-white group"
                >
                  <item.icon className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
            </nav>

            {/* Donation Section in Desktop Sidebar */}
            <div className="px-4 py-4 border-t border-white border-opacity-20">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-4 text-center">
                <h3 className="text-white font-semibold text-sm mb-2">💖 Support This Project</h3>
                <p className="text-blue-100 text-xs mb-3">Help us maintain this free tool</p>
                <div className="space-y-2">
                  <a
                    href="https://github.com/sponsors/vallururavi27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-xs font-medium transition-all duration-200"
                  >
                    ❤️ GitHub Sponsors
                  </a>
                  <a
                    href="https://paypal.me/vallururavi27"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-3 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg text-white text-xs font-medium transition-all duration-200"
                  >
                    💳 PayPal
                  </a>
                </div>
              </div>
            </div>

            <div className="flex-shrink-0 p-4">
              <button
                onClick={handleLogout}
                className="sidebar-item w-full text-blue-100 hover:text-white group"
              >
                <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5 text-blue-300 group-hover:text-white transition-colors" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-20 bg-white bg-opacity-80 backdrop-blur-lg shadow-lg border-b border-gray-200">
          <button
            className="px-6 border-r border-gray-200 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div className="flex flex-1 justify-between px-6">
            <div className="flex flex-1 items-center space-x-4">
              <div className="flex items-center space-x-3 lg:hidden">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">IT</span>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  IT Asset Management System
                </h2>
                <p className="text-sm text-gray-500">Professional Asset Tracking & Management</p>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <div className="hidden md:block">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium text-gray-700">
                    💖 <span className="text-green-600">Free & Open Source</span> -
                    <a href="https://github.com/sponsors/vallururavi27" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 ml-1 underline">
                      Support Us
                    </a>
                  </p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="hidden md:flex items-center px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="mr-2 h-5 w-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="py-8 px-6">
            <div className="animate-fade-in">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
