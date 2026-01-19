import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GameProvider } from '../../contexts/GameContext';
import ActionButton from '../../components/ActionButton';

// Mock component wrapper
const MockWrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('ActionButton Component', () => {
  beforeEach(() => {
    render(<ActionButton onClick={() => {}} emoji="🍖" label="Test Button" />, { wrapper: MockWrapper });
  });

  it('renders with correct emoji and label', () => {
    expect(screen.getByText('🍖 Test Button')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const mockOnClick = vi.fn();
    render(
      <ActionButton onClick={mockOnClick} emoji="🍖" label="Click Me" />, 
      { wrapper: MockWrapper }
    );
    
    const button = screen.getByText('🍖 Click Me');
    fireEvent.click(button);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('shows disabled state when disabled prop is true', () => {
    render(
      <ActionButton onClick={() => {}} emoji="🍖" label="Disabled" disabled={true} />, 
      { wrapper: MockWrapper }
    );
    
    const button = screen.getByText('🍖 Disabled');
    expect(button).toBeDisabled();
  });
});