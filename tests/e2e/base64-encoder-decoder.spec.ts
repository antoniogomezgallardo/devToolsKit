import { test, expect } from '@playwright/test';

test.describe('Base64 Encoder/Decoder Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/base64');
    await expect(page).toHaveTitle(/Base64 Encoder/);
  });

  test.describe('Page Structure', () => {
    test('should display correct page elements', async ({ page }) => {
      // Header
      await expect(page.getByRole('heading', { name: 'Base64 Encoder/Decoder' })).toBeVisible();
      
      // Mode toggle buttons
      await expect(page.getByRole('button', { name: 'Codificar' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Decodificar' })).toBeVisible();
      
      // Input/Output areas
      await expect(page.getByText('Texto a codificar')).toBeVisible();
      await expect(page.getByText('Base64 codificado')).toBeVisible();
      
      // Action buttons
      await expect(page.getByRole('button', { name: /Codificar/ })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Limpiar' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Copiar' })).toBeVisible();
      await expect(page.getByRole('button', { name: /Archivo/ })).toBeVisible();
      await expect(page.getByRole('button', { name: /Formatear/ })).toBeVisible();
      
      // Examples section
      await expect(page.getByText('Ejemplos de uso')).toBeVisible();
      await expect(page.getByText('Texto simple')).toBeVisible();
      await expect(page.getByText('URL completa')).toBeVisible();
      await expect(page.getByText('JSON complejo')).toBeVisible();
    });

    test('should have proper initial state', async ({ page }) => {
      // Encode mode should be active by default
      const encodeModeBtn = page.getByRole('button', { name: 'Codificar' }).first();
      await expect(encodeModeBtn).toHaveClass(/bg-primary-600/);
      
      // Copy and format buttons should be disabled initially
      await expect(page.getByRole('button', { name: 'Copiar' })).toBeDisabled();
      await expect(page.getByRole('button', { name: /Formatear/ })).toBeDisabled();
      
      // Status should show initial message
      await expect(page.getByText('Introduce texto para codificar')).toBeVisible();
    });
  });

  test.describe('Encoding Functionality', () => {
    test('should encode simple text correctly', async ({ page }) => {
      const inputText = 'Hello World';
      const expectedBase64 = 'SGVsbG8gV29ybGQ=';
      
      await page.fill('textarea[placeholder*="codificar"]', inputText);
      
      // Should encode automatically (real-time)
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue(expectedBase64);
      
      // Status should show success
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Copy button should be enabled
      await expect(page.getByRole('button', { name: 'Copiar' })).toBeEnabled();
    });

    test('should encode UTF-8 characters', async ({ page }) => {
      const inputText = 'Hola mundo! 👋';
      
      await page.fill('textarea[placeholder*="codificar"]', inputText);
      
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue('SG9sYSBtdW5kbyEg8J+Riw==');
      
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });

    test('should encode JSON correctly', async ({ page }) => {
      const jsonText = '{"name":"test","value":123}';
      
      await page.fill('textarea[placeholder*="codificar"]', jsonText);
      
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue('eyJuYW1lIjoidGVzdCIsInZhbHVlIjoxMjN9');
    });

    test('should show statistics after encoding', async ({ page }) => {
      await page.fill('textarea[placeholder*="codificar"]', 'Hello');
      
      // Should show encoding statistics
      await expect(page.getByText('Estadísticas')).toBeVisible();
      await expect(page.getByText('Texto original:')).toBeVisible();
      await expect(page.getByText('Texto codificado:')).toBeVisible();
      await expect(page.getByText('Tipo:')).toBeVisible();
      await expect(page.getByText('Codificación')).toBeVisible();
    });
  });

  test.describe('Decoding Functionality', () => {
    test('should switch to decode mode', async ({ page }) => {
      await page.click('button:has-text("Decodificar")');
      
      // Decode mode should be active
      const decodeModeBtn = page.getByRole('button', { name: 'Decodificar' }).first();
      await expect(decodeModeBtn).toHaveClass(/bg-primary-600/);
      
      // Labels should change
      await expect(page.getByText('Base64 a decodificar')).toBeVisible();
      await expect(page.getByText('Texto decodificado')).toBeVisible();
      
      // Decode button should be visible
      await expect(page.getByRole('button', { name: /🔓 Decodificar/ })).toBeVisible();
      
      // File button should be hidden in decode mode
      await expect(page.getByRole('button', { name: /Archivo/ })).toBeHidden();
    });

    test('should decode Base64 correctly', async ({ page }) => {
      await page.click('button:has-text("Decodificar")');
      
      const base64Input = 'SGVsbG8gV29ybGQ=';
      const expectedText = 'Hello World';
      
      await page.fill('textarea[placeholder*="decodificar"]', base64Input);
      
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue(expectedText);
      
      await expect(page.getByText('✅ Base64 decodificado exitosamente')).toBeVisible();
    });

    test('should handle invalid Base64', async ({ page }) => {
      await page.click('button:has-text("Decodificar")');
      
      await page.fill('textarea[placeholder*="decodificar"]', 'invalid-base64-!@#');
      
      // Should show error
      await expect(page.getByText('❌ Formato Base64 inválido')).toBeVisible();
      
      // Output should be empty
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue('');
      
      // Copy button should be disabled
      await expect(page.getByRole('button', { name: 'Copiar' })).toBeDisabled();
    });

    test('should decode Base64 with whitespace', async ({ page }) => {
      await page.click('button:has-text("Decodificar")');
      
      const base64WithSpaces = 'SGVs bG8g V29y bGQ=';
      
      await page.fill('textarea[placeholder*="decodificar"]', base64WithSpaces);
      
      const outputTextarea = page.locator('textarea').nth(1);
      await expect(outputTextarea).toHaveValue('Hello World');
    });
  });

  test.describe('Interactive Features', () => {
    test('should copy output to clipboard', async ({ page }) => {
      await page.fill('textarea[placeholder*="codificar"]', 'Test copy');
      
      // Wait for encoding to complete
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Click copy button
      await page.click('button:has-text("Copiar")');
      
      // Button should show copied state temporarily
      await expect(page.getByText('¡Copiado!')).toBeVisible();
      
      // Should return to original state
      await expect(page.getByText('Copiar')).toBeVisible({ timeout: 3000 });
    });

    test('should clear all content', async ({ page }) => {
      await page.fill('textarea[placeholder*="codificar"]', 'Test clear');
      
      // Wait for encoding
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Click clear button
      await page.click('button:has-text("Limpiar")');
      
      // Both textareas should be empty
      const inputTextarea = page.locator('textarea').first();
      const outputTextarea = page.locator('textarea').nth(1);
      
      await expect(inputTextarea).toHaveValue('');
      await expect(outputTextarea).toHaveValue('');
      
      // Status should reset
      await expect(page.getByText('Introduce texto para codificar')).toBeVisible();
      
      // Copy button should be disabled
      await expect(page.getByRole('button', { name: 'Copiar' })).toBeDisabled();
    });

    test('should format Base64 output', async ({ page }) => {
      const longText = 'This is a very long text that should create a long Base64 string for testing the formatting functionality';
      
      await page.fill('textarea[placeholder*="codificar"]', longText);
      
      // Wait for encoding
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Format button should be enabled
      await expect(page.getByRole('button', { name: /Formatear/ })).toBeEnabled();
      
      // Click format button
      await page.click('button:has-text("Formatear")');
      
      // Output should contain line breaks
      const outputTextarea = page.locator('textarea').nth(1);
      const outputValue = await outputTextarea.inputValue();
      expect(outputValue).toContain('\n');
      
      // Status should update
      await expect(page.getByText('✅ Base64 formateado con saltos de línea')).toBeVisible();
    });
  });

  test.describe('Examples', () => {
    test('should load simple text example', async ({ page }) => {
      await page.click('[data-example="simple"]');
      
      const inputTextarea = page.locator('textarea').first();
      const inputValue = await inputTextarea.inputValue();
      
      expect(inputValue).toContain('Hola mundo! 👋');
      expect(inputValue).toContain('ejemplo simple');
      
      // Should auto-encode
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });

    test('should load URL example', async ({ page }) => {
      await page.click('[data-example="url"]');
      
      const inputTextarea = page.locator('textarea').first();
      const inputValue = await inputTextarea.inputValue();
      
      expect(inputValue).toContain('https://api.ejemplo.com');
      expect(inputValue).toContain('param1=valor1');
      
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });

    test('should load JSON example', async ({ page }) => {
      await page.click('[data-example="json"]');
      
      const inputTextarea = page.locator('textarea').first();
      const inputValue = await inputTextarea.inputValue();
      
      expect(inputValue).toContain('"usuario":');
      expect(inputValue).toContain('"contraseña":');
      expect(inputValue).toContain('"configuración":');
      
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });
  });

  test.describe('Real-time Processing', () => {
    test('should encode text in real-time while typing', async ({ page }) => {
      const inputTextarea = page.locator('textarea').first();
      const outputTextarea = page.locator('textarea').nth(1);
      
      // Type character by character
      await inputTextarea.fill('H');
      await expect(outputTextarea).toHaveValue('SA==');
      
      await inputTextarea.fill('He');
      await expect(outputTextarea).toHaveValue('SGU=');
      
      await inputTextarea.fill('Hel');
      await expect(outputTextarea).toHaveValue('SGVs');
      
      await inputTextarea.fill('Hell');
      await expect(outputTextarea).toHaveValue('SGVsbA==');
      
      await inputTextarea.fill('Hello');
      await expect(outputTextarea).toHaveValue('SGVsbG8=');
    });

    test('should decode Base64 in real-time while typing', async ({ page }) => {
      await page.click('button:has-text("Decodificar")');
      
      const inputTextarea = page.locator('textarea').first();
      const outputTextarea = page.locator('textarea').nth(1);
      
      // Type valid Base64 incrementally
      await inputTextarea.fill('SGVsbG8=');
      await expect(outputTextarea).toHaveValue('Hello');
      
      await inputTextarea.fill('SGVsbG8gV29ybGQ=');
      await expect(outputTextarea).toHaveValue('Hello World');
    });

    test('should clear output when input is emptied', async ({ page }) => {
      // First, add some content
      await page.fill('textarea[placeholder*="codificar"]', 'Test');
      await expect(page.locator('textarea').nth(1)).not.toHaveValue('');
      
      // Clear input
      await page.fill('textarea[placeholder*="codificar"]', '');
      
      // Output should be cleared
      await expect(page.locator('textarea').nth(1)).toHaveValue('');
      
      // Status should reset
      await expect(page.getByText('Introduce texto para codificar')).toBeVisible();
    });
  });

  test.describe('Mode Switching', () => {
    test('should preserve content when switching modes if valid', async ({ page }) => {
      // Encode some text
      await page.fill('textarea[placeholder*="codificar"]', 'Hello');
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      const encodedValue = await page.locator('textarea').nth(1).inputValue();
      
      // Switch to decode mode
      await page.click('button:has-text("Decodificar")');
      
      // Input should be cleared for mode switch
      await expect(page.locator('textarea').first()).toHaveValue('');
      await expect(page.locator('textarea').nth(1)).toHaveValue('');
    });

    test('should show appropriate placeholders for each mode', async ({ page }) => {
      // Encode mode
      await expect(page.locator('textarea').first()).toHaveAttribute('placeholder', /codificar/);
      
      // Switch to decode mode
      await page.click('button:has-text("Decodificar")');
      await expect(page.locator('textarea').first()).toHaveAttribute('placeholder', /decodificar/);
      
      // Switch back to encode mode
      await page.click('button:has-text("Codificar")');
      await expect(page.locator('textarea').first()).toHaveAttribute('placeholder', /codificar/);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle very long text', async ({ page }) => {
      const longText = 'A'.repeat(10000);
      
      await page.fill('textarea[placeholder*="codificar"]', longText);
      
      // Should still work with long text
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Output should not be empty
      const outputValue = await page.locator('textarea').nth(1).inputValue();
      expect(outputValue.length).toBeGreaterThan(0);
    });

    test('should handle special characters and symbols', async ({ page }) => {
      const specialChars = '!@#$%^&*()_+{}|:"<>?[]\\;\',./~`';
      
      await page.fill('textarea[placeholder*="codificar"]', specialChars);
      
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
      
      // Switch to decode and verify round-trip
      const encodedValue = await page.locator('textarea').nth(1).inputValue();
      
      await page.click('button:has-text("Decodificar")');
      await page.fill('textarea[placeholder*="decodificar"]', encodedValue);
      
      const decodedValue = await page.locator('textarea').nth(1).inputValue();
      expect(decodedValue).toBe(specialChars);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      // All main elements should be visible
      await expect(page.getByRole('heading', { name: 'Base64 Encoder/Decoder' })).toBeVisible();
      await expect(page.locator('textarea').first()).toBeVisible();
      await expect(page.locator('textarea').nth(1)).toBeVisible();
      
      // Should be able to encode text
      await page.fill('textarea[placeholder*="codificar"]', 'Mobile test');
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await expect(page.getByRole('heading', { name: 'Base64 Encoder/Decoder' })).toBeVisible();
      
      // Should maintain functionality
      await page.fill('textarea[placeholder*="codificar"]', 'Tablet test');
      await expect(page.getByText('✅ Texto codificado exitosamente')).toBeVisible();
    });
  });
});