import { Page, Locator } from '@playwright/test';

export class SignupPage {
  readonly page: Page;
  
  // Form Input Locators
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly passwordInput: Locator;
  
  // Business Type Radio Buttons
  readonly businessTypePerseorangan: Locator;
  readonly businessTypeBadanUsaha: Locator;
  
  // Buttons
  readonly submitButton: Locator;
  readonly loginButton: Locator;
  readonly passwordToggleButton: Locator;
  
  // Links
  readonly termsLink: Locator;
  readonly privacyLink: Locator;
  
  // Page Title
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Input fields based on actual page analysis
    this.nameInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone_number"]');
    this.passwordInput = page.locator('input[name="password"]');
    
    // Business type radio buttons (value: 2=Perseorangan, 3=Badan Usaha)
    this.businessTypePerseorangan = page.locator('input[name="business_type"][value="2"]');
    this.businessTypeBadanUsaha = page.locator('input[name="business_type"][value="3"]');
    
    // Buttons
    this.submitButton = page.locator('button[type="submit"]');
    this.loginButton = page.locator('button:has-text("Masuk")');
    this.passwordToggleButton = page.locator('[data-qaid*="show-password"], [data-qaid*="hide-password"]');
    
    // Links
    this.termsLink = page.locator('a:has-text("Syarat & Ketentuan")');
    this.privacyLink = page.locator('a:has-text("Kebijakan Privasi")');
    
    // Page elements
    this.pageTitle = page.locator('h1, h2, [class*="title"], [class*="heading"]').first();
  }

  // Navigate to signup page
  async goto() {
    await this.page.goto('/signup');
    await this.page.waitForLoadState('networkidle');
  }

  // Fill name field
  async fillName(name: string) {
    await this.nameInput.fill(name);
  }

  // Fill email field
  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  // Fill phone field
  async fillPhone(phone: string) {
    await this.phoneInput.fill(phone);
  }

  // Fill password field
  async fillPassword(password: string) {
    await this.passwordInput.fill(password);
  }

  // Select business type - Perseorangan
  async selectPerseorangan() {
    await this.businessTypePerseorangan.click({ force: true });
  }

  // Select business type - Badan Usaha
  async selectBadanUsaha() {
    await this.businessTypeBadanUsaha.click({ force: true });
  }

  // Fill complete signup form
  async fillSignupForm(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    businessType: 'perseorangan' | 'badanUsaha';
  }) {
    await this.fillName(data.name);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    
    if (data.businessType === 'perseorangan') {
      await this.selectPerseorangan();
    } else {
      await this.selectBadanUsaha();
    }
    
    await this.fillPassword(data.password);
  }

  // Click submit button
  async clickSubmit() {
    // Use force click to bypass disabled state for testing validation
    await this.submitButton.click({ force: true });
  }

  // Click login button
  async clickLogin() {
    await this.loginButton.click();
  }

  // Toggle password visibility
  async togglePasswordVisibility() {
    await this.passwordToggleButton.click();
  }

  // Get password input type (to check if visible)
  async getPasswordInputType() {
    return await this.passwordInput.getAttribute('type');
  }

  // Check if element is visible
  async isNameInputVisible() {
    return await this.nameInput.isVisible();
  }

  async isEmailInputVisible() {
    return await this.emailInput.isVisible();
  }

  async isPhoneInputVisible() {
    return await this.phoneInput.isVisible();
  }

  async isPasswordInputVisible() {
    return await this.passwordInput.isVisible();
  }

  async isSubmitButtonVisible() {
    return await this.submitButton.isVisible();
  }

  async isLoginButtonVisible() {
    return await this.loginButton.isVisible();
  }

  async areBusinessTypeOptionsVisible() {
    const perseorangan = await this.businessTypePerseorangan.isVisible();
    const badanUsaha = await this.businessTypeBadanUsaha.isVisible();
    return perseorangan && badanUsaha;
  }

  // Get placeholder text
  async getNamePlaceholder() {
    return await this.nameInput.getAttribute('placeholder');
  }

  async getEmailPlaceholder() {
    return await this.emailInput.getAttribute('placeholder');
  }

  async getPhonePlaceholder() {
    return await this.phoneInput.getAttribute('placeholder');
  }

  async getPasswordPlaceholder() {
    return await this.passwordInput.getAttribute('placeholder');
  }

  // Verify all page elements are present
  async verifyAllElementsPresent() {
    const elements = {
      nameInput: await this.isNameInputVisible(),
      emailInput: await this.isEmailInputVisible(),
      phoneInput: await this.isPhoneInputVisible(),
      passwordInput: await this.isPasswordInputVisible(),
      businessTypes: await this.areBusinessTypeOptionsVisible(),
      submitButton: await this.isSubmitButtonVisible(),
      loginButton: await this.isLoginButtonVisible(),
      termsLink: await this.termsLink.isVisible(),
      privacyLink: await this.privacyLink.isVisible(),
    };
    
    return elements;
  }

  // Get validation error messages (if any)
  async getValidationErrors() {
    const errorSelectors = [
      '.error',
      '.invalid-feedback',
      '[class*="error"]',
      '[role="alert"]',
      '.text-danger',
      '[class*="invalid"]'
    ];
    
    const errors = [];
    for (const selector of errorSelectors) {
      const elements = await this.page.locator(selector).all();
      for (const el of elements) {
        const isVisible = await el.isVisible();
        if (isVisible) {
          const text = await el.textContent();
          if (text?.trim()) {
            errors.push(text.trim());
          }
        }
      }
    }
    
    return errors;
  }

  // Wait for navigation after form submission
  async waitForNavigation() {
    await this.page.waitForURL(/\/(dashboard|verification|success)/, { timeout: 10000 });
  }

  // Check if form submitted successfully (URL changed)
  async isFormSubmitted() {
    const url = this.page.url();
    return !url.includes('/signup');
  }
}
