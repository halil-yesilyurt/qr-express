import { useState, useRef, useEffect } from 'react'
import { ShareOption } from '../types'
import { SHARE_OPTIONS, SOCIAL_PLATFORMS, DEFAULT_URL } from '../constants'

interface ShareOptionsProps {
  url: string
  isDarkMode: boolean
  disabled?: boolean
  addToHistory: (url: string) => void
  onShare: (url: string) => void
}

export function ShareOptions({ url, isDarkMode, disabled = false, addToHistory, onShare }: ShareOptionsProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [showSocialDropdown, setShowSocialDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowSocialDropdown(false)
      }
    }

    if (showSocialDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSocialDropdown])

  const handleShare = async (option: ShareOption) => {
    if (disabled) return
    
    try {
      const shareUrl = url.trim() || DEFAULT_URL;
      
      // Save URL to history
      if (url.trim()) {
        addToHistory(url);
      }
      
      switch (option.id) {
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: 'Share QR Code',
              text: `Check out this QR code I generated!`,
              url: shareUrl
            })
          } else {
            // Fallback to copy if native sharing is not available
            await handleShare(SHARE_OPTIONS.find(opt => opt.id === 'copy')!)
          }
          break

        case 'copy':
          await navigator.clipboard.writeText(shareUrl)
          setShowTooltip(true)
          setTimeout(() => setShowTooltip(false), 2000)
          break

        default:
          if (option.url) {
            window.open(option.url(shareUrl), '_blank', 'noopener,noreferrer')
          }
      }
      setShowSocialDropdown(false)
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Share options">
        <button
          onClick={() => !disabled && setShowSocialDropdown(!showSocialDropdown)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 text-base ${
            disabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105'
          }`}
          aria-label="Share options"
          aria-expanded={showSocialDropdown}
          disabled={disabled}
        >
          <span className="text-xl" aria-hidden="true">📤</span>
          <span className="font-medium">Share</span>
        </button>

        {SHARE_OPTIONS.map((option) => (
          <button
            key={option.id}
            onClick={() => handleShare(option)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-md transition-all duration-200 text-base ${
              disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-white hover:scale-105'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-900 hover:scale-105'
            }`}
            aria-label={option.label}
            disabled={disabled}
          >
            <span className="text-xl" aria-hidden="true">{option.icon}</span>
            <span className="font-medium">{option.label}</span>
          </button>
        ))}
      </div>

      {/* Social Platforms Dropdown */}
      {showSocialDropdown && !disabled && (
        <div 
          className={`absolute right-0 mt-2 rounded-lg shadow-lg z-20 ${
            isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 p-2">
            {SOCIAL_PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                onClick={() => handleShare(platform)}
                className={`p-2.5 rounded-full aspect-square transition-all duration-200 ${
                  isDarkMode
                    ? 'hover:bg-gray-700 text-white bg-gray-900'
                    : 'hover:bg-gray-100 text-gray-800 hover:text-gray-900 bg-transparent'
                } ${platform.id === 'twitter' && isDarkMode ? '[&>svg]:fill-white' : ''}`}
                aria-label={`Share on ${platform.label}`}
              >
                <div className="w-5 h-5" dangerouslySetInnerHTML={{ __html: platform.icon }} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && (
        <div
          className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 rounded-md text-sm ${
            isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-800 text-white'
          }`}
          role="status"
        >
          URL copied!
        </div>
      )}
    </div>
  )
} 