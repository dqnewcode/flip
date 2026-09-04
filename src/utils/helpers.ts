import { Page } from '@playwright/test';

/**
 * Utility helper functions for tests
 */

/**
 * Generate a unique string based on timestamp
 */
export const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Generate unique email
 */
export const generateEmail = (prefix: string = 'test'): string => {
  return `${prefix}_${generateUniqueId()}@example.com`;
};

/**
 * Wait for network to be idle
 */
export const waitForNetworkIdle = async (page: Page, timeout: number = 5000): Promise<void> => {
  await page.waitForLoadState('networkidle', { timeout });
};

/**
 * Take a screenshot with timestamp
 */
export const takeScreenshot = async (page: Page, name: string): Promise<void> => {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({ 
    path: `test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true 
  });
};

/**
 * Scroll element into view
 */
export const scrollIntoView = async (page: Page, selector: string): Promise<void> => {
  await page.locator(selector).scrollIntoViewIfNeeded();
};

/**
 * Wait for element and get text
 */
export const getTextContent = async (page: Page, selector: string): Promise<string> => {
  const element = page.locator(selector);
  await element.waitFor({ state: 'visible' });
  return (await element.textContent()) || '';
};

/**
 * Check if element exists
 */
export const elementExists = async (page: Page, selector: string): Promise<boolean> => {
  const count = await page.locator(selector).count();
  return count > 0;
};

/**
 * Retry action with attempts
 */
export const retryAction = async <T>(
  action: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000
): Promise<T> => {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await action();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }
  
  throw lastError;
};

/**
 * Format Indonesian phone number
 */
export const formatIndonesianPhone = (phone: string): string => {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Remove leading 0 or 62 if present
  if (digits.startsWith('62')) {
    return digits.substring(2);
  }
  if (digits.startsWith('0')) {
    return digits.substring(1);
  }
  
  return digits;
};
