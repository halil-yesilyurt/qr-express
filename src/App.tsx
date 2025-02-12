// Core React imports
import { useState, useRef } from 'react';
// useState: Hook for managing component state
// useRef: Hook for creating a mutable reference

// Component imports
import { QRCodeDisplay } from './components/QRCodeDisplay'; // Displays the QR code
import { QRCodeSettings } from './components/QRCodeSettings'; // QR code customization options
import { ExportSettings } from './components/ExportSettings'; // Download and share options
import { QRHistoryDropdown } from './components/QRHistoryDropdown'; // History dropdown menu

// Custom hooks
import { useQRHistory } from './hooks/useQRHistory'; // Manages QR code history
import { useDarkMode } from './hooks/useDarkMode'; // Manages dark/light theme

// Constants and types
import { SIZES, ERROR_LEVELS, DEFAULT_URL } from './constants'; // Global constants
import { ErrorCorrectionLevel } from './types'; // TypeScript type definitions
// @ts-ignore
import { ShareOptions } from './components/ShareOptions';

function App() {
  const [url, setUrl] = useState(''); // Stores the current URL input

  // QR code appearance states
  const [frontColor, setFrontColor] = useState('#000000'); // QR code color (default: black)
  const [backColor, setBackColor] = useState('#ffffff'); // Background color (default: white)
  const [downloadSize, setDownloadSize] = useState(256); // Download size in pixels
  const [errorLevel, setErrorLevel] = useState<ErrorCorrectionLevel>('H'); // Error correction level

  // UI states
  const [logo, setLogo] = useState<string>(''); // Base64 string of uploaded logo
  const [showHistory, setShowHistory] = useState(false); // Controls history dropdown visibility

  // Reference for history button
  const historyButtonRef = useRef<HTMLButtonElement>(null); // Used for click outside detection

  // Dark mode management
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  // isDarkMode: boolean indicating current theme
  // toggleDarkMode: function to switch theme

  // History management
  const { history, addToHistory, clearHistory } = useQRHistory();
  // history: array of previously generated QR codes
  // addToHistory: function to add new QR code
  // clearHistory: function to clear all history

  // Updates the URL state when user types
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
  };

  // Handles QR code download in different formats
  const downloadQRCode = (format: 'png' | 'svg' | 'pdf') => {
    // Get the SVG element containing the QR code
    const svg = document.getElementById('qr-code');
    if (!svg) return;

    // Add to history when downloading
    if (url) addToHistory(url);

    // Convert SVG to string
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);

    // Generate clean filename from URL
    const getCleanFileName = () => {
      let fileName = 'qr-code';
      try {
        const urlObj = new URL(url || DEFAULT_URL);
        fileName = urlObj.hostname.replace(/^www\./, ''); // Remove 'www.' if present
      } catch (e) {
        // Use default name if URL parsing fails
      }
      return `${fileName}.${format}`;
    };

    // Handle SVG format download
    if (format === 'svg') {
      const link = document.createElement('a');
      link.href = svgUrl;
      link.download = getCleanFileName();
      link.click();
      URL.revokeObjectURL(svgUrl);
      return;
    }

    // Handle PNG and PDF formats
    const canvas = document.createElement('canvas');
    canvas.width = downloadSize;
    canvas.height = downloadSize;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Fill background
      ctx.fillStyle = backColor;
      ctx.fillRect(0, 0, downloadSize, downloadSize);
      // Draw QR code
      ctx.drawImage(img, 0, 0, downloadSize, downloadSize);

      const processDownload = () => {
        if (format === 'pdf') {
          import('jspdf').then(({ default: JsPDF }) => {
            const pdf = new JsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [downloadSize, downloadSize],
            });
            pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, downloadSize, downloadSize);
            pdf.save(getCleanFileName());
          });
        } else {
          // Download as PNG
          const pngUrl = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = getCleanFileName();
          downloadLink.href = pngUrl;
          downloadLink.click();
        }
      };

      // Handle logo if present
      if (logo) {
        const logoImg = new Image();
        logoImg.onload = () => {
          // Calculate logo size (20% of QR code)
          const logoSize = downloadSize * 0.2;
          const logoX = (downloadSize - logoSize) / 2;
          const logoY = (downloadSize - logoSize) / 2;
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          processDownload();
        };
        logoImg.onerror = () => {
          // If logo fails to load, proceed without it
          processDownload();
        };
        logoImg.src = logo;
      } else {
        processDownload();
      }
    };
    img.onerror = () => {
      console.error('Failed to load QR code image');
      URL.revokeObjectURL(svgUrl);
    };
    img.src = svgUrl;
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string); // Store logo as base64 string
      };
      reader.readAsDataURL(file);
    }
  };

  const shareQRCode = async () => {
    try {
      const currentUrl = url.trim() || DEFAULT_URL;
      
      if (url) addToHistory(url);

      if (navigator.share) {
        // Use native share if available (mobile devices)
        await navigator.share({
          title: 'QR Code',
          text: `QR Code for: ${currentUrl}`,
          url: currentUrl,
        });
      } else {
        // Fallback to clipboard copy
        await navigator.clipboard.writeText(currentUrl);
        alert('URL copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    // Main container with dark mode support
    <main
      className={`min-h-screen w-full flex items-center justify-center p-4 
      transition-colors duration-200 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}
      role='main'
    >
      {/* Content container with shadow and rounded corners */}
      <div
        className={`w-full max-w-4xl mx-auto rounded-lg shadow-md p-4 sm:p-8 
        transition-colors duration-200 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
      >
        {/* Header section */}
        <header className='flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 sm:mb-12'>
          {/* Title */}
          <h1
            className={`text-2xl sm:text-3xl font-bold text-center 
            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            QR Code Generator
          </h1>

          {/* Navigation controls */}
          <nav className='flex gap-4 relative' role='navigation' aria-label='Application controls'>
            {/* History button with dropdown */}
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

              {/* History dropdown component */}
              <QRHistoryDropdown
                history={history}
                onSelect={handleUrlChange}
                onClear={clearHistory}
                isDarkMode={isDarkMode}
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
              />
            </div>

            {/* Theme toggle button */}
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
          {/* Form with vertical spacing between children */}
          <form className='w-full space-y-8' onSubmit={(e) => e.preventDefault()}>
            {/* URL Input Section */}
            <div className='w-full'>
              {/* Label for URL input */}
              <label
                htmlFor='website'
                className={`block text-base font-medium mb-2 
          ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}
              >
                Website URL
              </label>
              {/* URL input field */}
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

            {/* QR Code Display Component */}
            <QRCodeDisplay
              url={url} // URL to encode
              frontColor={frontColor} // QR code color
              backColor={backColor} // Background color
              errorLevel={errorLevel} // Error correction level
              isDarkMode={isDarkMode} // Theme state
            />

            {/* Settings Grid */}
            <div className='w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8'>
              {/* QR Code Customization Settings */}
              <QRCodeSettings
                frontColor={frontColor} // Current QR code color
                backColor={backColor} // Current background color
                errorLevel={errorLevel} // Current error level
                onFrontColorChange={setFrontColor} // Update QR color
                onBackColorChange={setBackColor} // Update background
                onErrorLevelChange={setErrorLevel} // Update error level
                isDarkMode={isDarkMode} // Theme state
                errorLevels={ERROR_LEVELS} // Available error levels
              />

              {/* Export and Share Settings */}
              <ExportSettings
                downloadSize={downloadSize} // Current download size
                onDownloadSizeChange={setDownloadSize} // Update size
                onLogoUpload={handleLogoUpload} // Handle logo upload
                onDownload={downloadQRCode} // Handle downloads
                isDarkMode={isDarkMode} // Theme state
                sizes={SIZES} // Available sizes
                url={url} // Current URL
                addToHistory={addToHistory} // Add to history
                onShare={shareQRCode} // Handle sharing
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

export default App;
