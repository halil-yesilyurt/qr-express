import { render, screen } from '@testing-library/react';
import { QRCodeDisplay } from './QRCodeDisplay';

describe('QRCodeDisplay', () => {
  const defaultProps = {
    url: '',
    frontColor: '#000000',
    backColor: '#FFFFFF',
    errorLevel: 'H' as const,
    isDarkMode: false,
  };

  it('renders QR code with given URL', () => {
    const testUrl = 'https://example.com';
    render(
      <QRCodeDisplay
        {...defaultProps}
        url={testUrl}
      />
    );

    // Check if QR code container is rendered
    const qrCodeContainer = screen.getByRole('img', { name: /generated qr code/i });
    expect(qrCodeContainer).toBeInTheDocument();
    expect(qrCodeContainer).toHaveClass('opacity-100');

    // Verify QR code SVG exists
    const qrCodeSvg = screen.getByTestId('qr-code');
    expect(qrCodeSvg).toBeInTheDocument();
  });

  it('renders with placeholder when no URL is provided', () => {
    render(<QRCodeDisplay {...defaultProps} />);

    // Check if placeholder text is shown
    const placeholder = screen.getByText(/enter a url to generate qr code/i);
    expect(placeholder).toBeInTheDocument();

    // Check if QR code container has reduced opacity
    const qrCodeContainer = screen.getByRole('img', { name: /generated qr code/i });
    expect(qrCodeContainer).toHaveClass('opacity-20');
  });

  it('applies dark mode styles correctly', () => {
    render(<QRCodeDisplay {...defaultProps} isDarkMode={true} />);

    const container = screen.getByLabelText(/qr code preview/i);
    expect(container.firstElementChild).toHaveClass('bg-gray-700');
  });

  it('renders with correct container styles', () => {
    const { container } = render(<QRCodeDisplay {...defaultProps} />);
    
    // Check for proper styling classes
    const section = container.firstElementChild;
    expect(section).toHaveClass('mb-8');
    
    const qrContainer = section?.firstElementChild;
    expect(qrContainer).toHaveClass('p-8', 'rounded-lg', 'bg-gray-50');
  });
}); 