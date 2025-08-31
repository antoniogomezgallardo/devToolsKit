import { test, expect } from '@playwright/test';

test.describe('JSON Validator Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/json-validator');
  });

  test('should validate correct JSON', async ({ page }) => {
    const validJSON = '{"name":"John","age":30}';
    
    // Input valid JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(validJSON);
    
    // Should auto-validate and show formatted output
    await expect(page.getByText('✅ JSON válido y formateado')).toBeVisible();
    
    // Output should contain formatted JSON
    const output = page.getByPlaceholder('El JSON formateado aparecerá aquí...');
    await expect(output).toHaveValue(/{\s+"name":\s+"John",\s+"age":\s+30\s+}/);
    
    // Copy button should be enabled
    await expect(page.getByRole('button', { name: 'Copiar' })).toBeEnabled();
  });

  test('should detect JSON errors', async ({ page }) => {
    const invalidJSON = '{"name":"John","age":30,}'; // Trailing comma
    
    // Input invalid JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(invalidJSON);
    
    // Should show error message
    await expect(page.getByText(/❌/)).toBeVisible();
    
    // Copy button should be disabled
    await expect(page.getByRole('button', { name: 'Copiar' })).toBeDisabled();
    
    // Output should be empty
    const output = page.getByPlaceholder('El JSON formateado aparecerá aquí...');
    await expect(output).toHaveValue('');
  });

  test('should clear input and output', async ({ page }) => {
    const validJSON = '{"test":true}';
    
    // Input some JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(validJSON);
    await expect(page.getByText('✅ JSON válido y formateado')).toBeVisible();
    
    // Click clear button
    await page.getByRole('button', { name: 'Limpiar' }).click();
    
    // Input and output should be empty
    await expect(page.getByPlaceholder('Pega aquí tu código JSON...')).toHaveValue('');
    await expect(page.getByPlaceholder('El JSON formateado aparecerá aquí...')).toHaveValue('');
    
    // Should show initial status
    await expect(page.getByText('Introduce JSON para validar')).toBeVisible();
  });

  test('should copy formatted JSON to clipboard', async ({ page }) => {
    const validJSON = '{"name":"John"}';
    
    // Input valid JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(validJSON);
    await expect(page.getByText('✅ JSON válido y formateado')).toBeVisible();
    
    // Click copy button
    await page.getByRole('button', { name: 'Copiar' }).click();
    
    // Should show success feedback
    await expect(page.getByText('¡Copiado!')).toBeVisible();
    
    // Button text should revert back
    await expect(page.getByRole('button', { name: 'Copiar' })).toBeVisible({ timeout: 3000 });
  });

  test('should load examples', async ({ page }) => {
    // Click on object example
    await page.getByRole('button', { name: /Objeto simple/ }).click();
    
    // Input should be filled with example
    const input = page.getByPlaceholder('Pega aquí tu código JSON...');
    await expect(input).not.toHaveValue('');
    
    // Should auto-validate
    await expect(page.getByText('✅ JSON válido y formateado')).toBeVisible();
    
    // Click on array example
    await page.getByRole('button', { name: /Array de objetos/ }).click();
    
    // Should load array example
    const inputValue = await input.inputValue();
    expect(inputValue).toContain('[');
    expect(inputValue).toContain(']');
  });

  test('should show JSON information', async ({ page }) => {
    const complexJSON = '{"users":[{"name":"John"},{"name":"Jane"}],"total":2}';
    
    // Input complex JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(complexJSON);
    
    // Should show JSON info
    await expect(page.getByText('Información del JSON')).toBeVisible();
    
    // Should contain object info
    await expect(page.getByText('Tipo')).toBeVisible();
    await expect(page.getByText('object')).toBeVisible();
  });

  test('should work with large JSON', async ({ page }) => {
    // Create a large JSON object
    const largeJSON = JSON.stringify({
      users: Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        active: i % 2 === 0
      }))
    });
    
    // Input large JSON
    await page.getByPlaceholder('Pega aquí tu código JSON...').fill(largeJSON);
    
    // Should handle it successfully
    await expect(page.getByText('✅ JSON válido y formateado')).toBeVisible();
    
    // Should show formatted output
    const output = page.getByPlaceholder('El JSON formateado aparecerá aquí...');
    await expect(output).not.toHaveValue('');
  });
});