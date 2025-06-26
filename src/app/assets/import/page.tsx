'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { 
  ArrowLeftIcon, 
  DocumentArrowDownIcon, 
  CloudArrowUpIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface ImportResult {
  total: number
  successful: number
  failed: number
  errors: string[]
}

export default function ImportAssetsPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFileSelect = (selectedFile: File) => {
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file')
      return
    }
    setFile(selectedFile)
    setResult(null)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const downloadTemplate = () => {
    window.open('/api/assets/template', '_blank')
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file')
      return
    }

    setImporting(true)
    setResult(null)

    try {
      const formData = new FormData()
      formData.append('csvFile', file)

      const response = await fetch('/api/assets/import', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data.results)
      } else {
        alert(`Import failed: ${data.error}`)
      }
    } catch (error) {
      console.error('Import error:', error)
      alert('Import failed. Please try again.')
    } finally {
      setImporting(false)
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Import Assets from CSV</h1>
          <p className="mt-2 text-gray-600">
            Bulk import your asset data with complete specifications, warranty details, and tracking information
          </p>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-blue-900 mb-4">Import Instructions - Simplified Format</h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Download the CSV template with <strong>16 essential columns only</strong></p>
            <p>• Required fields: <strong>name, category, type</strong></p>
            <p>• Date format: <strong>YYYY-MM-DD</strong> (e.g., 2023-12-25)</p>
            <p>• Categories: <strong>HARDWARE, SOFTWARE, NETWORKING, DATACENTER, LEGACY</strong></p>
            <p>• Status options: <strong>AVAILABLE, ASSIGNED, MAINTENANCE, RETIRED, DISPOSED</strong></p>
            <p>• Serial numbers must be unique if provided</p>
            <p>• Include warranty expiry dates for proper asset monitoring</p>
            <p>• Purchase order numbers help track procurement</p>
            <p>• Quantities: availableQty should not exceed total quantity</p>
          </div>
        </div>

        {/* Download Template */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">CSV Template</h3>
              <p className="text-sm text-gray-600 mt-1">
                Download the template with sample data and all available fields
              </p>
            </div>
            <button
              onClick={downloadTemplate}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
              Download Template
            </button>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Upload CSV File</h3>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              dragActive 
                ? 'border-indigo-500 bg-indigo-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="mt-2 block text-sm font-medium text-gray-900">
                  {file ? file.name : 'Drop your CSV file here, or click to browse'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".csv"
                  className="sr-only"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">CSV files only, up to 10MB</p>
            </div>
          </div>

          {file && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024).toFixed(1)} KB • {file.type}
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Link
              href="/assets"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 flex items-center"
            >
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <CloudArrowUpIcon className="h-5 w-5 mr-2" />
                  Import Assets
                </>
              )}
            </button>
          </div>
        </div>

        {/* Import Results */}
        {result && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <div className="text-2xl font-bold text-blue-600">{result.total}</div>
                  <div className="ml-2 text-sm text-blue-800">Total Records</div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-6 w-6 text-green-600 mr-2" />
                  <div className="text-2xl font-bold text-green-600">{result.successful}</div>
                  <div className="ml-2 text-sm text-green-800">Successful</div>
                </div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <XCircleIcon className="h-6 w-6 text-red-600 mr-2" />
                  <div className="text-2xl font-bold text-red-600">{result.failed}</div>
                  <div className="ml-2 text-sm text-red-800">Failed</div>
                </div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                  <h4 className="text-sm font-medium text-red-900">Import Errors</h4>
                </div>
                <div className="max-h-40 overflow-y-auto">
                  {result.errors.map((error, index) => (
                    <p key={index} className="text-xs text-red-800 mb-1">
                      {error}
                    </p>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setResult(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
              >
                Import More
              </button>
              <Link
                href="/assets"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View Assets
              </Link>
            </div>
          </div>
        )}

        {/* Field Reference */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Field Reference - Essential Fields Only</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
              <ul className="space-y-1 text-gray-600">
                <li><strong>name*</strong> - Asset name (Required)</li>
                <li><strong>description</strong> - Detailed asset description</li>
                <li><strong>category*</strong> - HARDWARE/SOFTWARE/NETWORKING/DATACENTER/LEGACY (Required)</li>
                <li><strong>subCategory</strong> - Computing Devices, Storage Devices, Memory (RAM), etc.</li>
                <li><strong>type*</strong> - Laptop Computer, Desktop Computer, SSD (NVMe), etc. (Required)</li>
                <li><strong>serialNumber</strong> - Unique serial number (if available)</li>
                <li><strong>model</strong> - Asset model number</li>
                <li><strong>manufacturer</strong> - Manufacturer/Brand name</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Purchase & Inventory</h4>
              <ul className="space-y-1 text-gray-600">
                <li><strong>purchaseDate</strong> - Purchase date in YYYY-MM-DD format</li>
                <li><strong>purchaseCost</strong> - Cost in rupees (numeric value)</li>
                <li><strong>warrantyExpiry</strong> - Warranty expiry in YYYY-MM-DD format</li>
                <li><strong>status</strong> - AVAILABLE/ASSIGNED/MAINTENANCE/RETIRED</li>
                <li><strong>location</strong> - Physical storage location</li>
                <li><strong>quantity</strong> - Total quantity (numeric)</li>
                <li><strong>availableQty</strong> - Available quantity (numeric)</li>
                <li><strong>purchaseOrderNo</strong> - Purchase order number for tracking</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">📋 Important Notes:</h4>
            <div className="text-sm text-blue-800 space-y-1">
              <p>• <strong>Required fields:</strong> name, category, type</p>
              <p>• <strong>Date format:</strong> YYYY-MM-DD (e.g., 2023-12-25)</p>
              <p>• <strong>Serial numbers</strong> must be unique if provided</p>
              <p>• <strong>Categories:</strong> Use exact values - HARDWARE, SOFTWARE, NETWORKING, DATACENTER, LEGACY</p>
              <p>• <strong>Status options:</strong> AVAILABLE, ASSIGNED, MAINTENANCE, RETIRED, DISPOSED</p>
              <p>• <strong>Quantities:</strong> availableQty should not exceed quantity</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
