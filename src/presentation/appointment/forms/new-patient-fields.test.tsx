import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NewPatientFields } from './new-patient-fields';

describe('NewPatientFields', () => {
  it('renders new patient inputs', () => {
    render(<NewPatientFields fullName="" dni="" onFullName={() => undefined} onDni={() => undefined} />);
    expect(screen.getByText('Nombre paciente nuevo')).toBeInTheDocument();
  });

  it('notifica cambios en nombre y DNI', () => {
    const onFullName = vi.fn();
    const onDni = vi.fn();
    render(<NewPatientFields fullName="" dni="" onFullName={onFullName} onDni={onDni} />);
    const textboxes = screen.getAllByRole('textbox');
    fireEvent.change(textboxes[0], { target: { value: 'María' } });
    fireEvent.change(textboxes[1], { target: { value: '12345678' } });
    expect(onFullName).toHaveBeenCalledWith('María');
    expect(onDni).toHaveBeenCalledWith('12345678');
  });
});
