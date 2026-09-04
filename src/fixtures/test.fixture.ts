import { test as base } from '@playwright/test';
import { SignupPage } from '../pages/signup.page';

/**
 * Custom test fixtures for Flip Business UI Tests
 * Provides page objects automatically to tests
 */

// Declare the types of fixtures
type FlipFixtures = {
  signupPage: SignupPage;
};

// Extend base test with custom fixtures
export const test = base.extend<FlipFixtures>({
  signupPage: async ({ page }, use) => {
    const signupPage = new SignupPage(page);
    await use(signupPage);
  },
});

export { expect } from '@playwright/test';
