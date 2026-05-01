import { test, expect } from '@playwright/test';

test('admin appointments smoke', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('ClinicSay Admin')).toBeVisible();
});

test('shows a clear error when the configured API is unavailable', async ({ page }) => {
  await page.route('**/api/v1/auth/login', (route) => route.abort());
  await page.goto('/');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByText(/No se pudo contactar la API configurada/)).toBeVisible();
});
