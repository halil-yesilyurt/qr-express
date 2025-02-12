import { renderHook, act } from '@testing-library/react';
import { useQRHistory } from './useQRHistory';
import { vi } from 'vitest';

describe('useQRHistory', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset all mocks
    vi.clearAllMocks();
  });

  it('initializes with empty history if no localStorage data', () => {
    const { result } = renderHook(() => useQRHistory());
    expect(result.current.history).toEqual([]);
  });

  it('initializes with localStorage data if present', () => {
    const mockHistory = [
      { url: 'https://example.com', timestamp: Date.now(), id: '123' },
    ];
    localStorage.setItem('qr-history', JSON.stringify(mockHistory));

    const { result } = renderHook(() => useQRHistory());
    expect(result.current.history).toEqual(mockHistory);
  });

  it('adds new URL to history', () => {
    const { result } = renderHook(() => useQRHistory());
    const testUrl = 'https://example.com';

    act(() => {
      result.current.addToHistory(testUrl);
    });

    expect(result.current.history[0].url).toBe(testUrl);
    expect(result.current.history).toHaveLength(1);
  });

  it('limits history to 10 items', () => {
    const { result } = renderHook(() => useQRHistory());

    // Add 11 items
    act(() => {
      for (let i = 0; i < 11; i++) {
        result.current.addToHistory(`https://example${i}.com`);
      }
    });

    expect(result.current.history).toHaveLength(10);
    // Check if the newest item is first
    expect(result.current.history[0].url).toBe('https://example10.com');
  });

  it('persists history in localStorage', () => {
    const { result } = renderHook(() => useQRHistory());
    const testUrl = 'https://example.com';

    act(() => {
      result.current.addToHistory(testUrl);
    });

    const storedHistory = JSON.parse(localStorage.getItem('qr-history') || '[]');
    expect(storedHistory[0].url).toBe(testUrl);
  });

  it('clears history', () => {
    const { result } = renderHook(() => useQRHistory());

    act(() => {
      result.current.addToHistory('https://example.com');
      result.current.clearHistory();
    });

    expect(result.current.history).toEqual([]);
    expect(localStorage.getItem('qr-history')).toBeNull();
  });

  it('adds items in correct order', () => {
    const { result } = renderHook(() => useQRHistory());

    act(() => {
      result.current.addToHistory('https://first.com');
      result.current.addToHistory('https://second.com');
    });

    expect(result.current.history[0].url).toBe('https://second.com');
    expect(result.current.history[1].url).toBe('https://first.com');
  });
}); 