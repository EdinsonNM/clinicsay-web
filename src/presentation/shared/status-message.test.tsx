import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { StatusMessage } from './status-message';

describe('StatusMessage', () => {
  it('renderiza el mensaje', () => {
    render(<StatusMessage message="Algo pasó" />);
    expect(screen.getByText('Algo pasó')).toBeInTheDocument();
  });

  it('aplica clase success cuando kind es success', () => {
    const { container } = render(<StatusMessage kind="success" message="OK" />);
    expect(container.firstChild).toHaveClass('success');
  });
});
