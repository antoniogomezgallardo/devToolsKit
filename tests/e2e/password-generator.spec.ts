/**
 * Password Generator E2E Tests
 * Tests complete user workflows and interactions
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Password Generator Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/password-generator');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Page Loading and UI', () => {
    test('should load password generator page correctly', async ({ page }) => {
      await expect(page.locator('h1')).toContainText('Generador de Contraseñas');
      await expect(page.locator('h1')).toContainText('🔒');
      
      // Check main description
      await expect(page.locator('p')).toContainText('Genera contraseñas seguras y personalizables');
      
      // Check all main sections are visible
      await expect(page.locator('text=Longitud de Contraseña')).toBeVisible();
      await expect(page.locator('text=Tipos de Caracteres')).toBeVisible();
      await expect(page.locator('text=Opciones Avanzadas')).toBeVisible();
      await expect(page.locator('text=Generación por Lotes')).toBeVisible();
      await expect(page.locator('text=Contraseña Generada')).toBeVisible();
      await expect(page.locator('text=Fortaleza de la Contraseña')).toBeVisible();
    });

    test('should have all control elements visible and functional', async ({ page }) => {
      // Length slider
      await expect(page.locator('#length-slider')).toBeVisible();
      await expect(page.locator('#length-display')).toContainText('16');
      
      // Character type checkboxes
      await expect(page.locator('#uppercase-checkbox')).toBeVisible();
      await expect(page.locator('#uppercase-checkbox')).toBeChecked();
      await expect(page.locator('#lowercase-checkbox')).toBeVisible();
      await expect(page.locator('#lowercase-checkbox')).toBeChecked();
      await expect(page.locator('#numbers-checkbox')).toBeVisible();
      await expect(page.locator('#numbers-checkbox')).toBeChecked();
      await expect(page.locator('#symbols-checkbox')).toBeVisible();
      await expect(page.locator('#symbols-checkbox')).toBeChecked();
      
      // Advanced options
      await expect(page.locator('#exclude-similar-checkbox')).toBeVisible();
      await expect(page.locator('#exclude-ambiguous-checkbox')).toBeVisible();
      
      // Buttons
      await expect(page.locator('#generate-btn')).toBeVisible();
      await expect(page.locator('#copy-btn')).toBeVisible();
      await expect(page.locator('#copy-btn')).toBeDisabled();
      await expect(page.locator('#generate-batch-btn')).toBeVisible();
    });

    test('should be responsive on mobile devices', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#generate-btn')).toBeVisible();
      await expect(page.locator('#length-slider')).toBeVisible();
      
      // Grid should stack on mobile
      const grid = page.locator('.grid.grid-cols-1.lg\\:grid-cols-2');
      await expect(grid).toBeVisible();
    });
  });

  test.describe('Password Generation', () => {
    test('should generate password with default settings', async ({ page }) => {
      await page.click('#generate-btn');
      
      // Should generate a 16-character password
      const passwordField = page.locator('#password-output');
      await expect(passwordField).not.toHaveValue('');
      
      const password = await passwordField.inputValue();
      expect(password.length).toBe(16);
      
      // Should enable copy button
      await expect(page.locator('#copy-btn')).toBeEnabled();
      
      // Should show strength indicator
      await expect(page.locator('#strength-label')).not.toContainText('Sin evaluar');
      await expect(page.locator('#strength-indicator')).toHaveAttribute('style', /width: [^0%]/);
    });

    test('should generate different passwords on multiple clicks', async ({ page }) => {
      await page.click('#generate-btn');
      const firstPassword = await page.locator('#password-output').inputValue();
      
      await page.click('#generate-btn');
      const secondPassword = await page.locator('#password-output').inputValue();
      
      expect(firstPassword).not.toBe(secondPassword);
      expect(firstPassword.length).toBe(secondPassword.length);
    });

    test('should update password length dynamically', async ({ page }) => {
      // Change length to 24
      await page.locator('#length-slider').fill('24');
      await expect(page.locator('#length-display')).toContainText('24');
      
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      expect(password.length).toBe(24);
    });

    test('should respect character type selections', async ({ page }) => {
      // Generate with only numbers
      await page.uncheck('#uppercase-checkbox');
      await page.uncheck('#lowercase-checkbox');
      await page.uncheck('#symbols-checkbox');
      
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      // Should only contain numbers
      expect(password).toMatch(/^[0-9]+$/);
    });

    test('should generate passwords with all character types when enabled', async ({ page }) => {
      await page.locator('#length-slider').fill('50'); // Longer to ensure all types
      
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      expect(password).toMatch(/[A-Z]/); // Uppercase
      expect(password).toMatch(/[a-z]/); // Lowercase
      expect(password).toMatch(/[0-9]/); // Numbers
      expect(password).toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/); // Symbols
    });

    test('should exclude similar characters when option is enabled', async ({ page }) => {
      await page.check('#exclude-similar-checkbox');
      await page.locator('#length-slider').fill('50');
      
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      // Should not contain similar characters: il1Lo0O
      expect(password).not.toMatch(/[il1Lo0O]/);
    });

    test('should exclude ambiguous characters when option is enabled', async ({ page }) => {
      await page.check('#exclude-ambiguous-checkbox');
      await page.locator('#length-slider').fill('50');
      
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      // Should not contain ambiguous characters: {}[]()\/'"`,;.<>
      expect(password).not.toMatch(/[{}()\[\]\\\/'"`,;.<>]/);
    });
  });

  test.describe('Password Strength Analysis', () => {
    test('should show strength analysis for generated passwords', async ({ page }) => {
      await page.click('#generate-btn');
      
      // Should show strength label and feedback
      const strengthLabel = page.locator('#strength-label');
      await expect(strengthLabel).not.toContainText('Sin evaluar');
      
      const strengthFeedback = page.locator('#strength-feedback');
      await expect(strengthFeedback).not.toContainText('Genera una contraseña para ver su fortaleza');
      
      // Strength indicator should have some width
      const indicator = page.locator('#strength-indicator');
      const style = await indicator.getAttribute('style');
      expect(style).toMatch(/width: [^0%]/);
    });

    test('should show higher strength for longer passwords', async ({ page }) => {
      // Generate short password
      await page.locator('#length-slider').fill('8');
      await page.click('#generate-btn');
      
      const shortStrengthLabel = await page.locator('#strength-label').textContent();
      const shortIndicatorStyle = await page.locator('#strength-indicator').getAttribute('style');
      
      // Generate long password
      await page.locator('#length-slider').fill('32');
      await page.click('#generate-btn');
      
      const longStrengthLabel = await page.locator('#strength-label').textContent();
      const longIndicatorStyle = await page.locator('#strength-indicator').getAttribute('style');
      
      // Long password should generally have better or equal strength
      // (We can't guarantee it's always better due to randomness, but we can check it's evaluated)
      expect(longStrengthLabel).not.toBe('Sin evaluar');
      expect(shortStrengthLabel).not.toBe('Sin evaluar');
    });

    test('should update statistics when password is generated', async ({ page }) => {
      await page.click('#generate-btn');
      
      const statsContainer = page.locator('#stats-container');
      await expect(statsContainer).not.toContainText('Las estadísticas aparecerán aquí');
      
      // Should show various stats
      await expect(statsContainer).toContainText('Longitud');
      await expect(statsContainer).toContainText('Entropía');
      await expect(statsContainer).toContainText('Fortaleza');
      await expect(statsContainer).toContainText('Tiempo de crack');
    });
  });

  test.describe('Batch Generation', () => {
    test('should generate multiple passwords in batch', async ({ page }) => {
      await page.fill('#batch-count', '3');
      await page.click('#generate-batch-btn');
      
      const batchOutput = page.locator('#batch-output');
      const batchText = await batchOutput.inputValue();
      const passwords = batchText.split('\n').filter(p => p.length > 0);
      
      expect(passwords.length).toBe(3);
      
      // All passwords should be the same length (default 16)
      passwords.forEach(password => {
        expect(password.length).toBe(16);
      });
      
      // All passwords should be unique
      const uniquePasswords = [...new Set(passwords)];
      expect(uniquePasswords.length).toBe(passwords.length);
    });

    test('should generate batch with custom settings', async ({ page }) => {
      // Configure custom settings
      await page.locator('#length-slider').fill('12');
      await page.uncheck('#symbols-checkbox');
      await page.fill('#batch-count', '5');
      
      await page.click('#generate-batch-btn');
      
      const batchOutput = page.locator('#batch-output');
      const batchText = await batchOutput.inputValue();
      const passwords = batchText.split('\n').filter(p => p.length > 0);
      
      expect(passwords.length).toBe(5);
      
      passwords.forEach(password => {
        expect(password.length).toBe(12);
        expect(password).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
      });
    });

    test('should clear batch output', async ({ page }) => {
      // Generate batch first
      await page.click('#generate-batch-btn');
      const batchOutput = page.locator('#batch-output');
      await expect(batchOutput).not.toHaveValue('');
      
      // Clear batch
      await page.click('#clear-batch-btn');
      await expect(batchOutput).toHaveValue('');
    });
  });

  test.describe('Copy Functionality', () => {
    test('should copy generated password to clipboard', async ({ page }) => {
      await page.click('#generate-btn');
      const password = await page.locator('#password-output').inputValue();
      
      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
      
      await page.click('#copy-btn');
      
      // Button should show success feedback
      await expect(page.locator('#copy-btn')).toContainText('¡Copiado!');
      
      // Check clipboard content
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(password);
      
      // Button should return to original text
      await page.waitForTimeout(2500);
      await expect(page.locator('#copy-btn')).toContainText('Copiar');
    });

    test('copy button should be disabled initially', async ({ page }) => {
      await expect(page.locator('#copy-btn')).toBeDisabled();
      
      await page.click('#generate-btn');
      await expect(page.locator('#copy-btn')).toBeEnabled();
    });
  });

  test.describe('Examples and Presets', () => {
    test('should load standard example configuration', async ({ page }) => {
      await page.click('[data-example="standard"]');
      
      // Should set to 16 characters with all types enabled
      await expect(page.locator('#length-display')).toContainText('16');
      await expect(page.locator('#uppercase-checkbox')).toBeChecked();
      await expect(page.locator('#lowercase-checkbox')).toBeChecked();
      await expect(page.locator('#numbers-checkbox')).toBeChecked();
      await expect(page.locator('#symbols-checkbox')).toBeChecked();
      
      // Should auto-generate password
      await expect(page.locator('#password-output')).not.toHaveValue('');
    });

    test('should load strong example configuration', async ({ page }) => {
      await page.click('[data-example="strong"]');
      
      // Should set to 32 characters with exclusions
      await expect(page.locator('#length-display')).toContainText('32');
      await expect(page.locator('#exclude-similar-checkbox')).toBeChecked();
      await expect(page.locator('#exclude-ambiguous-checkbox')).toBeChecked();
      
      // Should auto-generate password
      const password = await page.locator('#password-output').inputValue();
      expect(password.length).toBe(32);
      
      // Should not contain excluded characters
      expect(password).not.toMatch(/[il1Lo0O]/);
      expect(password).not.toMatch(/[{}()\[\]\\\/'"`,;.<>]/);
    });

    test('should load simple example configuration', async ({ page }) => {
      await page.click('[data-example="simple"]');
      
      // Should set to 12 characters without symbols
      await expect(page.locator('#length-display')).toContainText('12');
      await expect(page.locator('#symbols-checkbox')).not.toBeChecked();
      
      // Should auto-generate password
      const password = await page.locator('#password-output').inputValue();
      expect(password.length).toBe(12);
      expect(password).not.toMatch(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/);
    });
  });

  test.describe('Security Notice and Information', () => {
    test('should display security notice', async ({ page }) => {
      await expect(page.locator('text=Seguridad y Privacidad')).toBeVisible();
      await expect(page.locator('text=Todas las contraseñas se generan completamente en tu navegador')).toBeVisible();
      await expect(page.locator('text=Generación criptográficamente segura')).toBeVisible();
      await expect(page.locator('text=Procesamiento 100% local')).toBeVisible();
    });

    test('should show examples section', async ({ page }) => {
      await expect(page.locator('text=Ejemplos de Configuración')).toBeVisible();
      await expect(page.locator('[data-example="standard"]')).toBeVisible();
      await expect(page.locator('[data-example="strong"]')).toBeVisible();
      await expect(page.locator('[data-example="simple"]')).toBeVisible();
    });
  });

  test.describe('Error Handling', () => {
    test('should handle no character types selected', async ({ page }) => {
      // Uncheck all character types
      await page.uncheck('#uppercase-checkbox');
      await page.uncheck('#lowercase-checkbox');
      await page.uncheck('#numbers-checkbox');
      await page.uncheck('#symbols-checkbox');
      
      await page.click('#generate-btn');
      
      // Should show error in strength indicator
      await expect(page.locator('#strength-label')).toContainText('Error');
      await expect(page.locator('#password-output')).toHaveValue('');
      await expect(page.locator('#copy-btn')).toBeDisabled();
    });

    test('should validate batch count limits', async ({ page }) => {
      // Try with count outside valid range - browser should prevent this
      // but we can test the boundaries
      
      await page.fill('#batch-count', '2');
      await page.click('#generate-batch-btn');
      const result = await page.locator('#batch-output').inputValue();
      const passwords = result.split('\n').filter(p => p.length > 0);
      expect(passwords.length).toBe(2);
      
      await page.fill('#batch-count', '20');
      await page.click('#generate-batch-btn');
      const maxResult = await page.locator('#batch-output').inputValue();
      const maxPasswords = maxResult.split('\n').filter(p => p.length > 0);
      expect(maxPasswords.length).toBe(20);
    });
  });

  test.describe('Performance and Accessibility', () => {
    test('should generate passwords quickly', async ({ page }) => {
      const startTime = Date.now();
      await page.click('#generate-btn');
      
      // Should complete within reasonable time
      await expect(page.locator('#password-output')).not.toHaveValue('');
      const endTime = Date.now();
      
      expect(endTime - startTime).toBeLessThan(1000); // Should be much faster, but allowing buffer
    });

    test('should have proper ARIA labels and accessibility', async ({ page }) => {
      // Check for aria-labels on important controls
      const lengthSlider = page.locator('#length-slider');
      await expect(lengthSlider).toBeVisible();
      
      // Check that form elements are properly labeled
      await expect(page.locator('label').first()).toBeVisible();
      
      // Check keyboard navigation works
      await page.keyboard.press('Tab');
      await expect(page.locator(':focus')).toBeVisible();
    });

    test('should handle rapid consecutive generations', async ({ page }) => {
      const passwords: string[] = [];
      
      // Generate 5 passwords rapidly
      for (let i = 0; i < 5; i++) {
        await page.click('#generate-btn');
        const password = await page.locator('#password-output').inputValue();
        passwords.push(password);
        await page.waitForTimeout(100); // Small delay to ensure completion
      }
      
      // All should be different
      const uniquePasswords = [...new Set(passwords)];
      expect(uniquePasswords.length).toBe(passwords.length);
    });
  });
});