export interface QRHistory {
  url: string
  timestamp: number
  id: string
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H'

export interface QRCodeSize {
  label: string
  value: number
}

export interface ErrorLevel {
  label: string
  value: ErrorCorrectionLevel
}

export type ShareMethod = 'native' | 'copy' | 'twitter' | 'whatsapp' | 'telegram' | 'linkedin' | 'facebook' | 'reddit' | 'pinterest'

export interface ShareOption {
  id: ShareMethod
  label: string
  icon: string
  url?: (qrUrl: string) => string
} 