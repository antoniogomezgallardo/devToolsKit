import { test, expect } from '@playwright/test';

test.describe('JWT Decoder Tool', () => {
  const validJWT = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MDA0MzkyMjIsImlzcyI6ImRldnRvb2xza2l0LmNvbSIsImF1ZCI6ImRldmVsb3BlcnMifQ.DzIQfLEYz0P8tnkj8tDDY5qj2ZeOy8xWU-3n5kZfYH4';
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/jwt-decoder');
  });

  test('should decode valid JWT', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    
    // Should show success message
    await expect(page.getByText(/✅ JWT decodificado correctamente/)).toBeVisible();
    
    // Header should be decoded
    const headerTextarea = page.getByPlaceholder('Header del JWT aparecerá aquí...');
    await expect(headerTextarea).toContainText('HS256');
    await expect(headerTextarea).toContainText('JWT');
    
    // Payload should be decoded
    const payloadTextarea = page.getByPlaceholder('Payload del JWT aparecerá aquí...');
    await expect(payloadTextarea).toContainText('John Doe');
    await expect(payloadTextarea).toContainText('1234567890');
    
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
    
    // Should show decoded content
    await expect(page.getByPlaceholder('Header del JWT aparecerá aquí...')).toContainText('HS256');
  });

  test('should copy header and payload separately', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    await expect(page.getByText(/✅ JWT decodificado correctamente/)).toBeVisible();
    
    // Copy header
    const headerCopyBtn = page.getByRole('button', { name: 'Copiar' }).first();
    await headerCopyBtn.click();
    await expect(page.getByText('¡Copiado!').first()).toBeVisible();
    
    // Copy payload
    const payloadCopyBtn = page.getByRole('button', { name: 'Copiar' }).last();
    await payloadCopyBtn.click();
    await expect(page.getByText('¡Copiado!').last()).toBeVisible();
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
    // Click on example
    await page.getByRole('button', { name: /JWT Estándar/ }).click();
    
    // Input should be filled with example
    const input = page.getByPlaceholder(/Pega aquí tu token JWT/);
    await expect(input).not.toHaveValue('');
    
    // Should auto-decode
    await expect(page.getByText(/✅ JWT decodificado correctamente/)).toBeVisible();
  });

  test('should show JWT information', async ({ page }) => {
    // Input valid JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(validJWT);
    
    // Should show JWT info section
    await expect(page.getByText('Información del JWT')).toBeVisible();
    
    // Should show algorithm info
    await expect(page.getByText('Algoritmo')).toBeVisible();
    await expect(page.getByText('HS256')).toBeVisible();
    
    // Should show token type
    await expect(page.getByText('Tipo')).toBeVisible();
    await expect(page.getByText('JWT')).toBeVisible();
  });

  test('should display security warning', async ({ page }) => {
    // Should show security warning
    await expect(page.getByText('⚠️ Aviso de Seguridad')).toBeVisible();
    await expect(page.getByText('No verifica la firma ni la autenticidad')).toBeVisible();
    await expect(page.getByText('No uses tokens sensibles en herramientas online')).toBeVisible();
  });

  test('should handle malformed JWT parts', async ({ page }) => {
    const malformedJWT = 'header.invalid-payload.signature';
    
    // Input malformed JWT
    await page.getByPlaceholder(/Pega aquí tu token JWT/).fill(malformedJWT);
    
    // Should show specific error
    await expect(page.getByText(/❌.*Payload JWT inválido/)).toBeVisible();
  });
});