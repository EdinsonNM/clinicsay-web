import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { SessionProvider, useSession } from './session.provider';

describe('SessionProvider', () => {
  it('lanza si useSession se usa fuera del provider', () => {
    expect(() => renderHook(() => useSession())).toThrow(/SessionProvider/);
  });

  it('expone sesión undefined y permite setSession', () => {
    const wrapper = ({ children }: { children: ReactNode }) => <SessionProvider>{children}</SessionProvider>;
    const { result } = renderHook(() => useSession(), { wrapper });
    expect(result.current.session).toBeUndefined();

    act(() => {
      result.current.setSession({
        token: 'tok',
        user: { id: 'u1', role: 'admin', name: 'Admin' },
      });
    });
    expect(result.current.session?.token).toBe('tok');
    expect(result.current.session?.user.name).toBe('Admin');

    act(() => {
      result.current.setSession(undefined);
    });
    expect(result.current.session).toBeUndefined();
  });
});
