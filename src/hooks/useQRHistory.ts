import { useState, useEffect } from 'react';
import { QRHistory } from '../types';

export function useQRHistory() {
  // State to store QR code history
  const [history, setHistory] = useState<QRHistory[]>([]);

  // Load saved history from localStorage when component mounts
  useEffect(() => {
    const savedHistory = localStorage.getItem('qr-history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Add new QR code to history
  const addToHistory = (url: string) => {
    if (url) {
      // Create new history entry with unique ID
      const newHistory: QRHistory = {
        url,
        timestamp: Date.now(), // Current timestamp
        id: Math.random().toString(36).substring(2, 11), // Generate random ID
      };
      // Update history state
      setHistory((prev) => {
        const updated = [newHistory, ...prev].slice(0, 10); // Keep only last 10 items
        localStorage.setItem('qr-history', JSON.stringify(updated)); // Save to localStorage
        return updated;
      });
    }
  };

  // Clear all history
  const clearHistory = () => {
    setHistory([]); // Clear state
    localStorage.removeItem('qr-history'); // Remove from localStorage
  };

  return { history, addToHistory, clearHistory };
}
