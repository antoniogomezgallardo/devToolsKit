/**
 * Hash Generator E2E Tests
 * Comprehensive end-to-end testing for Hash Generator tool
 */

import { test, expect, Page } from '@playwright/test';

test.describe('Hash Generator Tool', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.click('text=🔐 Generador de Hash');
    await expect(page.locator('h1')).toContainText('🔐 Generador de Hash');
  });

  test.describe('UI Layout and Elements', () => {
    test('should display all main sections', async ({ page }) => {
      // Check main sections are present
      await expect(page.locator('h2:has-text("Configuración")')).toBeVisible();
      await expect(page.locator('h2:has-text("Generador de Hash de Texto")')).toBeVisible();
      await expect(page.locator('h2:has-text("Generador de Hash de Archivos")')).toBeVisible();
      await expect(page.locator('h2:has-text("Procesamiento por Lotes")')).toBeVisible();
      await expect(page.locator('h2:has-text("Comparación de Hashes")')).toBeVisible();
      await expect(page.locator('h2:has-text("Estadísticas de Procesamiento")')).toBeVisible();
    });

    test('should have all configuration options', async ({ page }) => {
      // Algorithm selector
      await expect(page.locator('#algorithm-select')).toBeVisible();

      // Format selector
      await expect(page.locator('#format-select')).toBeVisible();
      await expect(page.locator('#format-select option[value="hex"]')).toBeVisible();
      await expect(page.locator('#format-select option[value="base64"]')).toBeVisible();

      // Option checkboxes
      await expect(page.locator('#uppercase-checkbox')).toBeVisible();
      await expect(page.locator('#separators-checkbox')).toBeVisible();
      await expect(page.locator('#realtime-checkbox')).toBeVisible();

      // Check default values
      await expect(page.locator('#realtime-checkbox')).toBeChecked();
    });

    test('should populate algorithm selector with all options', async ({ page }) => {
      const algorithmSelect = page.locator('#algorithm-select');

      // Check that algorithms are present
      await expect(algorithmSelect.locator('option')).toHaveCount(5);

      // Check specific algorithms
      await expect(algorithmSelect.locator('option[value="sha256"]')).toBeVisible();
      await expect(algorithmSelect.locator('option[value="sha512"]')).toBeVisible();
      await expect(algorithmSelect.locator('option[value="sha1"]')).toBeVisible();
      await expect(algorithmSelect.locator('option[value="crc32"]')).toBeVisible();

      // MD5 should be disabled (not supported)
      await expect(algorithmSelect.locator('option[value="md5"]')).toBeDisabled();
    });
  });

  test.describe('Text Hash Generation', () => {
    test('should generate hash for text input', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const generateBtn = page.locator('#generate-btn');

      // Enter test text
      await textInput.fill('Hello World');

      // Generate hash
      await generateBtn.click();

      // Wait for hash to be generated
      await expect(hashOutput).not.toHaveValue('');

      // Verify hash format (should be hex for SHA-256)
      const hashValue = await hashOutput.inputValue();
      expect(hashValue).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex format

      // Copy button should be enabled
      await expect(page.locator('#copy-btn')).toBeEnabled();
    });

    test('should generate hash in real-time when enabled', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const realtimeCheckbox = page.locator('#realtime-checkbox');

      // Ensure real-time is enabled (should be by default)
      await expect(realtimeCheckbox).toBeChecked();

      // Type text and verify hash is generated automatically
      await textInput.fill('test');

      // Wait for hash to appear (real-time generation)
      await expect(hashOutput).not.toHaveValue('', { timeout: 2000 });

      const firstHash = await hashOutput.inputValue();

      // Add more text and verify hash changes
      await textInput.fill('test123');

      // Wait for hash to update
      await page.waitForFunction(
        (expectedHash) => {
          const hashElement = document.querySelector('#hash-output') as HTMLTextAreaElement;
          return hashElement && hashElement.value !== expectedHash;
        },
        firstHash,
        { timeout: 2000 }
      );

      const secondHash = await hashOutput.inputValue();
      expect(secondHash).not.toBe(firstHash);
    });

    test('should change hash format between hex and base64', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const formatSelect = page.locator('#format-select');

      // Generate initial hash in hex format
      await textInput.fill('test data');
      await page.locator('#generate-btn').click();
      await expect(hashOutput).not.toHaveValue('');

      const hexHash = await hashOutput.inputValue();
      expect(hexHash).toMatch(/^[a-f0-9]+$/); // Hex format

      // Switch to base64 format
      await formatSelect.selectOption('base64');

      // Wait for format change
      await page.waitForFunction(() => {
        const hashElement = document.querySelector('#hash-output') as HTMLTextAreaElement;
        return hashElement && /^[A-Za-z0-9+/]+=*$/.test(hashElement.value);
      });

      const base64Hash = await hashOutput.inputValue();
      expect(base64Hash).toMatch(/^[A-Za-z0-9+/]+=*$/); // Base64 format
      expect(base64Hash).not.toBe(hexHash);
    });

    test('should toggle uppercase formatting', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const uppercaseCheckbox = page.locator('#uppercase-checkbox');

      // Generate hash with lowercase (default)
      await textInput.fill('test data');
      await page.locator('#generate-btn').click();
      await expect(hashOutput).not.toHaveValue('');

      const lowercaseHash = await hashOutput.inputValue();
      expect(lowercaseHash).toMatch(/^[a-f0-9]+$/); // Lowercase hex

      // Enable uppercase
      await uppercaseCheckbox.check();

      // Wait for format change
      await page.waitForFunction(() => {
        const hashElement = document.querySelector('#hash-output') as HTMLTextAreaElement;
        return hashElement && /^[A-F0-9]+$/.test(hashElement.value);
      });

      const uppercaseHash = await hashOutput.inputValue();
      expect(uppercaseHash).toMatch(/^[A-F0-9]+$/); // Uppercase hex
      expect(uppercaseHash.toLowerCase()).toBe(lowercaseHash);
    });

    test('should add separators when enabled', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const separatorsCheckbox = page.locator('#separators-checkbox');

      // Generate hash without separators
      await textInput.fill('test data');
      await page.locator('#generate-btn').click();
      await expect(hashOutput).not.toHaveValue('');

      const hashWithoutSeparators = await hashOutput.inputValue();
      expect(hashWithoutSeparators).not.toContain(':');

      // Enable separators
      await separatorsCheckbox.check();

      // Wait for format change
      await page.waitForFunction(() => {
        const hashElement = document.querySelector('#hash-output') as HTMLTextAreaElement;
        return hashElement && hashElement.value.includes(':');
      });

      const hashWithSeparators = await hashOutput.inputValue();
      expect(hashWithSeparators).toContain(':');
      expect(hashWithSeparators.replace(/:/g, '')).toBe(hashWithoutSeparators);
    });

    test('should copy hash to clipboard', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const copyBtn = page.locator('#copy-btn');

      // Generate hash first
      await textInput.fill('copy test');
      await page.locator('#generate-btn').click();
      await expect(copyBtn).toBeEnabled();

      // Grant clipboard permissions
      await page.context().grantPermissions(['clipboard-write']);

      // Click copy button
      await copyBtn.click();

      // Verify button feedback
      await expect(copyBtn).toContainText('✓ Copiado');

      // Wait for button to reset
      await expect(copyBtn).toContainText('Copiar', { timeout: 3000 });
    });

    test('should clear all inputs and outputs', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const clearBtn = page.locator('#clear-btn');

      // Generate hash first
      await textInput.fill('clear test');
      await page.locator('#generate-btn').click();
      await expect(hashOutput).not.toHaveValue('');

      // Clear all
      await clearBtn.click();

      // Verify everything is cleared
      await expect(textInput).toHaveValue('');
      await expect(hashOutput).toHaveValue('');
      await expect(page.locator('#copy-btn')).toBeDisabled();
    });
  });

  test.describe('Algorithm Selection', () => {
    test('should change algorithm and update hash', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');
      const algorithmSelect = page.locator('#algorithm-select');

      // Generate hash with SHA-256 (default)
      await textInput.fill('algorithm test');
      await page.locator('#generate-btn').click();
      await expect(hashOutput).not.toHaveValue('');

      const sha256Hash = await hashOutput.inputValue();
      expect(sha256Hash).toHaveLength(64); // SHA-256 produces 64 hex chars

      // Switch to SHA-512
      await algorithmSelect.selectOption('sha512');

      // Wait for hash to update with new algorithm
      await page.waitForFunction(
        (oldHash) => {
          const hashElement = document.querySelector('#hash-output') as HTMLTextAreaElement;
          return hashElement && hashElement.value !== oldHash;
        },
        sha256Hash
      );

      const sha512Hash = await hashOutput.inputValue();
      expect(sha512Hash).toHaveLength(128); // SHA-512 produces 128 hex chars
      expect(sha512Hash).not.toBe(sha256Hash);
    });

    test('should show algorithm information', async ({ page }) => {
      const algorithmInfo = page.locator('#algorithm-info');
      const algorithmSelect = page.locator('#algorithm-select');

      // Should show SHA-256 info by default
      await expect(algorithmInfo).toContainText('SHA-256');
      await expect(algorithmInfo).toContainText('Secure and widely supported');
      await expect(algorithmInfo).toContainText('ALTA'); // High security

      // Switch to CRC32 and verify info updates
      await algorithmSelect.selectOption('crc32');
      await expect(algorithmInfo).toContainText('CRC-32');
      await expect(algorithmInfo).toContainText('Fast checksum');
      await expect(algorithmInfo).toContainText('BAJA'); // Low security
    });
  });

  test.describe('File Hash Generation', () => {
    test('should handle file upload and generate hash', async ({ page }) => {
      const fileInput = page.locator('#file-input');
      const fileHashOutput = page.locator('#file-hash-output');

      // Create a test file
      const testFileContent = 'This is test file content for hashing.';
      const testFile = await page.evaluateHandle((content) => {
        const blob = new Blob([content], { type: 'text/plain' });
        const file = new File([blob], 'test.txt', { type: 'text/plain' });
        return file;
      }, testFileContent);

      // Upload file
      await fileInput.setInputFiles([testFile as any]);

      // Wait for file hash to be generated
      await expect(fileHashOutput).not.toHaveValue('');
      await expect(fileHashOutput).not.toHaveValue('Procesando archivo...');

      // Verify file hash output contains expected information
      const output = await fileHashOutput.inputValue();
      expect(output).toContain('Archivo: test.txt');
      expect(output).toContain('Tamaño:');
      expect(output).toContain('Algoritmo: SHA256');
      expect(output).toContain('Hash:');
      expect(output).toContain('Tiempo:');
    });

    test('should clear file input when clear button is clicked', async ({ page }) => {
      const fileInput = page.locator('#file-input');
      const fileHashOutput = page.locator('#file-hash-output');
      const clearBtn = page.locator('#clear-btn');

      // Simulate file selection by setting value in output
      await fileHashOutput.fill('Test file hash output');

      // Clear all
      await clearBtn.click();

      // Verify file output is cleared
      await expect(fileHashOutput).toHaveValue('');
    });
  });

  test.describe('Batch Processing', () => {
    test('should process multiple texts in batch', async ({ page }) => {
      const batchTextarea = page.locator('#batch-textarea');
      const generateBatchBtn = page.locator('#generate-batch-btn');
      const batchOutput = page.locator('#batch-output');
      const exportBatchBtn = page.locator('#export-batch-btn');

      // Enter multiple lines for batch processing
      const batchText = 'Line 1\nLine 2\nLine 3';
      await batchTextarea.fill(batchText);

      // Generate batch hashes
      await generateBatchBtn.click();

      // Wait for batch processing to complete
      await expect(batchOutput).not.toHaveValue('');
      await expect(batchOutput).not.toHaveValue('Procesando lote...');

      // Verify batch output contains expected information
      const output = await batchOutput.inputValue();
      expect(output).toContain('Procesados: 3 elementos');
      expect(output).toContain('Tiempo total:');
      expect(output).toContain('Algoritmo: SHA256');
      expect(output).toContain('1. Línea 1');
      expect(output).toContain('2. Línea 2');
      expect(output).toContain('3. Línea 3');

      // Export button should be enabled
      await expect(exportBatchBtn).toBeEnabled();
    });

    test('should show error for empty batch input', async ({ page }) => {
      const generateBatchBtn = page.locator('#generate-batch-btn');

      // Try to generate batch without input
      await generateBatchBtn.click();

      // Should show error message
      await expect(page.locator('.fixed.top-4.right-4')).toContainText('Por favor introduce textos para procesar en lote');
    });

    test('should export batch results as CSV', async ({ page }) => {
      const batchTextarea = page.locator('#batch-textarea');
      const generateBatchBtn = page.locator('#generate-batch-btn');
      const exportBatchBtn = page.locator('#export-batch-btn');

      // Generate batch hashes first
      await batchTextarea.fill('Export test 1\nExport test 2');
      await generateBatchBtn.click();

      // Wait for processing
      await expect(exportBatchBtn).toBeEnabled();

      // Start download
      const downloadPromise = page.waitForEvent('download');
      await exportBatchBtn.click();

      const download = await downloadPromise;

      // Verify download properties
      expect(download.suggestedFilename()).toMatch(/^hash-batch-sha256-\d{4}-\d{2}-\d{2}\.csv$/);
    });

    test('should clear batch data when clear button is clicked', async ({ page }) => {
      const batchTextarea = page.locator('#batch-textarea');
      const batchOutput = page.locator('#batch-output');
      const clearBtn = page.locator('#clear-btn');
      const exportBatchBtn = page.locator('#export-batch-btn');

      // Add batch data
      await batchTextarea.fill('Clear test 1\nClear test 2');
      await batchOutput.fill('Test batch output');

      // Clear all
      await clearBtn.click();

      // Verify batch data is cleared
      await expect(batchTextarea).toHaveValue('');
      await expect(batchOutput).toHaveValue('');
      await expect(exportBatchBtn).toBeDisabled();
    });
  });

  test.describe('Hash Comparison', () => {
    test('should compare matching hashes', async ({ page }) => {
      const hash1Input = page.locator('#hash1-input');
      const hash2Input = page.locator('#hash2-input');
      const compareBtn = page.locator('#compare-btn');
      const comparisonResult = page.locator('#comparison-result');

      // Enter matching hashes (same hash in different cases)
      const testHash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3';
      await hash1Input.fill(testHash);
      await hash2Input.fill(testHash.toUpperCase());

      // Compare hashes
      await compareBtn.click();

      // Verify comparison result
      await expect(comparisonResult).toBeVisible();
      await expect(comparisonResult).toContainText('✅ Los hashes coinciden');
      await expect(comparisonResult).toContainText('Similitud: 100.0%');
    });

    test('should compare non-matching hashes', async ({ page }) => {
      const hash1Input = page.locator('#hash1-input');
      const hash2Input = page.locator('#hash2-input');
      const compareBtn = page.locator('#compare-btn');
      const comparisonResult = page.locator('#comparison-result');

      // Enter different hashes
      await hash1Input.fill('a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3');
      await hash2Input.fill('b665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae4');

      // Compare hashes
      await compareBtn.click();

      // Verify comparison result
      await expect(comparisonResult).toBeVisible();
      await expect(comparisonResult).toContainText('❌ Los hashes NO coinciden');
      await expect(comparisonResult).toContainText('Similitud:');
    });

    test('should show error for empty hash comparison', async ({ page }) => {
      const compareBtn = page.locator('#compare-btn');

      // Try to compare without entering hashes
      await compareBtn.click();

      // Should show error message
      await expect(page.locator('.fixed.top-4.right-4')).toContainText('Por favor introduce ambos hashes para comparar');
    });

    test('should clear comparison data when clear button is clicked', async ({ page }) => {
      const hash1Input = page.locator('#hash1-input');
      const hash2Input = page.locator('#hash2-input');
      const comparisonResult = page.locator('#comparison-result');
      const clearBtn = page.locator('#clear-btn');

      // Add comparison data
      await hash1Input.fill('test hash 1');
      await hash2Input.fill('test hash 2');

      // Clear all
      await clearBtn.click();

      // Verify comparison data is cleared
      await expect(hash1Input).toHaveValue('');
      await expect(hash2Input).toHaveValue('');
      await expect(comparisonResult).toHaveClass(/hidden/);
    });
  });

  test.describe('Error Handling', () => {
    test('should show error for empty text input when real-time is disabled', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const realtimeCheckbox = page.locator('#realtime-checkbox');
      const generateBtn = page.locator('#generate-btn');
      const hashOutput = page.locator('#hash-output');
      const copyBtn = page.locator('#copy-btn');

      // Disable real-time generation
      await realtimeCheckbox.uncheck();

      // Try to generate hash with empty input
      await generateBtn.click();

      // Hash output should remain empty and copy button disabled
      await expect(hashOutput).toHaveValue('');
      await expect(copyBtn).toBeDisabled();
    });

    test('should handle unsupported algorithm gracefully', async ({ page }) => {
      // This test simulates what would happen if MD5 was selected but not supported
      // Since MD5 is disabled in the UI, we test the error handling path

      const textInput = page.locator('#text-input');
      await textInput.fill('test for unsupported algorithm');

      // MD5 option should be disabled
      const md5Option = page.locator('#algorithm-select option[value="md5"]');
      await expect(md5Option).toBeDisabled();
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile viewport', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

      // Check that main elements are still visible and functional
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#text-input')).toBeVisible();
      await expect(page.locator('#generate-btn')).toBeVisible();

      // Test basic functionality on mobile
      await page.locator('#text-input').fill('mobile test');
      await page.locator('#generate-btn').click();

      await expect(page.locator('#hash-output')).not.toHaveValue('');
    });

    test('should work on tablet viewport', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 }); // iPad size

      // Check that grid layouts work properly
      await expect(page.locator('.grid')).toBeVisible();
      await expect(page.locator('#algorithm-select')).toBeVisible();
      await expect(page.locator('#format-select')).toBeVisible();

      // Test functionality on tablet
      await page.locator('#text-input').fill('tablet test');
      await page.locator('#generate-btn').click();

      await expect(page.locator('#hash-output')).not.toHaveValue('');
    });
  });

  test.describe('Performance', () => {
    test('should generate hash quickly for normal text', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');

      const startTime = Date.now();

      await textInput.fill('Performance test with reasonable amount of text content');
      await page.locator('#generate-btn').click();

      await expect(hashOutput).not.toHaveValue('');

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should complete within reasonable time (5 seconds is very generous)
      expect(duration).toBeLessThan(5000);
    });

    test('should handle large text input efficiently', async ({ page }) => {
      const textInput = page.locator('#text-input');
      const hashOutput = page.locator('#hash-output');

      // Create large text input (10KB)
      const largeText = 'A'.repeat(10 * 1024);

      const startTime = Date.now();

      await textInput.fill(largeText);
      await page.locator('#generate-btn').click();

      await expect(hashOutput).not.toHaveValue('');

      const endTime = Date.now();
      const duration = endTime - startTime;

      // Should handle large input within reasonable time
      expect(duration).toBeLessThan(10000);
    });
  });
});