import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useDoctorsList } from '../../infra/doctor/hooks/use-doctors-list';
import { useSpecialtiesGetAll } from '../../infra/specialty/hooks/use-specialties-get-all';
import { QueryClientAppProvider } from '../../main/providers/query-client.provider';
import { DoctorsManagementPage } from './doctors-management.page';

vi.mock('../../infra/doctor/hooks/use-doctors-list', () => ({
  useDoctorsList: vi.fn(() => ({
    data: [],
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../infra/specialty/hooks/use-specialties-get-all', () => ({
  useSpecialtiesGetAll: vi.fn(() => ({
    data: { data: [{ id: 's1', name: 'Medicina general' }] },
  })),
}));

vi.mock('../../infra/doctor/hooks/use-doctor-create', () => ({
  useDoctorCreate: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
    reset: vi.fn(),
    error: null,
  })),
}));

vi.mock('../../infra/doctor/hooks/use-doctor-update', () => ({
  useDoctorUpdate: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
    reset: vi.fn(),
    error: null,
  })),
}));

vi.mock('../../infra/doctor/hooks/use-doctor-delete', () => ({
  useDoctorDelete: vi.fn(() => ({
    mutateAsync: vi.fn(),
    isPending: false,
    reset: vi.fn(),
    error: null,
  })),
}));

vi.mock('../../infra/doctor/hooks/use-doctor-detail', () => ({
  useDoctorDetail: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
}));

vi.mock('../../infra/appointment/hooks/use-appointments-calendar', () => ({
  useAppointmentsCalendar: vi.fn(() => ({
    data: undefined,
    isLoading: false,
    error: null,
  })),
}));

function Providers({ children }: { children: ReactNode }) {
  return <QueryClientAppProvider>{children}</QueryClientAppProvider>;
}

describe('DoctorsManagementPage', () => {
  beforeEach(() => {
    vi.mocked(useDoctorsList).mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    } as never);
  });

  it('muestra estado vacío cuando no hay médicos', () => {
    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    expect(screen.getByRole('heading', { name: /equipo médico/i })).toBeInTheDocument();
    expect(screen.getByText(/Aún no hay médicos registrados/i)).toBeInTheDocument();
  });

  it('lista médicos con especialidades', () => {
    vi.mocked(useDoctorsList).mockReturnValue({
      data: [{ id: 'd1', name: 'Dr. Luna', cmp: 'CMP1', specialtyIds: ['s1'] }],
      isLoading: false,
      error: null,
    } as never);

    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    expect(screen.getByText('Dr. Luna')).toBeInTheDocument();
    expect(screen.getByText(/Medicina general/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dr\. Luna.*CMP.*CMP1/i)).toBeInTheDocument();
  });

  it('en la tarjeta compacta muestra la primera especialidad y +1 si hay dos', () => {
    vi.mocked(useSpecialtiesGetAll).mockReturnValue({
      data: {
        data: [
          { id: 's1', name: 'Dermatología' },
          { id: 's2', name: 'Pediatría' },
        ],
      },
    } as never);

    vi.mocked(useDoctorsList).mockReturnValue({
      data: [{ id: 'd1', name: 'Dra. García', cmp: 'CMP001', specialtyIds: ['s1', 's2'] }],
      isLoading: false,
      error: null,
    } as never);

    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    const card = screen.getByText('Dra. García').closest('article');
    expect(card).toBeTruthy();
    expect(card).toHaveTextContent(/Dermatología/);
    expect(card).toHaveTextContent('+1');
    expect(screen.getByLabelText(/Dermatología.*Pediatría/i)).toBeInTheDocument();
  });

  it('en la tarjeta compacta muestra 3+ si hay tres o más especialidades', () => {
    vi.mocked(useSpecialtiesGetAll).mockReturnValue({
      data: {
        data: [
          { id: 's1', name: 'Cardiología' },
          { id: 's2', name: 'Dermatología' },
          { id: 's3', name: 'Pediatría' },
        ],
      },
    } as never);

    vi.mocked(useDoctorsList).mockReturnValue({
      data: [{ id: 'd1', name: 'Dr. Multi', cmp: 'CMP9', specialtyIds: ['s1', 's2', 's3'] }],
      isLoading: false,
      error: null,
    } as never);

    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    const card = screen.getByText('Dr. Multi').closest('article');
    expect(card).toHaveTextContent(/Cardiología/);
    expect(card).toHaveTextContent('3+');
  });

  it('muestra error de carga', () => {
    vi.mocked(useDoctorsList).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('Sin conexión'),
    } as never);

    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Sin conexión');
  });

  it('muestra cargando mientras llegan los médicos', () => {
    vi.mocked(useDoctorsList).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as never);

    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    expect(screen.getByText(/Cargando médicos/i)).toBeInTheDocument();
  });

  it('abre el formulario al pulsar Nuevo médico', () => {
    render(
      <Providers>
        <DoctorsManagementPage sidebar={<aside aria-label="sidebar test" />} />
      </Providers>,
    );

    fireEvent.click(screen.getByRole('button', { name: /nuevo médico/i }));

    expect(screen.getByRole('complementary', { name: /nuevo médico/i })).toBeInTheDocument();
  });
});
