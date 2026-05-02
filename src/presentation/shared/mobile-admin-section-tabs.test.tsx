import { fireEvent, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../core/navigation/app-routes';
import { MobileAdminSectionTabs } from './mobile-admin-section-tabs';

describe('MobileAdminSectionTabs', () => {
  it('navega entre Agenda y Médicos', () => {
    const router = createMemoryRouter(
      [
        { path: APP_ROUTES.agenda, element: <MobileAdminSectionTabs /> },
        { path: APP_ROUTES.doctors, element: <MobileAdminSectionTabs /> },
      ],
      { initialEntries: [APP_ROUTES.agenda] },
    );
    render(<RouterProvider router={router} />);

    fireEvent.click(screen.getByRole('button', { name: 'Médicos' }));
    expect(router.state.location.pathname).toBe(APP_ROUTES.doctors);

    fireEvent.click(screen.getByRole('button', { name: 'Agenda' }));
    expect(router.state.location.pathname).toBe(APP_ROUTES.agenda);
  });
});
