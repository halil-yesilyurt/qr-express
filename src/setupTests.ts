// jest-dom adds custom jest matchers for asserting on DOM nodes.
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock URL.createObjectURL
URL.createObjectURL = vi.fn().mockReturnValue('mock-url');

// Mock XMLSerializer
window.XMLSerializer = vi.fn().mockImplementation(() => ({
  serializeToString: vi.fn().mockReturnValue('<svg></svg>'),
}));

// Mock canvas
const mockCanvas = document.createElement('canvas');
const mockContext = mockCanvas.getContext('2d')!;

// Override specific methods we need to mock
Object.defineProperties(mockContext, {
  getImageData: {
    value: vi.fn(() => ({
      data: new Uint8ClampedArray(4),
      width: 1,
      height: 1,
    })),
  },
  putImageData: { value: vi.fn() },
  drawImage: { value: vi.fn() },
  fillRect: { value: vi.fn() },
  clearRect: { value: vi.fn() },
});

HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === '2d') {
    return mockContext;
  }
  return null;
} as typeof HTMLCanvasElement.prototype.getContext; 