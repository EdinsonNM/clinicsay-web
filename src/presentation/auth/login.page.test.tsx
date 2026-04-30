import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AppProviders } from '../../main/providers/app-providers';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  it('renders admin login form', () => {
    render(<AppProviders><LoginPage onLogin={() => undefined} /></AppProviders>);
    expect(screen.getByText('ClinicSay Admin')).toBeInTheDocument();
  });
});
