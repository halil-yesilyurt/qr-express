import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRCodeSettings } from './QRCodeSettings';
import { ErrorCorrectionLevel, ErrorLevel } from '../types';
import { vi } from 'vitest';

describe('QRCodeSettings', () => {
  const defaultProps = {
    frontColor: '#000000',
    backColor: '#FFFFFF',
    errorLevel: 'H' as ErrorCorrectionLevel,
    onFrontColorChange: vi.fn(),
    onBackColorChange: vi.fn(),
    onErrorLevelChange: vi.fn(),
    isDarkMode: false,
    errorLevels: [
      { value: 'L' as ErrorCorrectionLevel, label: 'Low' },
      { value: 'M' as ErrorCorrectionLevel, label: 'Medium' },
      { value: 'Q' as ErrorCorrectionLevel, label: 'Quartile' },
      { value: 'H' as ErrorCorrectionLevel, label: 'High' },
    ] as ErrorLevel[],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all color inputs and error level selector', () => {
    render(<QRCodeSettings {...defaultProps} />);
    
    expect(screen.getByLabelText(/front color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/back color/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/error correction level/i)).toBeInTheDocument();
  });

  it('calls onFrontColorChange when front color is changed', async () => {
    render(<QRCodeSettings {...defaultProps} />);
    
    const colorInput = screen.getByLabelText(/front color/i);
    fireEvent.change(colorInput, { target: { value: '#ff0000' } });
    
    expect(defaultProps.onFrontColorChange).toHaveBeenCalledWith('#ff0000');
  });

  it('calls onBackColorChange when background color is changed', async () => {
    render(<QRCodeSettings {...defaultProps} />);
    
    const colorInput = screen.getByLabelText(/back color/i);
    fireEvent.change(colorInput, { target: { value: '#00ff00' } });
    
    expect(defaultProps.onBackColorChange).toHaveBeenCalledWith('#00ff00');
  });

  it('calls onErrorLevelChange when error correction level is changed', async () => {
    render(<QRCodeSettings {...defaultProps} />);
    
    const select = screen.getByLabelText(/error correction level/i);
    await userEvent.selectOptions(select, 'L');
    
    expect(defaultProps.onErrorLevelChange).toHaveBeenCalledWith('L');
  });

  it('displays current color values', () => {
    const props = {
      ...defaultProps,
      frontColor: '#ff0000',
      backColor: '#00ff00',
    };
    
    render(<QRCodeSettings {...props} />);
    
    const frontColorInput = screen.getByLabelText(/front color/i);
    const backColorInput = screen.getByLabelText(/back color/i);
    
    expect(frontColorInput).toHaveValue('#ff0000');
    expect(backColorInput).toHaveValue('#00ff00');
  });

  it('displays current error level', () => {
    render(<QRCodeSettings {...defaultProps} />);
    
    const select = screen.getByLabelText(/error correction level/i);
    expect(select).toHaveValue('H');
  });

  it('applies dark mode styles correctly', () => {
    render(<QRCodeSettings {...defaultProps} isDarkMode={true} />);
    
    const labels = screen.getAllByText(/color|error correction level/i);
    labels.forEach(label => {
      expect(label).toHaveClass('text-gray-200');
    });
  });
}); 