import { expect, Page } from '@playwright/test';

export async function waitForLoading(page: Page, timeoutMs = 5000): Promise<void> {
  const loadingOverlay = page.getByRole('progressbar').first();

  let overlayDetected = await loadingOverlay.isVisible();

  if (!overlayDetected) {
    try {
      await expect(loadingOverlay).toBeVisible({ timeout: 1500 });
      overlayDetected = true;
    } catch {
      console.warn('[wait-helper] Loading overlay not detected; continuing without wait.');
      return;
    }
  }

  await expect(loadingOverlay).toBeHidden({ timeout: timeoutMs });
}
