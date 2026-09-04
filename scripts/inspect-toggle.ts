import { chromium } from '@playwright/test';

async function inspectToggle() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  await page.goto('https://business.flip.id/signup');
  await page.waitForLoadState('networkidle');

  // Find elements near password input
  console.log('\n=== PASSWORD FIELD PARENT STRUCTURE ===');
  const pwdParent = await page.locator('input[name="password"]').locator('..').innerHTML();
  console.log(pwdParent);

  console.log('\n=== ALL BUTTONS ===');
  const buttons = await page.locator('button').all();
  for (let i = 0; i < buttons.length; i++) {
    const html = await buttons[i].innerHTML();
    const type = await buttons[i].getAttribute('type') || '';
    console.log(`Button ${i} (type=${type}):`, html.substring(0, 100));
  }

  console.log('\n=== SVG ELEMENTS ===');
  const svgs = await page.locator('svg').count();
  console.log(`Found ${svgs} SVG elements`);

  // Find clickable elements near password
  console.log('\n=== ELEMENTS NEAR PASSWORD ===');
  const nearPwd = await page.locator('input[name="password"]').locator('xpath=following-sibling::*').all();
  for (let i = 0; i < nearPwd.length; i++) {
    const tag = await nearPwd[i].evaluate(el => el.tagName);
    console.log(`Sibling ${i}: ${tag}`);
  }

  await page.waitForTimeout(30000);
  await browser.close();
}

inspectToggle().catch(console.error);
