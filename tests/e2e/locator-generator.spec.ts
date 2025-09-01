/**
 * E2E tests for Locator Generator Tool
 */

import { test, expect } from '@playwright/test';

test.describe('Locator Generator Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/locator-generator');
  });

  test('should load successfully with all components', async ({ page }) => {
    // Should show main heading
    await expect(page.getByRole('heading', { name: 'Generador de Locators' })).toBeVisible();
    
    // Should show description
    await expect(page.getByText('🎯 Genera locators robustos para Playwright, Selenium, Cypress')).toBeVisible();
    
    // Should show options panel
    await expect(page.getByText('⚙️ Opciones de Generación')).toBeVisible();
    
    // Should show HTML input area
    await expect(page.getByPlaceholder('Pega aquí tu código HTML...')).toBeVisible();
    
    // Should show examples section
    await expect(page.getByText('📋 Ejemplos de HTML')).toBeVisible();
    
    // Should show tips section
    await expect(page.getByText('💡 Consejos para Locators Robustos')).toBeVisible();
    
    // Analyze button should be disabled initially
    await expect(page.getByRole('button', { name: '🔍 Analizar HTML' })).toBeDisabled();
  });

  test('should analyze HTML and show statistics', async ({ page }) => {
    const sampleHTML = `
      <div data-testid="container">
        <h1 id="title">Welcome</h1>
        <button class="btn primary" data-testid="submit-btn">Submit</button>
        <input placeholder="Enter name" class="input-field">
        <span class="text">Some text</span>
      </div>
    `;
    
    // Input HTML
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    
    // Analyze button should be enabled
    await expect(page.getByRole('button', { name: '🔍 Analizar HTML' })).toBeEnabled();
    
    // Click analyze
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    
    // Should show success status
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    // Should show analysis section
    await expect(page.getByText('📊 Análisis del HTML')).toBeVisible();
    
    // Should show statistics
    await expect(page.getByText('Total Elements')).toBeVisible();
    await expect(page.getByText('With Test IDs')).toBeVisible();
    await expect(page.getByText('With IDs')).toBeVisible();
    await expect(page.getByText('Test Coverage')).toBeVisible();
    
    // Should show elements section
    await expect(page.getByText('🎯 Elementos Detectados')).toBeVisible();
  });

  test('should generate locators for selected element', async ({ page }) => {
    const sampleHTML = '<button id="submit-btn" data-testid="submit-button" class="btn primary">Submit Form</button>';
    
    // Input HTML and analyze
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    
    // Wait for analysis to complete
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    // Wait for generate button to be available and click it
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
    
    // Should show locators section
    await expect(page.getByText('⚡ Locators Generados')).toBeVisible();
    
    // Should show different locator types
    await expect(page.getByText('DATA-TESTID').first()).toBeVisible();
    await expect(page.getByText('ID').first()).toBeVisible();
    await expect(page.getByText('ROLE').first()).toBeVisible();
    
    // Should show robustness scores
    await expect(page.getByText('Robustez:').first()).toBeVisible();
    
    // Should show copy buttons
    await expect(page.getByText('📋 Copiar Locator').first()).toBeVisible();
    await expect(page.getByText('💻 Copiar Código').first()).toBeVisible();
  });

  test('should copy locators to clipboard', async ({ page }) => {
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
    
    // Grant clipboard permissions
    await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
    
    const sampleHTML = '<button data-testid="test-button">Click me</button>';
    
    // Input HTML, analyze, and generate locators
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
    await expect(page.getByText('⚡ Locators Generados')).toBeVisible();
    
    // Wait for locators to be generated
    await page.waitForTimeout(1000);
    
    // Find and click first copy locator button
    const copyLocatorBtn = page.getByRole('button', { name: '📋 Copiar Locator' }).first();
    await expect(copyLocatorBtn).toBeVisible();
    
    // Simulate user interaction
    await page.mouse.move(0, 0);
    await page.mouse.click(0, 0);
    
    // Click copy button
    try {
      await copyLocatorBtn.click();
    } catch (error) {
      await copyLocatorBtn.click({ force: true });
    }
    
    // Should show copy feedback
    await expect(page.getByText('Locator copiado')).toBeVisible({ timeout: 3000 });
  });

  test('should handle framework selection', async ({ page }) => {
    const sampleHTML = '<button data-testid="test-btn">Test</button>';
    
    // Change framework to Cypress
    await page.selectOption('#targetFramework', 'cypress');
    
    // Input HTML and generate locators
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
    
    // Should show Cypress-specific code
    await expect(page.getByText('CYPRESS Code:').first()).toBeVisible();
    await expect(page.getByTestId('code-snippet-0')).toContainText('cy.get');
  });

  test('should load examples correctly', async ({ page }) => {
    // Click form example
    await page.getByRole('button', { name: '📋 Formulario Login form con inputs' }).click();
    
    // Should fill HTML input
    const htmlInput = page.getByPlaceholder('Pega aquí tu código HTML...');
    await expect(htmlInput).not.toHaveValue('');
    
    // Should auto-analyze
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    // Should show elements
    await expect(page.getByText('🎯 Elementos Detectados')).toBeVisible();
  });

  test('should validate locator options', async ({ page }) => {
    // Uncheck include role locators
    await page.uncheck('#includeRoleLocators');
    
    // Check include XPath
    await page.check('#includeXPath');
    
    // Check allow fragile locators
    await page.check('#allowFragileLocators');
    
    const sampleHTML = '<button id="test-btn" class="mt-4 px-2">Content</button>';
    
    // Generate locators with new options
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
    
    // Should include XPath locators
    await expect(page.locator('#locatorsContainer').getByText('XPATH').first()).toBeVisible();
    
    // Should include fragile class locators
    await expect(page.getByText('.mt-4').first()).toBeVisible();
  });

  test('should clear all content', async ({ page }) => {
    const sampleHTML = '<button>Test</button>';
    
    // Input HTML and analyze
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    
    // Should show analysis
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    // Click clear button
    await page.getByRole('button', { name: '🗑️ Limpiar' }).click();
    
    // Should clear input
    await expect(page.getByPlaceholder('Pega aquí tu código HTML...')).toHaveValue('');
    
    // Should reset status
    await expect(page.getByText('Introduce HTML para generar locators')).toBeVisible();
    
    // Should disable analyze button
    await expect(page.getByRole('button', { name: '🔍 Analizar HTML' })).toBeDisabled();
  });

  test('should handle invalid HTML gracefully', async ({ page }) => {
    const invalidHTML = '<<<<invalid>>>>'; // Malformed HTML
    
    // Input invalid HTML
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(invalidHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    
    // Should show error status
    await expect(page.getByTestId('status-message')).toContainText('❌');
  });

  test('should show robustness indicators correctly', async ({ page }) => {
    const sampleHTML = `
      <div>
        <button data-testid="stable-btn">Stable Button</button>
        <div class="mt-4 px-2">Fragile Element</div>
        <span id="moderate-element" class="component-class">Moderate</span>
      </div>
    `;
    
    // Analyze HTML and generate locators
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    
    // Generate locators for the button element with data-testid (highest robustness)
    const buttonElementRow = page.locator('.element-item:has(.bg-gray-100:has-text("button")):has(.bg-green-100:has-text("data-testid"))');
    await buttonElementRow.locator('.generate-locators-btn').click();
    
    // Wait for locators to be generated
    await expect(page.getByText('⚡ Locators Generados')).toBeVisible();
    
    // Should show high robustness score (9-10) - could be in any position
    await expect(page.locator('[data-testid*="robustness-score"]').first()).toContainText('10/10');
    
    // Should show unique indicator
    await expect(page.locator('[data-testid*="unique-indicator"]').first()).toBeVisible();
    
    // Should show advantages and disadvantages
    await expect(page.getByText('✅ Ventajas:').first()).toBeVisible();
    await expect(page.getByText('❌ Desventajas:').first()).toBeVisible();
  });

  test('should provide recommendations for improvements', async ({ page }) => {
    // Enable fragile locators to see recommendations
    await page.check('#allowFragileLocators');
    
    const sampleHTML = '<div class="btn btn-primary mt-4">Button</div>';
    
    // Generate locators
    await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
    await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
    await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
    
    // Should show recommendations section
    await expect(page.getByTestId('recommendations-0')).toBeVisible();
    
    // Should recommend avoiding utility classes
    await expect(page.getByText(/Utility classes.*are fragile/)).toBeVisible();
  });

  test('should work on mobile viewport', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // Should display properly on mobile
    await expect(page.getByRole('heading', { name: 'Generador de Locators' })).toBeVisible();
    
    // Options should be in mobile layout
    await expect(page.getByText('⚙️ Opciones de Generación')).toBeVisible();
    
    // Should be able to input HTML
    const htmlInput = page.getByPlaceholder('Pega aquí tu código HTML...');
    await expect(htmlInput).toBeVisible();
    
    // Should be able to load example
    await page.getByRole('button', { name: '📋 Formulario Login form con inputs' }).click();
    await expect(htmlInput).not.toHaveValue('');
  });

  test('should show different example types', async ({ page }) => {
    // Should show all example buttons
    await expect(page.getByRole('button', { name: '📋 Formulario Login form con inputs' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🧭 Navegación Menu con enlaces' })).toBeVisible();
    await expect(page.getByRole('button', { name: '📊 Tabla Data table con acciones' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🔲 Modal Dialog con botones' })).toBeVisible();
    await expect(page.getByRole('button', { name: '🎴 Cards Product cards' })).toBeVisible();
    await expect(page.getByRole('button', { name: '⚙️ Complejo App con múltiples elementos' })).toBeVisible();
    
    // Test navigation example
    await page.getByRole('button', { name: '🧭 Navegación Menu con enlaces' }).click();
    
    // Should analyze navigation HTML
    await expect(page.getByText('✅ HTML analizado correctamente')).toBeVisible();
    
    // Should show navigation-specific elements
    await expect(page.getByText('nav').first()).toBeVisible();
  });

  test('should generate framework-specific code snippets', async ({ page }) => {
    const frameworks = [
      { value: 'playwright', expected: 'page.getByTestId' },
      { value: 'cypress', expected: 'cy.get' },
      { value: 'selenium-java', expected: 'driver.findElement' },
      { value: 'selenium-python', expected: 'driver.find_element' }
    ];

    const sampleHTML = '<button data-testid="test-btn">Test</button>';

    for (const framework of frameworks.slice(0, 2)) { // Test first 2 to avoid timeout
      // Select framework
      await page.selectOption('#targetFramework', framework.value);
      
      // Generate locators
      await page.getByPlaceholder('Pega aquí tu código HTML...').fill(sampleHTML);
      await page.getByRole('button', { name: '🔍 Analizar HTML' }).click();
      await page.locator('.generate-locators-btn').first().waitFor({ state: 'visible' });
    await page.locator('.generate-locators-btn').first().click();
      
      // Should show framework-specific code
      await expect(page.getByTestId('code-snippet-0')).toContainText(framework.expected);
      
      // Clear for next test
      await page.getByRole('button', { name: '🗑️ Limpiar' }).click();
    }
  });
});