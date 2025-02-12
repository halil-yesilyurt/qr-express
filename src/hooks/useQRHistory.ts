import { useState, useEffect } from 'react'
import { QRHistory } from '../types'

export function useQRHistory() {
  const [history, setHistory] = useState<QRHistory[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history')
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  const addToHistory = (url: string) => {
    if (!url.trim()) return

    const newHistory: QRHistory = {
      url: url.trim(),
      timestamp: Date.now(),
      id: Math.random().toString(36).substring(2, 11)
    }

    setHistory(prev => {
      const updated = [newHistory, ...prev].slice(0, 10)
      localStorage.setItem('qr-history', JSON.stringify(updated))
      return updated
    })
  }

  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem('qr-history')
  }

  return { history, addToHistory, clearHistory }
}
