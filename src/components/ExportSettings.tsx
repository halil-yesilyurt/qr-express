import { useState } from 'react'
import { QRCodeSize } from '../types'
import { ShareOptions } from './ShareOptions'
import { DEFAULT_URL } from '../constants'

interface ExportSettingsProps {
  downloadSize: number
  onDownloadSizeChange: (size: number) => void
  onLogoUpload: (event: React.ChangeEvent<HTMLInputElement>) => void
  onDownload: (format: 'png' | 'svg' | 'pdf') => void
  isDarkMode: boolean
  sizes: QRCodeSize[]
  url: string
  addToHistory: (url: string) => void
  onShare: (url: string) => void
}

export function ExportSettings({
  downloadSize,
  onDownloadSizeChange,
  onLogoUpload,
  onDownload,
  isDarkMode,
  sizes,
  url,
  addToHistory,
  onShare
}: ExportSettingsProps) {
  const [selectedFile, setSelectedFile] = useState<string>('')
  const hasUrl = url.trim().length > 0
  const displayUrl = url.trim() || DEFAULT_URL

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setSelectedFile(file ? file.name : '')
    onLogoUpload(event)
  }

  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">Export Settings</legend>
      <div>
        <label htmlFor="size" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Download Size
        </label>
        <select
          id="size"
          name="size"
          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base transition-colors duration-200 border p-2.5 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={downloadSize}
          onChange={(e) => onDownloadSizeChange(Number(e.target.value))}
        >
          {sizes.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Custom Logo
        </h3>
        <div className={`flex items-center rounded-md border ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
          <label htmlFor="logo" className={`flex-none px-4 py-2.5 rounded-l-md cursor-pointer transition-colors ${
            isDarkMode 
              ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}>
            <span className="text-base font-medium">Choose File</span>
          </label>
          <input
            type="file"
            id="logo"
            name="logo"
            accept="image/*"
            onChange={handleFileChange}
            className="sr-only"
            aria-label="Upload custom logo"
          />
          <span className={`flex-1 truncate px-4 py-2.5 text-base cursor-default ${
            isDarkMode 
              ? 'text-gray-200' 
              : 'text-gray-700'
          }`}>
            {selectedFile || 'No file chosen'}
          </span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h3 className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Download Options
          </h3>
          <div className="flex flex-col md:flex-row gap-2" role="group" aria-label="Download options">
            {['PNG', 'SVG', 'PDF'].map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => onDownload(format.toLowerCase() as any)}
                className={`w-full md:flex-1 px-4 py-2.5 rounded-md transition-colors text-base font-medium ${
                  hasUrl
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                disabled={!hasUrl}
              >
                Download {format}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className={`text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
            Share Options
          </h3>
          <ShareOptions url={displayUrl} isDarkMode={isDarkMode} disabled={!hasUrl} addToHistory={addToHistory} onShare={onShare} />
        </div>
      </div>
    </fieldset>
  )
} 