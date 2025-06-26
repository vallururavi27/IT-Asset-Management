'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Layout from '@/components/Layout'
import { ArrowLeftIcon, CloudArrowUpIcon, DocumentArrowDownIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function ImportBranchesPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [results, setResults] = useState<any>(null)

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
      setFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const downloadTemplate = async () => {
    try {
      const response = await fetch('/api/branches/template')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'branch_import_template.csv'
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to download template')
      }
    } catch (error) {
      console.error('Error downloading template:', error)
      alert('Error downloading template')
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please select a CSV file')
      return
    }

    setLoading(true)
    setResults(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/branches/import', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()
      setResults(result)

      if (response.ok) {
        if (result.results?.successful > 0) {
          alert(`Import completed! ${result.results.successful} branches imported successfully.`)
        }
      } else {
        alert(`Import failed: ${result.error}`)
      }
    } catch (error) {
      console.error('Error importing file:', error)
      alert('Error importing file')
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
          <h1 className="text-3xl font-bold text-gray-900">Import Branches</h1>
          <p className="mt-2 text-gray-600">Upload a CSV file to import multiple branches at once</p>
        </div>

        {/* Template Download */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <DocumentArrowDownIcon className="h-6 w-6 text-blue-600 mt-1 mr-3" />
            <div className="flex-1">
              <h3 className="text-lg font-medium text-blue-900 mb-2">Download CSV Template</h3>
              <p className="text-blue-800 mb-4">
                Download the CSV template with the correct format and sample data for branch import.
              </p>
              <button
                onClick={downloadTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Download Template
              </button>
            </div>
          </div>
        </div>

        {/* CSV Format Information */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">CSV Format Requirements</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Required Columns:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                <div>• <strong>branchName</strong> - Name of the branch</div>
                <div>• <strong>branchCode</strong> - Unique branch code</div>
                <div>• <strong>city</strong> - City where branch is located</div>
                <div>• <strong>location</strong> - Full address</div>
                <div>• <strong>state</strong> - State/Province</div>
                <div>• <strong>pincode</strong> - Postal code</div>
                <div>• <strong>branchType</strong> - HEAD_OFFICE, BRANCH, REGIONAL_OFFICE, SUB_BRANCH</div>
                <div>• <strong>hardwareEngineerName</strong> - Hardware engineer name</div>
                <div>• <strong>hardwareEngineerEmail</strong> - Hardware engineer email</div>
                <div>• <strong>hardwareEngineerPhone</strong> - Hardware engineer phone</div>
                <div>• <strong>branchManagerName</strong> - Branch manager name</div>
                <div>• <strong>branchManagerEmail</strong> - Branch manager email</div>
                <div>• <strong>branchManagerPhone</strong> - Branch manager phone</div>
                <div>• <strong>establishedDate</strong> - Date format: YYYY-MM-DD</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-2">Important Notes:</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Branch names and codes must be unique</li>
                <li>• Date format must be YYYY-MM-DD (e.g., 2024-01-15)</li>
                <li>• Branch type must be one of: HEAD_OFFICE, BRANCH, REGIONAL_OFFICE, SUB_BRANCH</li>
                <li>• Email addresses should be valid format</li>
                <li>• Phone numbers should include country code</li>
              </ul>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
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
            <CloudArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-gray-900">
                {file ? file.name : 'Drop your CSV file here'}
              </p>
              <p className="text-gray-500">
                or{' '}
                <label className="text-indigo-600 hover:text-indigo-500 cursor-pointer">
                  browse to upload
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </p>
              <p className="text-sm text-gray-400">CSV files only, max 10MB</p>
            </div>
          </div>

          {file && (
            <div className="mt-4 flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-red-600 hover:text-red-500 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}

          <div className="mt-6 flex justify-end space-x-4">
            <Link
              href="/branches"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </Link>
            <button
              onClick={handleImport}
              disabled={!file || loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loading ? 'Importing...' : 'Import Branches'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Import Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-600">{results.results?.successful || 0}</div>
                <div className="text-sm text-green-800">Successful</div>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-red-600">{results.results?.failed || 0}</div>
                <div className="text-sm text-red-800">Failed</div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-600">{results.results?.total || 0}</div>
                <div className="text-sm text-blue-800">Total</div>
              </div>
            </div>

            {results.results?.errors && results.results.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-medium text-red-900 mb-2">Errors:</h4>
                <ul className="text-sm text-red-800 space-y-1">
                  {results.results.errors.map((error: string, index: number) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {results.results?.messages && results.results.messages.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                <h4 className="font-medium text-blue-900 mb-2">Messages:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  {results.results.messages.map((message: string, index: number) => (
                    <li key={index}>• {message}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6">
              <Link
                href="/branches"
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                View Branches
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
