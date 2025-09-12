import { test, expect } from '@playwright/test';

test.describe('Color Palette Generator E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/color-palette');
    // Wait for the tool to load - target the specific main content h1, not the header h1
    await expect(page.locator('main h1')).toContainText('Generador de Paleta de Colores');
  });

  test.describe('Page Loading and Layout', () => {
    test('should load the color palette generator page correctly', async ({ page }) => {
      // Check main title - target the specific main content h1
      await expect(page.locator('main h1')).toContainText('Generador de Paleta de Colores');
      
      // Check description
      await expect(page.locator('p').first()).toContainText('Crea paletas de colores armoniosas');
      
      // Check main UI sections are present - use more specific selectors
      await expect(page.locator('h2').filter({ hasText: 'Color Base' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Esquema de Armonía' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Paleta de Colores' }).first()).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Vista Previa en UI' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Verificación de Accesibilidad' })).toBeVisible();
      await expect(page.locator('h2').filter({ hasText: 'Exportar Paleta' })).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
      
      // Check that the page is still functional on mobile
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('#color-picker')).toBeVisible();
      await expect(page.locator('#generate-btn')).toBeVisible();
      
      // Check that grid layouts adapt
      const toolsGrid = page.locator('#palette-container');
      await expect(toolsGrid).toBeVisible();
    });

    test('should have proper SEO meta tags', async ({ page }) => {
      // Check title
      await expect(page).toHaveTitle(/Generador de Paleta de Colores/);
      
      // Check meta description
      const metaDescription = page.locator('meta[name="description"]');
      await expect(metaDescription).toHaveAttribute('content', /paletas de colores armoniosas/);
      
      // Check Open Graph tags
      const ogTitle = page.locator('meta[property="og:title"]');
      await expect(ogTitle).toHaveAttribute('content', /Generador de Paleta de Colores/);
    });
  });

  test.describe('Color Input Functionality', () => {
    test('should allow color input via picker', async ({ page }) => {
      const colorPicker = page.locator('#color-picker');
      
      // Change color via picker
      await colorPicker.fill('#ff0000');
      
      // Verify color display updated
      const colorDisplay = page.locator('#current-color-display');
      const backgroundColor = await colorDisplay.evaluate(el => 
        window.getComputedStyle(el).backgroundColor
      );
      expect(backgroundColor).toBe('rgb(255, 0, 0)');
      
      // Verify HEX input updated
      const hexDisplay = page.locator('#analysis-hex');
      await expect(hexDisplay).toContainText('#ff0000');
    });

    test('should switch input modes correctly', async ({ page }) => {
      // Initially picker mode should be active
      const pickerInput = page.locator('#picker-input');
      const hexInput = page.locator('#hex-input');
      
      await expect(pickerInput).toBeVisible();
      await expect(hexInput).toBeHidden();
      
      // Switch to HEX mode
      await page.click('[data-mode="hex"]');
      await expect(hexInput).toBeVisible();
      await expect(pickerInput).toBeHidden();
      
      // Switch to RGB mode
      await page.click('[data-mode="rgb"]');
      const rgbInput = page.locator('#rgb-input');
      await expect(rgbInput).toBeVisible();
      
      // Switch to HSL mode
      await page.click('[data-mode="hsl"]');
      const hslInput = page.locator('#hsl-input');
      await expect(hslInput).toBeVisible();
    });

    test('should handle HEX input correctly', async ({ page }) => {
      // Switch to HEX mode
      await page.click('[data-mode="hex"]');
      
      // Input a HEX color
      const hexField = page.locator('#hex-field');
      await hexField.fill('#00ff00');
      await hexField.blur(); // Trigger input event
      
      // Verify color picker updated
      const colorPicker = page.locator('#color-picker');
      await expect(colorPicker).toHaveValue('#00ff00');
      
      // Verify analysis updated
      const rgbDisplay = page.locator('#analysis-rgb');
      await expect(rgbDisplay).toContainText('0, 255, 0');
    });

    test('should handle RGB input correctly', async ({ page }) => {
      // Switch to RGB mode
      await page.click('[data-mode="rgb"]');
      
      // Input RGB values
      await page.fill('#rgb-r', '0');
      await page.fill('#rgb-g', '0');
      await page.fill('#rgb-b', '255');
      
      // Trigger input event
      await page.locator('#rgb-b').blur();
      
      // Verify color picker updated
      const colorPicker = page.locator('#color-picker');
      await expect(colorPicker).toHaveValue('#0000ff');
      
      // Verify HEX display updated
      const hexDisplay = page.locator('#analysis-hex');
      await expect(hexDisplay).toContainText('#0000ff');
    });

    test('should handle HSL input correctly', async ({ page }) => {
      // Switch to HSL mode
      await page.click('[data-mode="hsl"]');
      
      // Input HSL values for yellow (60°, 100%, 50%)
      await page.fill('#hsl-h', '60');
      await page.fill('#hsl-s', '100');
      await page.fill('#hsl-l', '50');
      
      // Trigger input event
      await page.locator('#hsl-l').blur();
      
      // Verify color picker updated (should be yellow)
      const colorPicker = page.locator('#color-picker');
      const value = await colorPicker.inputValue();
      expect(value.toLowerCase()).toBe('#ffff00');
    });
  });

  test.describe('Harmony Selection and Palette Generation', () => {
    test('should generate complementary palette', async ({ page }) => {
      // Set base color
      await page.locator('#color-picker').fill('#3b82f6');
      
      // Select complementary harmony
      await page.selectOption('#harmony-select', 'complementary');
      
      // Wait for palette generation
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Verify palette has 2 colors (base + complementary)
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors).toHaveCount(2);
    });

    test('should generate triadic palette', async ({ page }) => {
      await page.selectOption('#harmony-select', 'triadic');
      await page.click('[data-testid="generate-palette-btn"]');
      
      // Wait for generation
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Verify palette has 3 colors
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors).toHaveCount(3);
    });

    test('should generate analogous palette', async ({ page }) => {
      await page.selectOption('#harmony-select', 'analogous');
      await page.click('[data-testid="generate-palette-btn"]');
      
      // Wait for generation
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Verify palette has 5 colors
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors).toHaveCount(5);
    });

    test('should generate monochromatic palette', async ({ page }) => {
      await page.selectOption('#harmony-select', 'monochromatic');
      await page.click('[data-testid="generate-palette-btn"]');
      
      // Wait for generation
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Verify palette has 5 colors
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors).toHaveCount(5);
    });

    test('should generate random palette', async ({ page }) => {
      // Get initial color
      const initialColor = await page.locator('#color-picker').inputValue();
      
      // Click random button
      await page.click('[data-testid="random-color-btn"]');
      
      // Verify color changed
      const newColor = await page.locator('#color-picker').inputValue();
      expect(newColor).not.toBe(initialColor);
      
      // Verify palette regenerated
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });
  });

  test.describe('Color Blindness Simulation', () => {
    test('should simulate color blindness correctly', async ({ page }) => {
      // Generate initial palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Get initial palette colors
      const initialColors = await page.locator('#palette-container .aspect-square').evaluateAll(
        elements => elements.map(el => window.getComputedStyle(el).backgroundColor)
      );
      
      // Switch to protanopia simulation
      await page.selectOption('#colorblindness-select', 'protanopia');
      
      // Get simulated colors
      const simulatedColors = await page.locator('#palette-container .aspect-square').evaluateAll(
        elements => elements.map(el => window.getComputedStyle(el).backgroundColor)
      );
      
      // Colors should be different (simulated)
      expect(simulatedColors).not.toEqual(initialColors);
      
      // Switch back to normal vision
      await page.selectOption('#colorblindness-select', 'normal');
      
      // Colors should match initial colors again
      const normalColors = await page.locator('#palette-container .aspect-square').evaluateAll(
        elements => elements.map(el => window.getComputedStyle(el).backgroundColor)
      );
      expect(normalColors).toEqual(initialColors);
    });
  });

  test.describe('Accessibility Information', () => {
    test('should display contrast ratios and WCAG compliance', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Check accessibility container has content
      const accessibilityContainer = page.locator('#accessibility-container');
      await expect(accessibilityContainer).toContainText('Sobre fondo blanco');
      await expect(accessibilityContainer).toContainText('Sobre fondo negro');
      await expect(accessibilityContainer).toContainText('Contraste:');
      
      // Should show contrast ratios
      const contrastInfo = accessibilityContainer.locator('text=/\\d+\\.\\d+:1/');
      await expect(contrastInfo.first()).toBeVisible();
    });
  });

  test.describe('UI Preview', () => {
    test('should show UI preview with generated colors', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Check UI preview elements exist
      const previewContainer = page.locator('#preview-container');
      await expect(previewContainer).toContainText('Ejemplo de Tarjeta');
      await expect(previewContainer).toContainText('Botón Primario');
      await expect(previewContainer).toContainText('Botón Secundario');
      
      // Verify buttons have colors applied
      const primaryBtn = previewContainer.locator('text=Botón Primario');
      const buttonStyle = await primaryBtn.evaluate(el => window.getComputedStyle(el).backgroundColor);
      expect(buttonStyle).not.toBe('rgba(0, 0, 0, 0)'); // Should have background color
    });
  });

  test.describe('Copy Functionality', () => {
    test('should copy individual colors to clipboard', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Find and click first copy button
      const copyBtn = page.locator('.copy-color-btn').first();
      await copyBtn.click();
      
      // Verify success message
      await expect(page.locator('#status-container')).toContainText('Copiado:');
    });

    test('should copy full palette', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Click copy palette button
      const copyPaletteBtn = page.locator('.copy-palette-btn');
      await copyPaletteBtn.click();
      
      // Verify success message
      await expect(page.locator('#status-container')).toContainText('Copiado:');
    });
  });

  test.describe('Export Functionality', () => {
    test('should export palette in different formats', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Test CSS Variables export
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-format="css-variables"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('.css');
      
      // Verify success message
      await expect(page.locator('#status-container')).toContainText('exportada como CSS-VARIABLES');
    });

    test('should export JSON format', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-format="json"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('.json');
      await expect(page.locator('#status-container')).toContainText('exportada como JSON');
    });

    test('should export SCSS format', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-format="scss"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('.scss');
      await expect(page.locator('#status-container')).toContainText('exportada como SCSS');
    });

    test('should export Tailwind format', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-format="tailwind"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toBe('tailwind-colors.js');
      await expect(page.locator('#status-container')).toContainText('exportada como TAILWIND');
    });

    test('should export SVG format', async ({ page }) => {
      // Generate palette
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      const downloadPromise = page.waitForEvent('download');
      await page.click('[data-format="svg"]');
      const download = await downloadPromise;
      
      expect(download.suggestedFilename()).toContain('.svg');
      await expect(page.locator('#status-container')).toContainText('exportada como SVG');
    });
  });

  test.describe('Example Palettes', () => {
    test('should load sunset example palette', async ({ page }) => {
      await page.click('[data-example="sunset"]');
      
      // Verify color changed to sunset theme
      const colorPicker = await page.locator('#color-picker').inputValue();
      expect(colorPicker).toBe('#ff6b35');
      
      // Verify harmony set to analogous
      const harmonySelect = page.locator('#harmony-select');
      await expect(harmonySelect).toHaveValue('analogous');
      
      // Verify palette generated
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });

    test('should load ocean example palette', async ({ page }) => {
      await page.click('[data-example="ocean"]');
      
      const colorPicker = await page.locator('#color-picker').inputValue();
      expect(colorPicker).toBe('#0077be');
      
      await expect(page.locator('#harmony-select')).toHaveValue('analogous');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });

    test('should load forest example palette', async ({ page }) => {
      await page.click('[data-example="forest"]');
      
      const colorPicker = await page.locator('#color-picker').inputValue();
      expect(colorPicker).toBe('#2d5016');
      
      await expect(page.locator('#harmony-select')).toHaveValue('analogous');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });
  });

  test.describe('Error Handling', () => {
    test('should handle invalid HEX input gracefully', async ({ page }) => {
      // Switch to HEX mode
      await page.click('[data-mode="hex"]');
      
      // Input invalid HEX
      const hexField = page.locator('#hex-field');
      await hexField.fill('invalid-hex');
      await hexField.blur();
      
      // Should not crash - verify page is still functional
      const generateBtn = page.locator('[data-testid="generate-palette-btn"]');
      await expect(generateBtn).toBeVisible();
      await generateBtn.click();
      
      // Should still be able to generate palette
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });

    test('should handle out-of-range RGB values', async ({ page }) => {
      // Switch to RGB mode
      await page.click('[data-mode="rgb"]');
      
      // Input out-of-range values
      await page.fill('#rgb-r', '999');
      await page.fill('#rgb-g', '-50');
      await page.fill('#rgb-b', '300');
      
      // Should clamp values or handle gracefully
      await page.locator('#rgb-b').blur();
      
      // Page should still be functional
      await page.click('[data-testid="generate-palette-btn"]');
      await expect(page.locator('#status-container')).toContainText('exitosamente');
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await page.goto('/tools/color-palette');
      await expect(page.locator('main h1')).toBeVisible();
      const endTime = Date.now();
      
      const loadTime = endTime - startTime;
      expect(loadTime).toBeLessThan(3000); // Should load within 3 seconds
    });

    test('should handle rapid interactions without breaking', async ({ page }) => {
      // Rapidly change colors and harmonies
      for (let i = 0; i < 5; i++) {
        await page.locator('#color-picker').fill(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`);
        await page.selectOption('#harmony-select', ['complementary', 'triadic', 'analogous'][i % 3]);
        await page.click('[data-testid="random-color-btn"]');
      }
      
      // Should still be functional
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      // Should have colors in palette
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors.first()).toBeVisible();
    });
  });

  test.describe('Keyboard Navigation and Accessibility', () => {
    test('should be navigable with keyboard', async ({ page }) => {
      // Test that we can directly focus key elements
      const colorPicker = page.locator('#color-picker');
      await colorPicker.focus();
      await expect(colorPicker).toBeFocused();
      
      // Test that we can focus the harmony select
      const harmonySelect = page.locator('#harmony-select');
      await harmonySelect.focus();
      await expect(harmonySelect).toBeFocused();
      
      // Should be able to reach generate button
      const generateBtn = page.locator('[data-testid="generate-palette-btn"]');
      await generateBtn.focus();
      await expect(generateBtn).toBeFocused();
    });

    test('should have proper ARIA labels and semantic HTML', async ({ page }) => {
      // Check for semantic headings
      const h1 = page.locator('main h1');
      await expect(h1).toHaveText(/Generador de Paleta de Colores/);
      
      const h2Elements = page.locator('h2');
      await expect(h2Elements.first()).toBeVisible();
      
      // Check for proper form labels
      const colorPickerLabel = page.locator('label:has-text("Selector de color")');
      await expect(colorPickerLabel).toBeVisible();
      
      // Check buttons have proper text or aria-labels
      const generateBtn = page.locator('[data-testid="generate-palette-btn"]');
      await expect(generateBtn).toHaveText(/Generar Paleta/);
      
      const randomBtn = page.locator('[data-testid="random-color-btn"]');
      await expect(randomBtn).toHaveText(/Aleatorio/);
    });
  });

  test.describe('Cross-browser Compatibility', () => {
    test('should work consistently across different browsers', async ({ page, browserName }) => {
      // Basic functionality test that should work in all browsers
      await page.locator('#color-picker').fill('#ff0000');
      await page.selectOption('#harmony-select', 'complementary');
      await page.click('[data-testid="generate-palette-btn"]');
      
      await expect(page.locator('#status-container')).toContainText('exitosamente');
      
      const paletteColors = page.locator('#palette-container .aspect-square');
      await expect(paletteColors).toHaveCount(2);
      
      // Log which browser this test passed on
      console.log(`✅ Color Palette Generator working on ${browserName}`);
    });
  });
});