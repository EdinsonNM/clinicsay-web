import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SpecialtyStep } from './specialty-step';

describe('SpecialtyStep', () => {
  it('lista especialidades y permite elegir una', () => {
    const onSelectSpecialty = vi.fn();
    const onBack = vi.fn();

    render(
      <SpecialtyStep
        specialties={[{ id: 's1', name: 'Cardiología' }]}
        onBack={onBack}
        onSelectSpecialty={onSelectSpecialty}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Cardiología/i }));
    expect(onSelectSpecialty).toHaveBeenCalledWith({ id: 's1', name: 'Cardiología' });

    fireEvent.click(screen.getByRole('button', { name: /volver/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
