# Flip Business Signup - Playwright Automation

Automated UI testing project for Flip Business signup page using **Playwright** with **TypeScript** and **Page Object Model (POM)** pattern.

## 🎯 Project Overview

| Item | Detail |
|------|--------|
| **Target URL** | https://business.flip.id/signup |
| **Framework** | Playwright |
| **Language** | TypeScript |
| **Pattern** | Page Object Model (POM) |
| **Test Cases** | 14 TC (TC-01 to TC-14) |

### Test Coverage

- ✅ **Positive Flow** - Valid signup for Perseorangan & Badan Usaha
- ❌ **Negative Flow** - Email, Phone, Password validation
- 🔧 **Functional** - Password toggle, business type selection
- 🧭 **Navigation** - Login redirect, Terms & Privacy links

---

## 📁 Project Structure

```
flip/
├── src/
│   └── pages/
│       └── signup.page.ts          # Page Object Model
├── tests/
│   └── signup.spec.ts              # 14 Test Cases
├── scripts/
│   ├── generate-report-pdf.ts      # PDF Report Generator
│   └── generate-test-cases.ts      # Excel Test Cases Generator
├── test-cases/
│   └── Flip-Signup-Test-Cases.xlsx # Test Case Documentation
├── docs/
│   └── Test-Report.pdf             # Generated Test Report
├── playwright.config.ts            # Playwright Configuration
├── tsconfig.json                   # TypeScript Configuration
└── package.json                    # Dependencies
```

---

## 🔧 Prerequisites

- **Node.js** v18 or higher
- **npm** (comes with Node.js)

---

## 📦 Installation

```bash
# Clone repository
git clone https://github.com/dqnewcode/flip.git
cd flip

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

---

## 🚀 Running Tests

```bash
# Run all tests (headless)
npm test

# Run with browser visible
npm run test:headed

# Run in interactive UI mode
npm run test:ui

# Run in debug mode
npm run test:debug

# Run specific test
npx playwright test --grep "TC-01"
```

---

## 📊 Generate Reports

```bash
# Generate PDF report with screenshots
npm run report

# Generate Excel test cases
npm run generate:testcases

# View Playwright HTML report
npm run report:html
```

### Report Outputs

| Report | Location |
|--------|----------|
| PDF Report | `docs/Test-Report.pdf` |
| Excel Test Cases | `test-cases/Flip-Signup-Test-Cases.xlsx` |
| HTML Report | Run `npm run report:html` |

---

## 📝 Test Cases

| TC ID | Test Case | Category | Priority |
|-------|-----------|----------|----------|
| TC-01 | Verify Signup Page Elements Display | UI | High |
| TC-02 | Submit Valid Signup Form - Perseorangan | Positive | Critical |
| TC-03 | Submit Valid Signup Form - Badan Usaha | Positive | Critical |
| TC-04 | Validate Empty Form Submission | Negative | High |
| TC-05 | Validate Invalid Email Format | Negative | Medium |
| TC-06 | Validate Email Without Domain | Negative | Medium |
| TC-07 | Validate Short Phone Number | Negative | Medium |
| TC-08 | Validate Phone Number With Letters | Negative | Medium |
| TC-09 | Validate Weak Password | Negative | High |
| TC-10 | Validate Password Without Special Chars | Negative | Medium |
| TC-11 | Toggle Password Visibility | Functional | Medium |
| TC-12 | Navigate To Login Page | Navigation | Medium |
| TC-13 | Verify Terms And Conditions Link | Navigation | Low |
| TC-14 | Verify Privacy Policy Link | Navigation | Low |

---

## 💻 Code Structure

### Page Object Model (`src/pages/signup.page.ts`)

```typescript
export class SignupPage {
  // Locators
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly submitButton: Locator;
  
  // Actions
  async fillSignupForm(data: SignupData) { ... }
  async clickSubmit() { ... }
  async verifyAllElementsPresent() { ... }
}
```

### Test Example (`tests/signup.spec.ts`)

```typescript
test('TC-01: Verify Signup Page Elements Display', async ({ page }) => {
  const signupPage = new SignupPage(page);
  const elements = await signupPage.verifyAllElementsPresent();
  
  expect(elements.nameInput).toBe(true);
  expect(elements.emailInput).toBe(true);
  expect(elements.submitButton).toBe(true);
});
```

---

## 📜 Available Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless) |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Interactive UI mode |
| `npm run test:debug` | Debug mode |
| `npm run report` | Generate PDF report |
| `npm run generate:testcases` | Generate Excel test cases |
| `npm run report:html` | View HTML report |

---

## ✨ Features

- **Full TypeScript** - Type-safe code throughout
- **Page Object Model** - Clean separation of concerns
- **14 Test Cases** - Comprehensive coverage
- **PDF Reports** - Professional test reports with screenshots
- **Excel Documentation** - Detailed test case documentation
- **Unique Test Data** - Timestamp-based email generation

---

## 🎓 Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Page Object Model](https://playwright.dev/docs/pom)

---

## 📄 License

This project is for testing purposes for Flip Business signup functionality.
