import { QRCodeSVG } from 'qrcode.react'
import { ErrorCorrectionLevel } from '../types'

interface QRCodeDisplayProps {
  url: string
  frontColor: string
  backColor: string
  errorLevel: ErrorCorrectionLevel
  isDarkMode: boolean
}

export function QRCodeDisplay({
  url,
  frontColor,
  backColor,
  errorLevel,
  isDarkMode
}: QRCodeDisplayProps) {
  return (
    <section aria-label="QR Code Preview" className="mb-8">
      <div className={`p-8 rounded-lg transition-colors duration-200 flex items-center justify-center relative ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
        <div className={`transition-opacity duration-300 ${!url ? 'opacity-20' : 'opacity-100'}`} role="img" aria-label="Generated QR code">
          <QRCodeSVG
            id="qr-code"
            data-testid="qr-code"
            value={url || 'https://example.com'}
            size={256}
            fgColor={frontColor}
            bgColor={backColor}
            level={errorLevel}
            includeMargin={true}
          />
        </div>
        {!url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className={`text-lg font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Enter a URL to generate QR code
            </p>
          </div>
        )}
      </div>
    </section>
  )
} 