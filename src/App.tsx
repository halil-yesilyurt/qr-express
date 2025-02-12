import { useState, useRef } from 'react'
import { QRCodeDisplay } from './components/QRCodeDisplay'
import { QRCodeSettings } from './components/QRCodeSettings'
import { ExportSettings } from './components/ExportSettings'
import { QRHistoryDropdown } from './components/QRHistoryDropdown'
import { useQRHistory } from './hooks/useQRHistory'
import { useDarkMode } from './hooks/useDarkMode'
import { SIZES, ERROR_LEVELS, DEFAULT_URL } from './constants'
import { ErrorCorrectionLevel } from './types'
// @ts-ignore
import { ShareOptions } from './components/ShareOptions'

function App() {
  const [url, setUrl] = useState('')
  const [frontColor, setFrontColor] = useState('#000000')
  const [backColor, setBackColor] = useState('#ffffff')
  const [downloadSize, setDownloadSize] = useState(256)
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('H')
  const [logo, setLogo] = useState<string>('')
  const [showHistory, setShowHistory] = useState(false)
  const historyButtonRef = useRef<HTMLButtonElement>(null)
  const { isDarkMode, toggleDarkMode } = useDarkMode()
  const { history, addToHistory, clearHistory } = useQRHistory()

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl)
  }

  const downloadQRCode = (format: 'png' | 'svg' | 'pdf') => {
    const svg = document.getElementById('qr-code')
    if (!svg) return

    if (url) addToHistory(url)

    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' })
    const svgUrl = URL.createObjectURL(svgBlob)

    const getCleanFileName = () => {
      let fileName = 'qr-code'
      try {
        const urlObj = new URL(url || DEFAULT_URL)
        fileName = urlObj.hostname.replace(/^www\./, '')
      } catch (e) {
      }
      return `${fileName}.${format}`
    }

    if (format === 'svg') {
      const link = document.createElement('a')
      link.href = svgUrl
      link.download = getCleanFileName()
      link.click()
      URL.revokeObjectURL(svgUrl)
      return
    }

    const canvas = document.createElement('canvas')
    canvas.width = downloadSize
    canvas.height = downloadSize
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.onload = () => {
      ctx.fillStyle = backColor
      ctx.fillRect(0, 0, downloadSize, downloadSize)
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize)

      const processDownload = () => {
        if (format === 'pdf') {
          import('jspdf').then(({ default: JsPDF }) => {
            const pdf = new JsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [downloadSize, downloadSize],
            })
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, downloadSize, downloadSize)
            pdf.save(getCleanFileName())
          })
        } else {
          const pngUrl = canvas.toDataURL('image/png')
          const downloadLink = document.createElement('a')
          downloadLink.download = getCleanFileName()
          downloadLink.href = pngUrl
          downloadLink.click()
        }
      }

      if (logo) {
        const logoImg = new Image()
        logoImg.onload = () => {
          const logoSize = downloadSize * 0.2
          const logoX = (downloadSize - logoSize) / 2
          const logoY = (downloadSize - logoSize) / 2
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
          processDownload()
        }
        logoImg.onerror = () => {
          processDownload()
        }
        logoImg.src = logo
      } else {
        processDownload()
      }
    }
    img.onerror = () => {
      console.error('Failed to load QR code image')
      URL.revokeObjectURL(svgUrl)
    }
    img.src = svgUrl
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogo(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const shareQRCode = async () => {
    try {
      const currentUrl = url.trim() || DEFAULT_URL
      
      if (url) addToHistory(url)

      if (navigator.share) {
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${currentUrl}`,
          url: currentUrl,
        })
      } else {
        await navigator.clipboard.writeText(currentUrl)
        alert('URL copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  return (
    <main
      className={`min-h-screen w-full flex items-center justify-center p-4 
      transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      role='main'
    >
      <div
        className={`w-full max-w-4xl mx-auto rounded-lg shadow-md p-4 sm:p-8 
        transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        <header className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-12'>
          <h1
            className={`text-2xl sm:text-3xl font-bold text-center 
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            QR Code Generator
          </h1>

          <nav className='flex gap-4 relative' role='navigation' aria-label='Application controls'>
            <div className='relative'>
              <button
                ref={historyButtonRef}
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors duration-200 
                  ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
                aria-label='Toggle history'
                aria-expanded={showHistory}
              >
                <span aria-hidden='true'>📋</span>
                <span className='sr-only'>History</span>
              </button>

              <QRHistoryDropdown
                history={history}
                onSelect={handleUrlChange}
                onClear={clearHistory}
                isDarkMode={isDarkMode}
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-lg transition-colors duration-200 
                ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-yellow-300' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'}`}
              aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
              aria-pressed={isDarkMode}
            >
              <span aria-hidden='true'>{isDarkMode ? '🌞' : '🌙'}</span>
              <span className='sr-only'>Toggle dark mode</span>
            </button>
          </nav>
        </header>
        <div className='flex flex-col items-center max-w-2xl mx-auto'>
          <form className='w-full space-y-8' onSubmit={(e) => e.preventDefault()}>
            <div className='w-full'>
              <label
                htmlFor='website'
                className={`block text-base font-medium mb-2 
          ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Website URL
              </label>
              <input
                type='url'
                id='website'
                name='website'
                className={`block w-full rounded-md shadow-sm 
          focus:ring-indigo-500 focus:border-indigo-500 
          text-base transition-colors duration-200 p-2.5 
          ${
            isDarkMode
              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
          }`}
                placeholder={DEFAULT_URL}
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                aria-label='Enter website URL'
                required
              />
            </div>

            <QRCodeDisplay
              url={url}
              frontColor={frontColor}
              backColor={backColor}
              errorLevel={errorLevel}
              isDarkMode={isDarkMode}
            />

            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'>
              <QRCodeSettings
                frontColor={frontColor}
                backColor={backColor}
                errorLevel={errorLevel}
                onFrontColorChange={setFrontColor}
                onBackColorChange={setBackColor}
                onErrorLevelChange={setErrorLevel}
                isDarkMode={isDarkMode}
                errorLevels={ERROR_LEVELS}
              />

              <ExportSettings
                downloadSize={downloadSize}
                onDownloadSizeChange={setDownloadSize}
                onLogoUpload={handleLogoUpload}
                onDownload={downloadQRCode}
                isDarkMode={isDarkMode}
                sizes={SIZES}
                url={url}
                addToHistory={addToHistory}
                onShare={shareQRCode}
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}

export default App
