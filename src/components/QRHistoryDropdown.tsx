import { useRef, useEffect } from 'react'
import { QRHistory } from '../types'

interface QRHistoryDropdownProps {
  history: QRHistory[]
  onSelect: (url: string) => void
  onClear: () => void
  isDarkMode: boolean
  isOpen: boolean
  onClose: () => void
}

export function QRHistoryDropdown({
  history,
  onSelect,
  onClear,
  isDarkMode,
  isOpen,
  onClose
}: QRHistoryDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="fixed inset-x-4 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 rounded-lg shadow-lg z-50"
    >
      <section aria-label="History" className={`w-full rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-gray-600' : 'border-gray-200'} flex justify-between items-center`}>
          <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Recent QR Codes
          </h2>
          <button
            onClick={onClear}
            disabled={history.length === 0}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              isDarkMode 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-red-500 hover:bg-red-600 text-white'
            } ${history.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            aria-label="Clear history"
          >
            Clear All
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          <ul className={`divide-y ${isDarkMode ? 'divide-gray-600' : 'divide-gray-200'}`} role="list">
            {history.map((item) => (
              <li key={item.id} className={isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-50'}>
                <button
                  onClick={() => {
                    onSelect(item.url)
                    onClose()
                  }}
                  className={`w-full text-left p-3 transition-colors ${
                    isDarkMode
                      ? 'bg-gray-800 text-gray-200' 
                      : 'bg-white text-gray-700'
                  }`}
                >
                  <div className="truncate font-medium">{item.url}</div>
                  <time className={`text-sm block mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} dateTime={new Date(item.timestamp).toISOString()}>
                    {new Date(item.timestamp).toLocaleDateString()} {new Date(item.timestamp).toLocaleTimeString()}
                  </time>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}