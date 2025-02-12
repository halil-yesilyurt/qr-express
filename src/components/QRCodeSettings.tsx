import { ErrorCorrectionLevel, ErrorLevel } from '../types'

interface QRCodeSettingsProps {
  frontColor: string
  backColor: string
  errorLevel: ErrorCorrectionLevel
  onFrontColorChange: (color: string) => void
  onBackColorChange: (color: string) => void
  onErrorLevelChange: (level: ErrorCorrectionLevel) => void
  isDarkMode: boolean
  errorLevels: ErrorLevel[]
}

export function QRCodeSettings({
  frontColor,
  backColor,
  errorLevel,
  onFrontColorChange,
  onBackColorChange,
  onErrorLevelChange,
  isDarkMode,
  errorLevels
}: QRCodeSettingsProps) {
  return (
    <fieldset className="space-y-6">
      <legend className="sr-only">QR Code Appearance Settings</legend>
      <div>
        <label htmlFor="frontColor" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Front Color
        </label>
        <input
          type="color"
          id="frontColor"
          name="frontColor"
          className="block w-full h-10 rounded-md cursor-pointer border border-gray-300"
          value={frontColor}
          onChange={(e) => onFrontColorChange(e.target.value)}
          aria-label="Select QR code front color"
        />
      </div>
      <div>
        <label htmlFor="backColor" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Back Color
        </label>
        <input
          type="color"
          id="backColor"
          name="backColor"
          className="block w-full h-10 rounded-md cursor-pointer border border-gray-300"
          value={backColor}
          onChange={(e) => onBackColorChange(e.target.value)}
          aria-label="Select QR code background color"
        />
      </div>
      <div>
        <label htmlFor="errorLevel" className={`block text-base font-medium mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
          Error Correction Level
        </label>
        <select
          id="errorLevel"
          name="errorLevel"
          className={`block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-base transition-colors duration-200 border p-2.5 ${
            isDarkMode 
              ? 'bg-gray-700 border-gray-600 text-white' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          value={errorLevel}
          onChange={(e) => onErrorLevelChange(e.target.value as ErrorCorrectionLevel)}
        >
          {errorLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
      </div>
    </fieldset>
  )
} 