'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import {
  ArrowLeftIcon,
  PlusIcon,
  TrashIcon,
  DocumentArrowUpIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface IndentItem {
  id: string
  itemName: string
  itemType: string
  category: string
  quantity: number
  estimatedCost: number | null
  specifications: string
  justification: string
}

export default function CreateIndentPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)
  const [showCsvImport, setShowCsvImport] = useState(false)
  const [showTemplates, setShowTemplates] = useState(false)

  // Basic indent information
  const [indentInfo, setIndentInfo] = useState({
    urgency: 'NORMAL',
    requestedBy: '',
    department: '',
    campus: '',
    contactEmail: '',
    contactPhone: '',
    supplierName: '',
    generalJustification: ''
  })

  // Multiple items array
  const [items, setItems] = useState<IndentItem[]>([
    {
      id: '1',
      itemName: '',
      itemType: '',
      category: 'HARDWARE',
      quantity: 1,
      estimatedCost: null,
      specifications: '',
      justification: ''
    }
  ])

  // Handle indent info changes
  const handleIndentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setIndentInfo(prev => ({ ...prev, [name]: value }))
  }

  // Handle item changes
  const handleItemChange = (itemId: string, field: keyof IndentItem, value: any) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  // Add new item
  const addItem = () => {
    const newItem: IndentItem = {
      id: Date.now().toString(),
      itemName: '',
      itemType: '',
      category: 'HARDWARE',
      quantity: 1,
      estimatedCost: null,
      specifications: '',
      justification: ''
    }
    setItems(prev => [...prev, newItem])
  }

  // Remove item
  const removeItem = (itemId: string) => {
    if (items.length > 1) {
      setItems(prev => prev.filter(item => item.id !== itemId))
    }
  }

  // Duplicate item
  const duplicateItem = (itemId: string) => {
    const itemToDuplicate = items.find(item => item.id === itemId)
    if (itemToDuplicate) {
      const newItem: IndentItem = {
        ...itemToDuplicate,
        id: Date.now().toString(),
        itemName: itemToDuplicate.itemName + ' (Copy)'
      }
      setItems(prev => [...prev, newItem])
    }
  }

  // Add multiple items at once
  const addMultipleItems = (count: number) => {
    const newItems: IndentItem[] = []
    for (let i = 0; i < count; i++) {
      newItems.push({
        id: (Date.now() + i).toString(),
        itemName: '',
        itemType: '',
        category: 'HARDWARE',
        quantity: 1,
        estimatedCost: null,
        specifications: '',
        justification: ''
      })
    }
    setItems(prev => [...prev, ...newItems])
  }

  // Device templates for quick addition
  const deviceTemplates = [
    { name: 'Dell Latitude 7420 Laptop', type: 'Laptop Computer', category: 'HARDWARE', cost: 75000 },
    { name: 'HP EliteDesk 800 Desktop', type: 'Desktop Computer', category: 'HARDWARE', cost: 45000 },
    { name: 'Dell UltraSharp 24" Monitor', type: 'Monitor', category: 'HARDWARE', cost: 15000 },
    { name: 'Cisco Catalyst 2960 Switch', type: 'Network Switch', category: 'NETWORKING', cost: 25000 },
    { name: 'HP LaserJet Pro Printer', type: 'Printer', category: 'HARDWARE', cost: 12000 },
    { name: 'Logitech Wireless Keyboard & Mouse', type: 'Input Device', category: 'HARDWARE', cost: 2500 },
    { name: 'APC UPS 1000VA', type: 'UPS', category: 'HARDWARE', cost: 8000 },
    { name: 'Microsoft Office 365 License', type: 'Software License', category: 'SOFTWARE', cost: 5000 },
    { name: 'Windows 11 Pro License', type: 'Operating System', category: 'SOFTWARE', cost: 8000 },
    { name: 'Antivirus Software License', type: 'Security Software', category: 'SOFTWARE', cost: 3000 }
  ]

  // Add template item
  const addTemplateItem = (template: typeof deviceTemplates[0]) => {
    const newItem: IndentItem = {
      id: Date.now().toString(),
      itemName: template.name,
      itemType: template.type,
      category: template.category,
      quantity: 1,
      estimatedCost: template.cost,
      specifications: '',
      justification: ''
    }
    setItems(prev => [...prev, newItem])
    setShowTemplates(false)
  }

  // CSV Import functionality
  const handleCsvImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const csv = e.target?.result as string
      const lines = csv.split('\n')
      const headers = lines[0].split(',').map(h => h.trim())

      const newItems: IndentItem[] = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim())
        if (values.length >= 4 && values[0]) { // At least name, type, category, quantity
          newItems.push({
            id: (Date.now() + i).toString(),
            itemName: values[0] || '',
            itemType: values[1] || '',
            category: values[2] || 'HARDWARE',
            quantity: parseInt(values[3]) || 1,
            estimatedCost: values[4] ? parseFloat(values[4]) : null,
            specifications: values[5] || '',
            justification: values[6] || ''
          })
        }
      }

      if (newItems.length > 0) {
        setItems(prev => [...prev, ...newItems])
        alert(`Successfully imported ${newItems.length} items from CSV`)
      }
    }
    reader.readAsText(file)
    setShowCsvImport(false)
  }

  // Generate CSV template
  const downloadCsvTemplate = () => {
    const csvContent = 'Item Name,Item Type,Category,Quantity,Estimated Cost,Specifications,Justification\n' +
      'Dell Latitude 7420 Laptop,Laptop Computer,HARDWARE,5,75000,Intel i7 16GB RAM 512GB SSD,Required for new faculty\n' +
      'HP EliteDesk 800 Desktop,Desktop Computer,HARDWARE,10,45000,Intel i5 8GB RAM 256GB SSD,Lab computers replacement\n' +
      'Dell UltraSharp Monitor,Monitor,HARDWARE,15,15000,24 inch Full HD,Additional displays for workstations'

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'indent_items_template.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Submit multiple indent requests
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate that we have at least one item with required fields
      const validItems = items.filter(item => item.itemName.trim() && item.itemType.trim())

      if (validItems.length === 0) {
        alert('Please add at least one item with name and type')
        setLoading(false)
        return
      }

      // Create multiple indent requests (one for each item)
      const requests = validItems.map(item => ({
        itemName: item.itemName,
        itemType: item.itemType,
        category: item.category,
        quantity: item.quantity,
        urgency: indentInfo.urgency,
        justification: item.justification || indentInfo.generalJustification,
        requestedBy: indentInfo.requestedBy,
        department: indentInfo.department,
        campus: indentInfo.campus,
        contactEmail: indentInfo.contactEmail,
        contactPhone: indentInfo.contactPhone,
        estimatedCost: item.estimatedCost,
        supplierName: indentInfo.supplierName,
        specifications: item.specifications
      }))

      // Submit all requests
      const results = await Promise.all(
        requests.map(request =>
          fetch('/api/indent-requests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request)
          })
        )
      )

      const successCount = results.filter(r => r.ok).length
      const failCount = results.length - successCount

      if (successCount > 0) {
        alert(`Successfully created ${successCount} indent request(s)${failCount > 0 ? ` (${failCount} failed)` : ''}`)
        router.push('/inventory')
      } else {
        alert('Failed to create indent requests. Please try again.')
      }
    } catch (error) {
      console.error('Error creating indent requests:', error)
      alert('Error creating indent requests')
    } finally {
      setLoading(false)
    }
  }

  const categories = ['HARDWARE', 'SOFTWARE', 'NETWORKING', 'DATACENTER', 'LEGACY']
  const urgencyLevels = [
    { value: 'LOW', label: 'Low Priority' },
    { value: 'NORMAL', label: 'Normal Priority' },
    { value: 'HIGH', label: 'High Priority' },
    { value: 'URGENT', label: 'Urgent' }
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

  const campuses = [
    'Main Campus - Hyderabad',
    'Branch Campus - Bangalore',
    'Branch Campus - Chennai',
    'Branch Campus - Mumbai',
    'Branch Campus - Delhi'
  ]

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/inventory"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-500 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Inventory
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create Bulk Indent Request</h1>
              <p className="mt-2 text-gray-600">Request multiple IT assets in a single indent (up to 100+ items)</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowTemplates(true)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <ClipboardDocumentListIcon className="h-5 w-5 mr-2" />
                Device Templates
              </button>
              <button
                onClick={() => setShowCsvImport(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <DocumentArrowUpIcon className="h-5 w-5 mr-2" />
                Import CSV
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Indent Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-6">General Indent Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested By *
                </label>
                <input
                  type="text"
                  name="requestedBy"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.requestedBy}
                  onChange={handleIndentInfoChange}
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  name="department"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.department}
                  onChange={handleIndentInfoChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campus
                </label>
                <select
                  name="campus"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.campus}
                  onChange={handleIndentInfoChange}
                >
                  <option value="">Select Campus</option>
                  {campuses.map((campus) => (
                    <option key={campus} value={campus}>{campus}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Email *
                </label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.contactEmail}
                  onChange={handleIndentInfoChange}
                  placeholder="your.email@varsitymgmt.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  name="contactPhone"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.contactPhone}
                  onChange={handleIndentInfoChange}
                  placeholder="+91 9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urgency Level *
                </label>
                <select
                  name="urgency"
                  required
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.urgency}
                  onChange={handleIndentInfoChange}
                >
                  {urgencyLevels.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Supplier
                </label>
                <input
                  type="text"
                  name="supplierName"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.supplierName}
                  onChange={handleIndentInfoChange}
                  placeholder="e.g., Dell Technologies, HP Inc."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  General Justification (applies to all items if individual justification not provided)
                </label>
                <textarea
                  name="generalJustification"
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={indentInfo.generalJustification}
                  onChange={handleIndentInfoChange}
                  placeholder="Explain why these items are needed and how they will be used"
                />
              </div>
            </div>
          </div>

          {/* Items Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Items to Request</h3>
                <p className="text-sm text-gray-600">Add up to 100+ devices in this indent request</p>
              </div>
              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={addItem}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Item
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const count = prompt('How many items to add?', '10')
                    if (count && parseInt(count) > 0) {
                      addMultipleItems(parseInt(count))
                    }
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Add Multiple
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {items.map((item, index) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-md font-medium text-gray-900">Item #{index + 1}</h4>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => duplicateItem(item.id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Duplicate this item"
                      >
                        <DocumentDuplicateIcon className="h-5 w-5" />
                      </button>
                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Remove this item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Name *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.itemName}
                        onChange={(e) => handleItemChange(item.id, 'itemName', e.target.value)}
                        placeholder="e.g., Dell Latitude 7420 Laptop"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Item Type *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.itemType}
                        onChange={(e) => handleItemChange(item.id, 'itemType', e.target.value)}
                        placeholder="e.g., Laptop Computer"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.category}
                        onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Cost (₹)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.estimatedCost || ''}
                        onChange={(e) => handleItemChange(item.id, 'estimatedCost', e.target.value ? parseFloat(e.target.value) : null)}
                        placeholder="50000.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Specifications
                      </label>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.specifications}
                        onChange={(e) => handleItemChange(item.id, 'specifications', e.target.value)}
                        placeholder="Intel i7, 16GB RAM, 512GB SSD"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Individual Justification (optional - will use general justification if empty)
                      </label>
                      <textarea
                        rows={2}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        value={item.justification}
                        onChange={(e) => handleItemChange(item.id, 'justification', e.target.value)}
                        placeholder="Specific reason for this item..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium text-blue-900">Request Summary</h4>
                  <p className="text-sm text-blue-800">
                    Total Items: {items.length} |
                    Total Quantity: {items.reduce((sum, item) => sum + item.quantity, 0)} |
                    Estimated Cost: ₹{items.reduce((sum, item) => sum + (item.estimatedCost || 0) * item.quantity, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link
              href="/inventory"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Creating...' : `Create ${items.filter(item => item.itemName.trim()).length} Indent Request(s)`}
            </button>
          </div>
        </form>

        {/* CSV Import Modal */}
        {showCsvImport && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Import Items from CSV</h3>
                <button
                  onClick={() => setShowCsvImport(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-3">
                    Upload a CSV file with the following columns:
                  </p>
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono">
                    Item Name, Item Type, Category, Quantity, Estimated Cost, Specifications, Justification
                  </div>
                </div>

                <div>
                  <button
                    onClick={downloadCsvTemplate}
                    className="text-indigo-600 hover:text-indigo-500 text-sm underline"
                  >
                    Download CSV Template
                  </button>
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={handleCsvImport}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowCsvImport(false)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Device Templates Modal */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Device Templates</h3>
                <button
                  onClick={() => setShowTemplates(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deviceTemplates.map((template, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{template.name}</h4>
                        <p className="text-sm text-gray-600">{template.type}</p>
                        <p className="text-sm text-gray-500">Category: {template.category}</p>
                        <p className="text-sm text-green-600 font-medium">₹{template.cost.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => addTemplateItem(template)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowTemplates(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Information Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-medium text-blue-900 mb-4">📋 Bulk Indent Request Process</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-blue-800 mb-2">✨ New Features:</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>• Add up to 100+ devices in single request</p>
                <p>• Import devices from CSV file</p>
                <p>• Use device templates for quick addition</p>
                <p>• Duplicate and bulk operations</p>
                <p>• Individual or general justifications</p>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-blue-800 mb-2">📋 Process Flow:</h5>
              <div className="text-sm text-blue-700 space-y-1">
                <p>1. Fill general indent information</p>
                <p>2. Add multiple devices using various methods</p>
                <p>3. System creates separate requests for each item</p>
                <p>4. Admin reviews and approves/rejects each request</p>
                <p>5. Email notifications for all status updates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
