import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NewPatientFields } from './new-patient-fields';

describe('NewPatientFields', () => {
  it('renders new patient inputs', () => {
    render(<NewPatientFields fullName="" dni="" onFullName={() => undefined} onDni={() => undefined} />);
    expect(screen.getByText('Nombre paciente nuevo')).toBeInTheDocument();
  });
});
