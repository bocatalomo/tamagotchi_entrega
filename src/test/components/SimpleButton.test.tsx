import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ActionButton from '../../components/ActionButton';

describe('ActionButton Component', () => {
  it('renders button text correctly', () => {
    render(<ActionButton onClick={() => {}} emoji="🍖" label="Test Button" />);
    expect(screen.getByText('🍖 Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(<ActionButton onClick={mockOnClick} emoji="🍖" label="Click Me" />);
    
    const button = screen.getByText('🍖 Click Me');
    button.click();
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});