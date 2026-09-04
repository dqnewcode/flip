import { Page, Locator, expect } from '@playwright/test';

/**
 * Page Object Model for Flip Business Signup Page
 * URL: https://business.flip.id/signup
 * 
 * Form Structure (from live inspection):
 * - name: text input, placeholder="Masukkan nama lengkap sesuai e-KTP/Paspor", name="name"
 * - email: email input, placeholder="Masukkan alamat email bisnis", name="email"  
 * - phone: text input, placeholder="8123456789", name="phone_number"
 * - business_type: radio buttons, name="business_type", value="2" (Perseorangan), value="3" (Badan Usaha)
 * - password: password input, placeholder="Buat kata sandi yang aman", name="password"
 * - submit: button type="submit", text="Buat Akun"
 * - login: button type="button", text="Masuk"
 */
export class SignupPage {
  readonly page: Page;
  
  // Page URL
  readonly url = '/signup';

  // Form Fields - using exact attributes from live inspection
  readonly namaLengkapInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly phoneCountryCode: Locator;
  readonly passwordInput: Locator;
  readonly passwordToggle: Locator;

  // Business Type Radio Buttons
  readonly tipeBisnisPerseorangan: Locator;
  readonly tipeBisnisBadanUsaha: Locator;

  // Buttons
  readonly buatAkunButton: Locator;
  readonly masukButton: Locator;

  // Links
  readonly syaratKetentuanLink: Locator;
  readonly kebijakanPrivasiLink: Locator;
  readonly flipLogoLink: Locator;

  // Logo and Branding
  readonly pageTitle: Locator;

  // Error Messages
  readonly errorMessages: Locator;

  // Password Tips
  readonly passwordTips: Locator;

  constructor(page: Page) {
    this.page = page;

    // Form fields - using exact name attributes
    this.namaLengkapInput = page.locator('input[name="name"]');
    this.emailInput = page.locator('input[name="email"]');
    this.phoneInput = page.locator('input[name="phone_number"]');
    this.phoneCountryCode = page.locator('text=+62').first();
    this.passwordInput = page.locator('input[name="password"]');
    
    // Password visibility toggle - uses data-qaid attribute
    this.passwordToggle = page.locator('[data-qaid="qa-show-password-button"]');

    // Business type radio buttons - using value attributes
    // value="2" = Perseorangan, value="3" = Badan Usaha
    this.tipeBisnisPerseorangan = page.locator('input[name="business_type"][value="2"]');
    this.tipeBisnisBadanUsaha = page.locator('input[name="business_type"][value="3"]');

    // Submit button
    this.buatAkunButton = page.locator('button[type="submit"]');

    // Login button (not a link, it's a button)
    this.masukButton = page.locator('button[type="button"]').filter({ hasText: 'Masuk' });

    // Links
    this.syaratKetentuanLink = page.locator('a[href*="terms-and-conditions#tnc"]');
    this.kebijakanPrivasiLink = page.locator('a[href*="terms-and-conditions#policy"]');
    this.flipLogoLink = page.locator('a[href="https://flip.id/business"]').first();

    // Page title
    this.pageTitle = page.locator('text=Buat Akun Flip For Business').first();

    // Error messages
    this.errorMessages = page.locator('[class*="error" i], [role="alert"], [class*="invalid" i]');

    // Password tips section
    this.passwordTips = page.locator('text=Tips').first();
  }

  /**
   * Navigate to signup page
   */
  async goto(): Promise<void> {
    await this.page.goto(this.url);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill the complete signup form
   */
  async fillSignupForm(data: {
    namaLengkap: string;
    email: string;
    phone: string;
    tipeBisnis: 'perseorangan' | 'badan_usaha';
    password: string;
  }): Promise<void> {
    await this.fillNamaLengkap(data.namaLengkap);
    await this.fillEmail(data.email);
    await this.fillPhone(data.phone);
    await this.selectTipeBisnis(data.tipeBisnis);
    await this.fillPassword(data.password);
  }

  /**
   * Fill Nama Lengkap field
   */
  async fillNamaLengkap(nama: string): Promise<void> {
    await this.namaLengkapInput.fill(nama);
  }

  /**
   * Fill Email field
   */
  async fillEmail(email: string): Promise<void> {
    await this.emailInput.fill(email);
  }

  /**
   * Fill Phone number field (without country code)
   */
  async fillPhone(phone: string): Promise<void> {
    await this.phoneInput.fill(phone);
  }

  /**
   * Select Tipe Bisnis
   */
  async selectTipeBisnis(tipe: 'perseorangan' | 'badan_usaha'): Promise<void> {
    if (tipe === 'perseorangan') {
      // Click the radio input directly using force to bypass disabled check on label
      await this.tipeBisnisPerseorangan.click({ force: true });
    } else {
      await this.tipeBisnisBadanUsaha.click({ force: true });
    }
  }

  /**
   * Fill Password field
   */
  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  /**
   * Toggle password visibility
   */
  async togglePasswordVisibility(): Promise<void> {
    await this.passwordToggle.click();
  }

  /**
   * Check if password is visible
   */
  async isPasswordVisible(): Promise<boolean> {
    const inputType = await this.passwordInput.getAttribute('type');
    return inputType === 'text';
  }

  /**
   * Click Buat Akun button
   */
  async clickBuatAkun(): Promise<void> {
    await this.buatAkunButton.click();
  }

  /**
   * Click Masuk button
   */
  async clickMasuk(): Promise<void> {
    await this.masukButton.click();
  }

  /**
   * Check if Buat Akun button is enabled
   */
  async isBuatAkunEnabled(): Promise<boolean> {
    return await this.buatAkunButton.isEnabled();
  }

  /**
   * Check if Buat Akun button is disabled (has disabled attribute or class)
   */
  async isBuatAkunDisabled(): Promise<boolean> {
    const isDisabled = await this.buatAkunButton.isDisabled();
    return isDisabled;
  }

  /**
   * Get all visible error messages
   */
  async getErrorMessages(): Promise<string[]> {
    const errors = await this.errorMessages.allTextContents();
    return errors.filter(e => e.trim() !== '');
  }

  /**
   * Wait for error message to appear
   */
  async waitForErrorMessage(expectedText: string): Promise<void> {
    await this.page.waitForSelector(`text=${expectedText}`, { timeout: 5000 });
  }

  /**
   * Verify all page elements are visible
   */
  async verifyPageElementsVisible(): Promise<void> {
    await expect(this.namaLengkapInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.phoneInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.buatAkunButton).toBeVisible();
    await expect(this.masukButton).toBeVisible();
  }

  /**
   * Check if Perseorangan radio is checked
   */
  async isPerseorangan(): Promise<boolean> {
    return await this.tipeBisnisPerseorangan.isChecked();
  }

  /**
   * Check if Badan Usaha radio is checked  
   */
  async isBadanUsaha(): Promise<boolean> {
    return await this.tipeBisnisBadanUsaha.isChecked();
  }

  /**
   * Complete signup flow
   */
  async signup(data: {
    namaLengkap: string;
    email: string;
    phone: string;
    tipeBisnis: 'perseorangan' | 'badan_usaha';
    password: string;
  }): Promise<void> {
    await this.fillSignupForm(data);
    await this.clickBuatAkun();
  }
}
