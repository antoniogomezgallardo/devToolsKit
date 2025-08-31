import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main title
    await expect(page).toHaveTitle(/Online DevToolsKit/);
    await expect(page.getByRole('heading', { name: /🛠️ Online DevToolsKit/ })).toBeVisible();
  });

  test('should display featured tools', async ({ page }) => {
    await page.goto('/');
    
    // Should show JSON Validator
    await expect(page.getByText('Validador JSON')).toBeVisible();
    
    // Should show JWT Decoder
    await expect(page.getByText('JWT Decoder')).toBeVisible();
  });

  test('should navigate to tools from homepage', async ({ page }) => {
    await page.goto('/');
    
    // Click on JSON Validator
    await page.getByRole('button', { name: /Validador JSON/ }).click();
    await expect(page).toHaveURL('/tools/json-validator');
    await expect(page.getByText('JSON de entrada')).toBeVisible();
    
    // Go back to homepage
    await page.goBack();
    
    // Click on JWT Decoder  
    await page.getByRole('button', { name: /JWT Decoder/ }).click();
    await expect(page).toHaveURL('/tools/jwt-decoder');
    await expect(page.getByText('Token JWT')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    await page.goto('/');
    
    // Check mobile layout
    await expect(page.getByRole('heading', { name: /🛠️ Online DevToolsKit/ })).toBeVisible();
    
    // Tools should be visible in mobile layout
    await expect(page.getByText('Validador JSON')).toBeVisible();
    await expect(page.getByText('JWT Decoder')).toBeVisible();
  });

  test('should have proper SEO meta tags', async ({ page }) => {
    await page.goto('/');
    
    // Check meta description
    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute('content', /herramientas online para desarrolladores/);
    
    // Check Open Graph tags
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /Online DevToolsKit/);
    
    // Check canonical URL
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveCount(0); // Should be set dynamically
  });
});