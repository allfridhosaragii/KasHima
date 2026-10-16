import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['list'],['html',{open:'never'}]] : 'list',
  use: { baseURL: 'http://127.0.0.1:5173/KasHima/', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'mobile-390', use: { ...devices['iPhone 13'], browserName:'chromium' } },
    { name: 'mobile-320', use: { viewport: { width: 320, height: 740 }, browserName: 'chromium' } },
    { name: 'desktop', use: { viewport: { width: 1365, height: 900 }, browserName: 'chromium' } },
  ],
  webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://127.0.0.1:5173/KasHima/', reuseExistingServer: !process.env.CI, timeout: 60_000 },
})
