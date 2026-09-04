/**
 * Script to extract locators from Flip Signup page
 * Run: npx playwright test scripts/get-locators.ts
 */
import { chromium } from '@playwright/test';

async function getLocators() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://business.flip.id/signup');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Get all input elements
  console.log('\n=== INPUT ELEMENTS ===');
  const inputs = await page.locator('input').all();
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const placeholder = await input.getAttribute('placeholder') || '';
    const type = await input.getAttribute('type') || '';
    const name = await input.getAttribute('name') || '';
    const id = await input.getAttribute('id') || '';
    console.log(`Input ${i}: type="${type}" placeholder="${placeholder}" name="${name}" id="${id}"`);
  }

  // Get all buttons
  console.log('\n=== BUTTONS ===');
  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    const text = await btn.textContent() || '';
    const type = await btn.getAttribute('type') || '';
    console.log(`Button ${i}: "${text.trim()}" type="${type}"`);
  }

  // Get all links
  console.log('\n=== LINKS ===');
  const links = await page.locator('a').all();
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const text = await link.textContent() || '';
    const href = await link.getAttribute('href') || '';
    console.log(`Link ${i}: "${text.trim()}" href="${href}"`);
  }

  // Get radio buttons / business type
  console.log('\n=== RADIO/CHECKBOX ===');
  const radios = await page.locator('input[type="radio"], input[type="checkbox"]').all();
  for (let i = 0; i < radios.length; i++) {
    const radio = radios[i];
    const name = await radio.getAttribute('name') || '';
    const value = await radio.getAttribute('value') || '';
    const id = await radio.getAttribute('id') || '';
    console.log(`Radio ${i}: name="${name}" value="${value}" id="${id}"`);
  }

  // Get text containing business types
  console.log('\n=== BUSINESS TYPE OPTIONS ===');
  const perseorangan = await page.locator('text=Perseorangan').first().innerHTML().catch(() => 'not found');
  const badanUsaha = await page.locator('text=Badan Usaha').first().innerHTML().catch(() => 'not found');
  console.log(`Perseorangan: ${perseorangan}`);
  console.log(`Badan Usaha: ${badanUsaha}`);

  // Take screenshot
  await page.screenshot({ path: 'signup-page.png', fullPage: true });
  console.log('\nScreenshot saved to signup-page.png');

  // Keep browser open for manual inspection
  console.log('\nBrowser will close in 30 seconds...');
  await page.waitForTimeout(30000);
  
  await browser.close();
}

getLocators().catch(console.error);
