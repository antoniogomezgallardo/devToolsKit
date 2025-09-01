import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for DevToolsKit E2E tests
 */
export default defineConfig({
  testDir: './tests/e2e',
  
  /* Global timeout for the entire test run */
  globalTimeout: 10 * 60 * 1000, // 10 minutes
  
  /* Timeout per test */
  timeout: 60 * 1000, // 1 minute per test
  
  /* Run tests in files in parallel */
  fullyParallel: true,
  
  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,
  
  /* Retry strategy for flaky tests */
  retries: process.env.CI ? 3 : 2, // 3 retries in CI, 2 retries locally
  
  /* Parallel workers for optimal performance */
  workers: process.env.CI ? 10 : 14, // 10 workers in CI, 14 workers locally
  
  /* Reporter to use */
  reporter: [
    ['html'],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['junit', { outputFile: 'playwright-report/results.xml' }]
  ],
  
  /* Shared settings for all the projects below */
  use: {
    /* Base URL to use in actions like `await page.goto('/')` */
    baseURL: 'http://localhost:1234',
    
    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',
    
    /* Take screenshot on failure */
    screenshot: 'only-on-failure',
    
    /* Record video on failure */
    video: 'retain-on-failure',
    
    /* Larger viewport for better visibility */
    viewport: { width: 1920, height: 1080 },
    
    /* Slower actions for better debugging */
    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
      },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:1234',
    reuseExistingServer: !process.env.CI,
    timeout: 180 * 1000, // 3 minutes for dev server startup
    stdout: 'ignore', // Reduce output noise
    stderr: 'pipe',   // Still show errors
  },
});