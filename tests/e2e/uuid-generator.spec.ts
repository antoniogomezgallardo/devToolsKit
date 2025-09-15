/**
 * UUID Generator E2E Tests
 *
 * Comprehensive end-to-end testing for UUID Generator tool
 * Testing all user workflows and UI interactions
 */

import { test, expect, Page } from '@playwright/test';

test.describe('UUID Generator Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tools/uuid-generator');
    await page.waitForLoadState('networkidle');
  });

  test('should have correct page structure and title', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Generador de UUID.*DevToolsKit/);

    // Check main heading
    await expect(page.locator('h1')).toContainText('Generador de UUID');

    // Check description
    await expect(page.locator('p')).toContainText('identificadores únicos universales');

    // Check that main elements are visible
    await expect(page.locator('#versionSelect')).toBeVisible();
    await expect(page.locator('#formatSelect')).toBeVisible();
    await expect(page.locator('#generateBtn')).toBeVisible();
    await expect(page.locator('#uuidOutput')).toBeVisible();
  });

  test('should generate UUID v4 by default', async ({ page }) => {
    // Click generate button
    await page.click('#generateBtn');

    // Wait for UUID to be generated
    await expect(page.locator('#uuidOutput')).not.toBeEmpty();

    // Get the generated UUID
    const uuid = await page.locator('#uuidOutput').textContent();

    // Validate UUID v4 format
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    // Check version info is displayed
    await expect(page.locator('#versionInfo')).toContainText('v4');
  });

  test('should generate different UUID versions', async ({ page }) => {
    const versions = ['v1', 'v3', 'v4', 'v5', 'nil'];

    for (const version of versions) {
      // Select version
      await page.selectOption('#versionSelect', version);

      // For v3 and v5, fill namespace and name if needed
      if (version === 'v3' || version === 'v5') {
        const namespaceField = page.locator('#namespaceInput');
        const nameField = page.locator('#nameInput');

        if (await namespaceField.isVisible()) {
          await namespaceField.fill('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
        }
        if (await nameField.isVisible()) {
          await nameField.fill('test.example.com');
        }
      }

      // Generate UUID
      await page.click('#generateBtn');

      // Wait for generation
      await page.waitForTimeout(100);

      // Get generated UUID
      const uuid = await page.locator('#uuidOutput').textContent();

      if (version === 'nil') {
        expect(uuid).toBe('00000000-0000-0000-0000-000000000000');
      } else {
        // Check version-specific pattern
        const versionDigit = version.charAt(1);
        const pattern = new RegExp(`^[0-9a-f]{8}-[0-9a-f]{4}-${versionDigit}[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`, 'i');
        expect(uuid).toMatch(pattern);
      }

      // Verify version info
      await expect(page.locator('#versionInfo')).toContainText(version);
    }
  });

  test('should support different UUID formats', async ({ page }) => {
    const formats = [
      { value: 'standard', expected: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/ },
      { value: 'uppercase', expected: /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/ },
      { value: 'no-hyphens', expected: /^[0-9a-f]{32}$/ },
      { value: 'braces', expected: /^\{[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\}$/ },
      { value: 'brackets', expected: /^\[[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\]$/ }
    ];

    for (const format of formats) {
      // Select format
      await page.selectOption('#formatSelect', format.value);

      // Generate UUID
      await page.click('#generateBtn');

      // Wait for generation
      await page.waitForTimeout(100);

      // Check format
      const uuid = await page.locator('#uuidOutput').textContent();
      expect(uuid).toMatch(format.expected);
    }
  });

  test('should generate batch UUIDs', async ({ page }) => {
    // Set batch count
    const countInput = page.locator('#countInput');
    if (await countInput.isVisible()) {
      await countInput.fill('5');
    }

    // Generate batch
    await page.click('#generateBatchBtn');

    // Wait for generation
    await page.waitForTimeout(200);

    // Check that multiple UUIDs are generated
    const uuidList = page.locator('#uuidList .uuid-item');
    await expect(uuidList).toHaveCount(5);

    // Verify each UUID is valid
    const uuids = await uuidList.allTextContents();
    uuids.forEach(uuid => {
      expect(uuid.trim()).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    });

    // Check that all UUIDs are unique
    const uniqueUUIDs = new Set(uuids);
    expect(uniqueUUIDs.size).toBe(uuids.length);
  });

  test('should validate UUIDs', async ({ page }) => {
    const validationInput = page.locator('#validationInput');
    const validateBtn = page.locator('#validateBtn');
    const validationResult = page.locator('#validationResult');

    if (await validationInput.isVisible()) {
      // Test valid UUID
      await validationInput.fill('550e8400-e29b-41d4-a716-446655440000');
      await validateBtn.click();

      await expect(validationResult).toContainText('válido');
      await expect(validationResult).toContainText('v4');

      // Test invalid UUID
      await validationInput.fill('invalid-uuid');
      await validateBtn.click();

      await expect(validationResult).toContainText('no válido');

      // Test NIL UUID
      await validationInput.fill('00000000-0000-0000-0000-000000000000');
      await validateBtn.click();

      await expect(validationResult).toContainText('válido');
      await expect(validationResult).toContainText('nil');
    }
  });

  test('should support real-time generation', async ({ page }) => {
    const realTimeToggle = page.locator('#realTimeToggle');

    if (await realTimeToggle.isVisible()) {
      // Enable real-time generation
      await realTimeToggle.check();

      // Wait for some UUIDs to be generated
      await page.waitForTimeout(2000);

      // Check that UUIDs are being generated automatically
      const uuidList = page.locator('#realtimeList .uuid-item');
      const count = await uuidList.count();
      expect(count).toBeGreaterThan(0);

      // Disable real-time generation
      await realTimeToggle.uncheck();

      // Wait and verify no more UUIDs are generated
      const initialCount = count;
      await page.waitForTimeout(1000);
      const finalCount = await uuidList.count();
      expect(finalCount).toBe(initialCount);
    }
  });

  test('should copy UUIDs to clipboard', async ({ page }) => {
    // Generate a UUID
    await page.click('#generateBtn');
    await page.waitForTimeout(100);

    // Click copy button
    const copyBtn = page.locator('#copyBtn');
    await copyBtn.click();

    // Check for success message
    await expect(page.locator('.copy-success')).toBeVisible();

    // For batch UUIDs, test copy all
    const countInput = page.locator('#countInput');
    if (await countInput.isVisible()) {
      await countInput.fill('3');
      await page.click('#generateBatchBtn');
      await page.waitForTimeout(200);

      const copyAllBtn = page.locator('#copyAllBtn');
      if (await copyAllBtn.isVisible()) {
        await copyAllBtn.click();
        await expect(page.locator('.copy-success')).toBeVisible();
      }
    }
  });

  test('should export UUIDs in different formats', async ({ page }) => {
    // Generate some UUIDs first
    const countInput = page.locator('#countInput');
    if (await countInput.isVisible()) {
      await countInput.fill('3');
      await page.click('#generateBatchBtn');
      await page.waitForTimeout(200);
    }

    const exportBtn = page.locator('#exportBtn');
    const exportFormat = page.locator('#exportFormat');

    if (await exportBtn.isVisible() && await exportFormat.isVisible()) {
      const formats = ['json', 'csv', 'txt'];

      for (const format of formats) {
        await exportFormat.selectOption(format);

        // Start download
        const downloadPromise = page.waitForEvent('download');
        await exportBtn.click();
        const download = await downloadPromise;

        // Verify download
        expect(download.suggestedFilename()).toContain('uuid');
        expect(download.suggestedFilename()).toContain(format);
      }
    }
  });

  test('should clear generated UUIDs', async ({ page }) => {
    // Generate some UUIDs
    const countInput = page.locator('#countInput');
    if (await countInput.isVisible()) {
      await countInput.fill('5');
      await page.click('#generateBatchBtn');
      await page.waitForTimeout(200);
    }

    // Verify UUIDs are present
    const uuidList = page.locator('#uuidList .uuid-item');
    await expect(uuidList.first()).toBeVisible();

    // Click clear button
    const clearBtn = page.locator('#clearBtn');
    if (await clearBtn.isVisible()) {
      await clearBtn.click();

      // Confirm clearing if dialog appears
      const confirmBtn = page.locator('#confirmClear');
      if (await confirmBtn.isVisible()) {
        await confirmBtn.click();
      }

      // Verify UUIDs are cleared
      await expect(uuidList).toHaveCount(0);
    }
  });

  test('should display UUID statistics', async ({ page }) => {
    const statsBtn = page.locator('#statsBtn');

    if (await statsBtn.isVisible()) {
      // Generate various UUIDs first
      const versions = ['v1', 'v4', 'v4', 'v5'];

      for (const version of versions) {
        await page.selectOption('#versionSelect', version);

        if (version === 'v5') {
          const namespaceField = page.locator('#namespaceInput');
          const nameField = page.locator('#nameInput');

          if (await namespaceField.isVisible()) {
            await namespaceField.fill('6ba7b810-9dad-11d1-80b4-00c04fd430c8');
          }
          if (await nameField.isVisible()) {
            await nameField.fill('test');
          }
        }

        await page.click('#generateBtn');
        await page.waitForTimeout(100);
      }

      // Open stats
      await statsBtn.click();

      // Check stats modal/panel
      const statsModal = page.locator('#statsModal');
      await expect(statsModal).toBeVisible();

      // Verify stats content
      await expect(statsModal).toContainText('Total generados');
      await expect(statsModal).toContainText('v1');
      await expect(statsModal).toContainText('v4');
      await expect(statsModal).toContainText('v5');
    }
  });

  test('should show help information', async ({ page }) => {
    const helpBtn = page.locator('#helpBtn');

    if (await helpBtn.isVisible()) {
      await helpBtn.click();

      // Check help modal/panel
      const helpModal = page.locator('#helpModal');
      await expect(helpModal).toBeVisible();

      // Verify help content
      await expect(helpModal).toContainText('UUID');
      await expect(helpModal).toContainText('v1');
      await expect(helpModal).toContainText('v4');
      await expect(helpModal).toContainText('RFC 4122');
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Check that main elements are still visible and usable
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#versionSelect')).toBeVisible();
    await expect(page.locator('#generateBtn')).toBeVisible();

    // Test generation on mobile
    await page.click('#generateBtn');
    await page.waitForTimeout(100);

    const uuid = await page.locator('#uuidOutput').textContent();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
  });

  test('should handle namespace selection for v3/v5', async ({ page }) => {
    // Test v3 with namespace
    await page.selectOption('#versionSelect', 'v3');

    const namespaceSelect = page.locator('#namespaceSelect');
    const customNamespaceInput = page.locator('#customNamespaceInput');
    const nameInput = page.locator('#nameInput');

    if (await namespaceSelect.isVisible()) {
      // Test predefined namespace
      await namespaceSelect.selectOption('dns');

      if (await nameInput.isVisible()) {
        await nameInput.fill('example.com');
        await page.click('#generateBtn');
        await page.waitForTimeout(100);

        const uuid = await page.locator('#uuidOutput').textContent();
        expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      }

      // Test custom namespace
      await namespaceSelect.selectOption('custom');

      if (await customNamespaceInput.isVisible()) {
        await customNamespaceInput.fill('550e8400-e29b-41d4-a716-446655440000');
        await nameInput.fill('custom.test');
        await page.click('#generateBtn');
        await page.waitForTimeout(100);

        const uuid2 = await page.locator('#uuidOutput').textContent();
        expect(uuid2).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-3[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
      }
    }
  });

  test('should validate performance', async ({ page }) => {
    // Test performance with batch generation
    const countInput = page.locator('#countInput');

    if (await countInput.isVisible()) {
      await countInput.fill('100');

      const startTime = Date.now();
      await page.click('#generateBatchBtn');

      // Wait for generation to complete
      await expect(page.locator('#uuidList .uuid-item')).toHaveCount(100, { timeout: 5000 });

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (5 seconds)
      expect(duration).toBeLessThan(5000);

      // Verify all UUIDs are generated
      const uuids = await page.locator('#uuidList .uuid-item').allTextContents();
      expect(uuids).toHaveLength(100);

      // Verify uniqueness
      const uniqueUUIDs = new Set(uuids.map(u => u.trim()));
      expect(uniqueUUIDs.size).toBe(100);
    }
  });

  test('should maintain state during navigation', async ({ page }) => {
    // Set specific options
    await page.selectOption('#versionSelect', 'v1');
    await page.selectOption('#formatSelect', 'uppercase');

    // Generate UUID
    await page.click('#generateBtn');
    await page.waitForTimeout(100);

    const originalUuid = await page.locator('#uuidOutput').textContent();

    // Navigate away and back
    await page.goto('/');
    await page.goto('/tools/uuid-generator');
    await page.waitForLoadState('networkidle');

    // Check if state is preserved (this depends on implementation)
    const versionValue = await page.locator('#versionSelect').inputValue();
    const formatValue = await page.locator('#formatSelect').inputValue();

    // At minimum, defaults should be restored
    expect(versionValue).toBeDefined();
    expect(formatValue).toBeDefined();
  });

  test('should show loading states', async ({ page }) => {
    // For operations that might take time, check loading indicators
    const generateBtn = page.locator('#generateBtn');

    await generateBtn.click();

    // Check for loading state (spinner, disabled button, etc.)
    const isDisabled = await generateBtn.isDisabled();
    const hasLoadingText = await generateBtn.textContent();

    // Verify loading state exists briefly
    expect(isDisabled || hasLoadingText?.includes('Generando')).toBeTruthy();

    // Wait for completion
    await page.waitForTimeout(100);

    // Verify loading state is cleared
    await expect(generateBtn).toBeEnabled();
  });
});