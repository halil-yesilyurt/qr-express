import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { vi } from 'vitest';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn(),
  },
});

describe('App', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    // Reset mocks
    vi.clearAllMocks();
  });

  it('renders the main title', () => {
    render(<App />);
    expect(screen.getByText(/qr code generator/i)).toBeInTheDocument();
  });

  it('generates QR code when URL is entered', async () => {
    render(<App />);
    
    const input = screen.getByLabelText(/website url/i);
    await userEvent.type(input, 'https://example.com');
    
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
  });

  it('toggles dark mode', async () => {
    render(<App />);
    
    const darkModeButton = screen.getByLabelText(/switch to dark mode/i);
    await userEvent.click(darkModeButton);
    
    expect(screen.getByRole('main')).toHaveClass('bg-gray-900');
  });

  it('shows history dropdown when history button is clicked', async () => {
    render(<App />);
    
    // Add an item to history
    const input = screen.getByLabelText(/website url/i);
    await userEvent.type(input, 'https://example.com');
    
    // Trigger history addition by downloading PNG
    const downloadButton = screen.getByRole('button', { name: /download png/i });
    await userEvent.click(downloadButton);
    
    // Open history
    const historyButton = screen.getByLabelText(/toggle history/i);
    await userEvent.click(historyButton);
    
    // Wait for history to be visible
    const historyItem = await screen.findByText('https://example.com');
    expect(historyItem).toBeInTheDocument();
  });

  it('updates QR code settings', async () => {
    render(<App />);
    
    // Change QR code color
    const colorInput = screen.getByLabelText(/select qr code front color/i);
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    
    // Change error level
    const errorLevelSelect = screen.getByLabelText(/error correction level/i);
    await userEvent.selectOptions(errorLevelSelect, 'L');
    
    // Verify QR code is updated
    const qrCode = screen.getByTestId('qr-code');
    expect(qrCode).toBeInTheDocument();
  });

  it('handles logo upload', async () => {
    render(<App />);
    
    const fileInput = screen.getByLabelText(/upload custom logo/i);
    const file = new File(['dummy content'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });
    
    expect(screen.getByText('test.png')).toBeInTheDocument();
  });

  it('handles download size change', async () => {
    render(<App />);
    
    const sizeSelect = screen.getByLabelText(/download size/i);
    await userEvent.selectOptions(sizeSelect, '512');
    
    expect(sizeSelect).toHaveValue('512');
  });

  it('shows placeholder when no URL is entered', () => {
    render(<App />);
    
    expect(screen.getByText(/enter a url to generate qr code/i)).toBeInTheDocument();
  });
}); 