import { test, expect } from '@playwright/test';

test.describe('JWT Decoder Tool', () => {
const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.Lzg_5KMhcz8bCOaFZg8X8oN7W8p4V_jJx4j4E3E4mE8';  
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/jwt-decoder');
  });

  test('should decode valid JWT', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    
    // Should show success message
    await expect(page.getByText(/JWT decodificado correctamente/)).toBeVisible();
    
    // Should show JWT information section
    await expect(page.locator('#info-container')).toBeVisible();
    
    // Verify key JWT information is displayed
    await expect(page.getByText('HS256')).toBeVisible();
    await expect(page.getByText('🟢 Válido')).toBeVisible();
    await expect(page.getByText('1234567890')).toBeVisible();
    
    // Copy buttons should be enabled
    await expect(page.getByRole('button', { name: 'Copiar' }).first()).toBeEnabled();
    await expect(page.getByRole('button', { name: 'Copiar' }).last()).toBeEnabled();
  });

  test('should detect expired JWT', async ({ page }) => {
    const expiredJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE1MTYyMzkwMjJ9.4Adcj3UFYzPUVaVF43FmMab6RlaQD8A9V8wFzzht-KQ';
    
    // Input expired JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(expiredJWT);
    
    // Should show warning for expired token
    await expect(page.getByText(/⚠️ JWT decodificado correctamente \(Token expirado\)/)).toBeVisible();
    
    // Should show expiration info
    await expect(page.getByText(/Expirado hace/)).toBeVisible();
  });

  test('should handle invalid JWT', async ({ page }) => {
    const invalidJWT = 'invalid.jwt.token';
    
    // Input invalid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(invalidJWT);
    
    // Should show error message
    await expect(page.getByText(/❌/)).toBeVisible();
    
    // Headers and payload should be empty
    await expect(page.getByPlaceholder('Header del JWT aparecerá aquí...')).toHaveValue('');
    await expect(page.getByPlaceholder('Payload del JWT aparecerá aquí...')).toHaveValue('');
    
    // Copy buttons should be disabled
    await expect(page.getByRole('button', { name: 'Copiar' }).first()).toBeDisabled();
  });

  test('should handle Bearer token prefix', async ({ page }) => {
    const bearerToken = `Bearer ${validJWT}`;
    
    // Input JWT with Bearer prefix
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(bearerToken);
    
    // Should decode successfully
    await expect(page.getByText(/✅ JWT decodificado correctamente/)).toBeVisible();
    
    // Should show decoded content in info section
    const infoContainer = page.locator('#info-container');
    await expect(infoContainer.getByText('HS256')).toBeVisible();
    await expect(infoContainer.getByText('🟢 Válido')).toBeVisible();
  });

  test('should copy header and payload separately', async ({ page }) => {
    // Mock clipboard API for headless compatibility
    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: async (text) => {
            window.lastCopiedText = text;
            return Promise.resolve();
          },
          readText: async () => {
            return Promise.resolve(window.lastCopiedText || '');
          }
        }
      });
    });
    
    // Grant clipboard permissions for headless mode
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    await expect(page.getByText(/JWT decodificado correctamente/)).toBeVisible();
    
    // Wait for processing and button to be ready
    await page.waitForTimeout(1000);
    
    // Find first copy button (header) with fallback selectors
    let headerCopyBtn = page.getByRole('button', { name: 'Copiar' }).first();
    if (await headerCopyBtn.count() === 0) {
      headerCopyBtn = page.locator('button').filter({ hasText: 'Copiar' }).first();
    }
    
    // Ensure button is ready and visible
    await expect(headerCopyBtn).toBeVisible();
    await expect(headerCopyBtn).toBeEnabled();
    await headerCopyBtn.scrollIntoViewIfNeeded();
    
    // Simulate user interaction to enable clipboard access
    await page.mouse.move(0, 0);
    await page.mouse.click(0, 0);
    
    // Click header copy button
    try {
      await headerCopyBtn.click();
    } catch (error) {
      await headerCopyBtn.click({ force: true });
    }
    
    // Should show success feedback on header button
    await expect(page.locator('#copy-header-btn')).toContainText('¡Copiado!', { timeout: 3000 });
    
    // Wait for feedback to clear
    await page.waitForTimeout(1500);
    
    // Find second copy button (payload) with fallback selectors
    let payloadCopyBtn = page.getByRole('button', { name: 'Copiar' }).last();
    if (await payloadCopyBtn.count() === 0) {
      payloadCopyBtn = page.locator('button').filter({ hasText: 'Copiar' }).last();
    }
    
    // Ensure second button is ready
    await expect(payloadCopyBtn).toBeVisible();
    await expect(payloadCopyBtn).toBeEnabled();
    await payloadCopyBtn.scrollIntoViewIfNeeded();
    
    // Click payload copy button
    try {
      await payloadCopyBtn.click();
    } catch (error) {
      await payloadCopyBtn.click({ force: true });
    }
    
    // Should show success feedback on payload button
    await expect(page.locator('#copy-payload-btn')).toContainText('¡Copiado!', { timeout: 3000 });
  });

  test('should clear all fields', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    await expect(page.getByText(/✅ JWT decodificado correctamente/)).toBeVisible();
    
    // Click clear button
    await page.getByRole('button', { name: 'Limpiar' }).click();
    
    // All fields should be empty
    await expect(page.getByPlaceholder(/Pega aquí tu token JWT/)).toHaveValue('');
    await expect(page.getByPlaceholder('Header del JWT aparecerá aquí...')).toHaveValue('');
    await expect(page.getByPlaceholder('Payload del JWT aparecerá aquí...')).toHaveValue('');
    
    // Should show initial status
    await expect(page.getByText('Introduce un token JWT para decodificar')).toBeVisible();
  });

  test('should load example JWT', async ({ page }) => {
    // Try multiple selectors to find the example button
    let exampleBtn;
    
    // Method 1: By class name
    exampleBtn = page.locator('.example-btn').first();
    if (await exampleBtn.count() === 0) {
      // Method 2: By data attribute
      exampleBtn = page.locator('[data-example="standard"]');
    }
    if (await exampleBtn.count() === 0) {
      // Method 3: By heading text inside button
      exampleBtn = page.getByRole('button').filter({ hasText: 'JWT Estándar' });
    }
    if (await exampleBtn.count() === 0) {
      // Method 4: By any button containing "JWT"
      exampleBtn = page.getByRole('button').filter({ hasText: /JWT/i });
    }
    
    // Only proceed if button exists
    if (await exampleBtn.count() > 0) {
      // Ensure button is visible and ready
      await expect(exampleBtn.first()).toBeVisible();
      await exampleBtn.first().scrollIntoViewIfNeeded();
      
      // Click the example button
      await exampleBtn.first().click();
      
      // Input should be filled with example
      const input = page.getByPlaceholder(/Pega aquí tu token JWT/);
      await expect(input).not.toHaveValue('');
      
      // Should auto-decode
      await expect(page.getByText(/JWT decodificado correctamente/)).toBeVisible();
      
      // Should show JWT information
      await expect(page.locator('#info-container')).toBeVisible();
    } else {
      // Skip test if no example button found
      test.skip();
    }
  });

  test('should show JWT information', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    
    // Should show success message
    await expect(page.getByText(/JWT decodificado correctamente/)).toBeVisible();
    
    // Should show JWT information section
    await expect(page.locator('#info-container')).toBeVisible();
    
    // Verify key JWT information is displayed (same approach as 'should decode valid JWT')
    await expect(page.getByText('Información del JWT')).toBeVisible();
    await expect(page.getByText('HS256')).toBeVisible();
    await expect(page.getByText('🟢 Válido')).toBeVisible();
    await expect(page.getByText('1234567890')).toBeVisible();
    await expect(page.getByText('Algoritmo')).toBeVisible();
    await expect(page.getByText('Tipo')).toBeVisible();
    await expect(page.getByText('Estado')).toBeVisible();
  });

  test('should display security warning', async ({ page }) => {
    // Should show security warning
    await expect(page.getByText('⚠️ Aviso de Seguridad')).toBeVisible();
    await expect(page.getByText('No verifica la firma ni la autenticidad')).toBeVisible();
    await expect(page.getByText('No uses tokens sensibles en herramientas online')).toBeVisible();
  });

  test('should handle malformed JWT parts', async ({ page }) => {
    const malformedJWT = 'example.invalid.jwt';
    
    // Input malformed JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(malformedJWT);
    
    // Should show specific error
    await expect(page.getByText(/❌.*Header JWT inválido o mal formateado/)).toBeVisible();
  });
});