const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  testMatch: 'choice-train-v180-compat.spec.js',
  timeout: 30_000,
  expect: {
    timeout: 7_000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: true
  },
  projects: [
    {
      name: 'android-chromium',
      use: {
        ...devices['Pixel 5'],
        browserName: 'chromium'
      }
    },
    {
      name: 'ipad-webkit',
      use: {
        ...devices['iPad Mini'],
        browserName: 'webkit'
      }
    },
    {
      name: 'kindle-silk-shape',
      use: {
        browserName: 'chromium',
        viewport: { width: 600, height: 960 },
        deviceScaleFactor: 1,
        hasTouch: true,
        isMobile: true,
        userAgent: 'Mozilla/5.0 (Linux; U; en-US) AppleWebKit/537.36 (KHTML, like Gecko) Silk/123.0 like Chrome/123.0 Safari/537.36'
      }
    }
  ]
});
