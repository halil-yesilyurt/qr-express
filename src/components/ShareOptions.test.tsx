import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShareOptions } from './ShareOptions';
import { vi } from 'vitest';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

// Mock share API
const mockShare = vi.fn().mockImplementation(() => Promise.resolve());
Object.assign(navigator, {
  share: mockShare,
});

describe('ShareOptions', () => {
  const defaultProps = {
    url: 'https://example.com',
    isDarkMode: false,
    disabled: false,
    addToHistory: vi.fn(),
    onShare: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders share button', () => {
    render(<ShareOptions {...defaultProps} />);
    
    const shareButton = screen.getByRole('button', { name: /share options/i });
    expect(shareButton).toBeInTheDocument();
  });

  it('shows tooltip when copying to clipboard', async () => {
    render(<ShareOptions {...defaultProps} />);
    
    const copyButton = screen.getByRole('button', { name: /copy link/i });
    await userEvent.click(copyButton);
    
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(defaultProps.url);
    expect(screen.getByText(/url copied!/i)).toBeInTheDocument();
  });

  it('disables buttons when disabled prop is true', () => {
    render(<ShareOptions {...defaultProps} disabled={true} />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveClass('cursor-not-allowed');
      expect(button).toHaveClass('bg-gray-300');
    });
  });

  it('calls addToHistory when sharing', async () => {
    render(<ShareOptions {...defaultProps} />);
    
    const copyButton = screen.getByRole('button', { name: /copy link/i });
    await userEvent.click(copyButton);
    
    expect(defaultProps.addToHistory).toHaveBeenCalledWith(defaultProps.url);
  });

  it('opens social dropdown when share button is clicked', async () => {
    render(<ShareOptions {...defaultProps} />);
    
    const shareButton = screen.getByRole('button', { name: /share options/i });
    await userEvent.click(shareButton);
    
    // Check if social platform buttons are visible
    const socialButtons = screen.getAllByRole('button', { name: /share on/i });
    expect(socialButtons.length).toBeGreaterThan(0);
  });

  it('closes social dropdown when clicking outside', async () => {
    render(
      <div>
        <div data-testid="outside">Outside</div>
        <ShareOptions {...defaultProps} />
      </div>
    );
    
    // Open dropdown
    const shareButton = screen.getByRole('button', { name: /share options/i });
    await userEvent.click(shareButton);
    
    // Click outside
    const outsideElement = screen.getByTestId('outside');
    await userEvent.click(outsideElement);
    
    // Check if dropdown is closed
    const socialButtons = screen.queryAllByRole('button', { name: /share on/i });
    expect(socialButtons.length).toBe(0);
  });

  it('uses native share when available', async () => {
    render(<ShareOptions {...defaultProps} />);
    
    // Open the social dropdown
    const shareOptionsButton = screen.getByRole('button', { name: /share options/i });
    await userEvent.click(shareOptionsButton);
    
    // Find and click the native share button in the dropdown
    const nativeShareButton = screen.getByRole('button', { name: /share on share/i });
    await userEvent.click(nativeShareButton);
    
    // Wait for the share dialog to be triggered
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(mockShare).toHaveBeenCalledWith({
      title: 'Share QR Code',
      text: 'Check out this QR code I generated!',
      url: defaultProps.url,
    });
  });
}); 