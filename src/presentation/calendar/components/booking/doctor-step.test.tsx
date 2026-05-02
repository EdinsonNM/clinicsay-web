import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DoctorStep } from './doctor-step';

describe('DoctorStep', () => {
  it('muestra vacío cuando no hay médicos', () => {
    render(
      <DoctorStep
        doctors={[]}
        isLoading={false}
        onBack={vi.fn()}
        onSelectDoctor={vi.fn()}
      />,
    );
    expect(screen.getByText(/No hay médicos para esta especialidad/i)).toBeInTheDocument();
  });

  it('permite elegir un médico y volver a especialidades', () => {
    const onSelectDoctor = vi.fn();
    const onBack = vi.fn();
    render(
      <DoctorStep
        doctors={[{ id: 'd1', name: 'Dr. X', cmp: 'C1', specialtyIds: ['s1'] }]}
        isLoading={false}
        onBack={onBack}
        onSelectDoctor={onSelectDoctor}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /Dr\. X/i }));
    expect(onSelectDoctor).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'd1', name: 'Dr. X' }),
    );

    fireEvent.click(screen.getByRole('button', { name: /Especialidades/i }));
    expect(onBack).toHaveBeenCalled();
  });
});
