import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { DoctorAdminFormPanel } from './doctor-admin-form-panel';

const specialties = [
  { id: 's-1', name: 'Cardiología' },
  { id: 's-2', name: 'Pediatría' },
];

describe('DoctorAdminFormPanel', () => {
  it('envía nombre, CMP y especialidades seleccionadas', async () => {
    const onSubmitValues = vi.fn().mockResolvedValue(undefined);

    render(
      <DoctorAdminFormPanel
        specialties={specialties}
        editingDoctor={null}
        onClose={vi.fn()}
        onSubmitValues={onSubmitValues}
        isPending={false}
      />,
    );

    fireEvent.change(screen.getByLabelText(/nombre completo/i), { target: { value: 'Dr. Mendoza' } });
    fireEvent.change(screen.getByLabelText(/^CMP$/i), { target: { value: 'CMP999' } });
    fireEvent.click(screen.getByRole('checkbox', { name: /Cardiología/i }));

    await waitFor(() => {
      expect(screen.getByRole('checkbox', { name: /Cardiología/i })).toBeChecked();
    });

    fireEvent.click(screen.getByRole('button', { name: /crear médico/i }));

    await waitFor(() => {
      expect(onSubmitValues).toHaveBeenCalledWith({
        name: 'Dr. Mendoza',
        cmp: 'CMP999',
        specialtyIds: ['s-1'],
      });
    });
  });

  it('rellena datos al editar', () => {
    render(
      <DoctorAdminFormPanel
        specialties={specialties}
        editingDoctor={{
          id: 'd1',
          name: 'Dr. Pérez',
          cmp: 'CMP1',
          specialtyIds: ['s-2'],
        }}
        onClose={vi.fn()}
        onSubmitValues={vi.fn()}
        isPending={false}
      />,
    );

    expect(screen.getByDisplayValue('Dr. Pérez')).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /Pediatría/i })).toBeChecked();
  });
});
