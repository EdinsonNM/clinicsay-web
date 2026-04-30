import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../../main/providers/app-providers';
import { AppointmentCreateForm } from './appointment-create.form';

describe('AppointmentCreateForm', () => {
  it('renders appointment form', () => {
    render(<AppProviders><AppointmentCreateForm /></AppProviders>);
    expect(screen.getByText('Nueva cita')).toBeInTheDocument();
  });
});
