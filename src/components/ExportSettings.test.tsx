import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ExportSettings } from './ExportSettings';
import { vi } from 'vitest';

// Mock functions
const mockOnDownloadSizeChange = vi.fn();
const mockOnLogoUpload = vi.fn();
const mockOnDownload = vi.fn();
const mockAddToHistory = vi.fn();
const mockOnShare = vi.fn();

describe('ExportSettings', () => {
  // Default props for testing
  const defaultProps = {
    downloadSize: 256,
    onDownloadSizeChange: mockOnDownloadSizeChange,
    onLogoUpload: mockOnLogoUpload,
    onDownload: mockOnDownload,
    isDarkMode: false,
    sizes: [
      { value: 256, label: '256x256' },
      { value: 512, label: '512x512' },
    ],
    url: '',
    addToHistory: mockAddToHistory,
    onShare: mockOnShare,
  };

  // Reset all mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders download size selector', () => {
    render(<ExportSettings {...defaultProps} />);
    
    const sizeSelector = screen.getByLabelText(/download size/i);
    expect(sizeSelector).toBeInTheDocument();
    expect(sizeSelector).toHaveValue('256');
  });

  it('calls onDownloadSizeChange when size is changed', async () => {
    render(<ExportSettings {...defaultProps} />);
    
    const sizeSelector = screen.getByLabelText(/download size/i);
    await userEvent.selectOptions(sizeSelector, '512');
    
    expect(mockOnDownloadSizeChange).toHaveBeenCalledWith(512);
  });

  it('handles logo upload', () => {
    render(<ExportSettings {...defaultProps} />);
    
    const fileInput = screen.getByLabelText(/upload custom logo/i);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(mockOnLogoUpload).toHaveBeenCalled();
  });

  it('enables download buttons when URL is provided', () => {
    const propsWithUrl = { ...defaultProps, url: 'https://example.com' };
    render(<ExportSettings {...propsWithUrl} />);
    
    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    downloadButtons.forEach(button => {
      expect(button).not.toHaveClass('cursor-not-allowed');
      expect(button).toHaveClass('bg-indigo-600');
    });
  });

  it('disables download buttons when no URL is provided', () => {
    render(<ExportSettings {...defaultProps} />);
    
    const downloadButtons = screen.getAllByRole('button', { name: /download/i });
    downloadButtons.forEach(button => {
      expect(button).toHaveClass('cursor-not-allowed');
      expect(button).toHaveClass('bg-gray-300');
    });
  });

  it('calls onDownload with correct format when download button is clicked', async () => {
    const propsWithUrl = { ...defaultProps, url: 'https://example.com' };
    render(<ExportSettings {...propsWithUrl} />);
    
    const pngButton = screen.getByRole('button', { name: /download png/i });
    await userEvent.click(pngButton);
    
    expect(mockOnDownload).toHaveBeenCalledWith('png');
  });
}); 