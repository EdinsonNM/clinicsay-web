import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../../core/navigation/app-routes';
import { AgendaSidebar } from './agenda-sidebar';

describe('AgendaSidebar', () => {
  it('navega a Agenda y Médicos', () => {
    const router = createMemoryRouter(
      [
        { path: APP_ROUTES.agenda, element: <AgendaSidebar /> },
        { path: APP_ROUTES.doctors, element: <AgendaSidebar /> },
      ],
      { initialEntries: [APP_ROUTES.doctors] },
    );
    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button', { name: /agenda/i }));
    expect(router.state.location.pathname).toBe(APP_ROUTES.agenda);

    fireEvent.click(screen.getByRole('button', { name: /médicos/i }));
    expect(router.state.location.pathname).toBe(APP_ROUTES.doctors);
  });
});
