import { test, expect } from '@playwright/test';

test('admin appointments smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: /Bienvenido de nuevo/i })).toBeVisible();
});

test('shows a clear error when the configured API is unavailable', async ({ page }) => {
  await page.route('**/api/v1/auth/login', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: /Iniciar Sesión/i }).click();
  await expect(page.getByText(/No se pudo contactar la API configurada/)).toBeVisible();
});
