# Flip Business Signup - Playwright Automation

Automated UI testing project for Flip Business signup page using Playwright with TypeScript and Page Object Model (POM) pattern.

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Test Reports](#test-reports)
- [Test Cases Documentation](#test-cases-documentation)
- [Understanding the Code](#understanding-the-code)
- [Best Practices](#best-practices)

---

## 🎯 Project Overview

This project automates testing for the **Flip Business Signup** page at `https://business.flip.id/signup`. It includes 28 comprehensive test cases covering:
- ✅ Positive flows (successful registration)
- ❌ Negative flows (validation testing)
- 🔍 UI verification
- 🧭 Navigation testing
- ♿ Accessibility checks

## ✨ Features

- **TypeScript**: Strongly typed code for better maintainability
- **Page Object Model (POM)**: Organized, reusable page classes
- **28 Test Cases**: Comprehensive coverage of signup functionality
- **Screenshot Capture**: Screenshots for every test execution
- **PDF Test Report**: Professional test report with screenshots
- **Excel Test Cases**: Detailed test case documentation
- **Automatic Test Data**: Dynamic test data generation

---

## 📁 Project Structure

```
D:\flip\
├── src/
│   ├── pages/
│   │   └── signup.page.ts          # Page Object Model for Signup page
│   ├── fixtures/
│   │   └── base.fixture.ts         # Custom fixtures
│   ├── utils/
│   │   └── helpers.ts              # Helper functions
│   └── test-data/
│       └── test-data.ts            # Test data generator
├── tests/
│   └── signup.spec.ts              # Main test suite (28 test cases)
├── scripts/
│   ├── generate-pdf-report.js      # PDF report generator
│   └── generate-test-cases-excel.js # Excel test cases generator
├── test-cases/
│   └── Flip-Signup-Test-Cases-Detailed.xlsx  # Test case documentation
├── docs/
│   └── Test-Report.pdf             # Latest test execution report
├── test-results/                   # Test screenshots & results
├── playwright.config.ts            # Playwright configuration
├── package.json                    # Dependencies
└── README.md                       # This file
```

---

## 🔧 Prerequisites

Before running this project, ensure you have:

1. **Node.js** (v18 or higher)
   - Check: `node --version`
   - Download: https://nodejs.org/

2. **npm** (comes with Node.js)
   - Check: `npm --version`

3. **Git** (optional, for cloning)
   - Check: `git --version`

---

## 📦 Installation

### Step 1: Navigate to Project Directory

```powershell
cd D:\flip
```

### Step 2: Install Dependencies

```powershell
npm install
```

This will install:
- `@playwright/test` - Test framework
- `exceljs` - For Excel generation
- `pdfkit` - For PDF report generation
- All necessary dependencies

### Step 3: Install Playwright Browsers

```powershell
npx playwright install
```

---

## 🚀 Running Tests

### Run All Tests (Headless)

```powershell
npm test
```

- Runs in headless mode (no browser window)
- Fastest execution
- Best for CI/CD pipelines

### Run Tests in Headed Mode (See Browser)

```powershell
npm run test:headed
```

- Opens browser window
- Watch tests execute in real-time
- Best for debugging

### Run Tests in UI Mode (Interactive)

```powershell
npm run test:ui
```

- Opens Playwright UI
- Step through tests
- Time-travel debugging

### Run Specific Test

```powershell
npx playwright test --grep "TC-01"
```

Replace "TC-01" with any test case number or name.

### Debug Mode

```powershell
npx playwright test --debug
```

Opens Playwright Inspector for step-by-step debugging.

---

## 📊 Test Reports

### 1. Generate PDF Report

After running tests, generate PDF report:

```powershell
npm run report:pdf
```

**Output**: `D:\flip\docs\Test-Report.pdf`

The PDF includes:
- ✅ Test execution summary
- 📸 Screenshots for each test case
- 📈 Pass/Fail statistics
- ⏱️ Execution time
- 🎯 Success rate

### 2. View HTML Report

Playwright generates HTML report automatically:

```powershell
npx playwright show-report
```

Opens interactive HTML report in browser.

### 3. Excel Test Cases

View detailed test case documentation:

```powershell
Start-Process "D:\flip\test-cases\Flip-Signup-Test-Cases-Detailed.xlsx"
```

Or navigate to `test-cases/` folder and open the Excel file.

---

## 📝 Test Cases Documentation

### Excel File Structure

The `Flip-Signup-Test-Cases-Detailed.xlsx` contains:

| Column | Description |
|--------|-------------|
| **TC ID** | Test case identifier (TC-01 to TC-28) |
| **Test Case Title** | Descriptive test case name |
| **Category** | Test category (Positive Flow, Negative - Validation, UI Verification, etc.) |
| **Priority** | Critical, High, Medium, Low |
| **Pre-conditions** | Required state before test |
| **Test Steps** | Step-by-step execution instructions |
| **Test Data** | Input data used in test |
| **Expected Result** | What should happen |
| **Status** | Automated/Manual |

### Test Case Categories

| Category | Count | Description |
|----------|-------|-------------|
| **Positive Flow** | 2 | Successful registration scenarios |
| **Negative - Email Validation** | 6 | Invalid email format tests |
| **Negative - Phone Validation** | 4 | Invalid phone number tests |
| **Negative - Password Validation** | 6 | Password requirement tests |
| **UI Verification** | 2 | Page element checks |
| **Navigation** | 2 | Link and navigation tests |
| **Functional** | 2 | Feature functionality tests |
| **Negative - Business Logic** | 1 | Duplicate registration |
| **Boundary** | 1 | Edge case testing |
| **Accessibility** | 1 | A11y compliance |

---

## 💻 Understanding the Code

### 1. Page Object Model (POM)

**File**: `src/pages/signup.page.ts`

```typescript
export class SignupPage {
  // Locators - CSS selectors for page elements
  readonly nameInput = 'input[name="name"]';
  readonly emailInput = 'input[name="email"]';
  
  // Methods - Actions you can perform
  async fillForm(data: SignupData) {
    await this.page.fill(this.nameInput, data.name);
    // ...
  }
}
```

**Why POM?**
- ✅ Reusable code
- ✅ Easy maintenance (change locator in one place)
- ✅ Readable tests
- ✅ Separation of concerns

### 2. Test Structure

**File**: `tests/signup.spec.ts`

```typescript
test('TC-01: Verify Signup Page Elements Display', async ({ signupPage }) => {
  // Arrange - Setup
  await signupPage.goto();
  
  // Assert - Verify
  await expect(signupPage.page.locator('h1')).toBeVisible();
});
```

### 3. Test Data Generation

**File**: `src/test-data/test-data.ts`

```typescript
export const generateTestData = {
  uniqueEmail: () => `test.${Date.now()}@example.com`,
  validPhone: () => '081234567890',
  // ...
};
```

**Why?**
- ✅ Unique data per test run
- ✅ Avoid data conflicts
- ✅ Realistic test scenarios

### 4. Configuration

**File**: `playwright.config.ts`

Key settings:
```typescript
{
  use: {
    baseURL: 'https://business.flip.id',
    screenshot: 'on',  // Capture screenshots
    video: 'retain-on-failure',  // Video on failure
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ]
}
```

---

## 🏆 Best Practices

### ✅ DO:

1. **Run tests before pushing code**
   ```powershell
   npm test
   ```

2. **Check test report after execution**
   ```powershell
   npm run report:pdf
   ```

3. **Use descriptive test names**
   ```typescript
   test('TC-05: Validate Email Without @ and Domain', ...)
   ```

4. **Keep Page Objects updated**
   - When UI changes, update `signup.page.ts` only

5. **Add new tests for new features**
   - Follow existing test structure
   - Update test cases Excel

### ❌ DON'T:

1. **Don't hardcode test data**
   ```typescript
   // ❌ Bad
   await page.fill('input', 'test@example.com');
   
   // ✅ Good
   await page.fill('input', generateTestData.uniqueEmail());
   ```

2. **Don't use sleep/wait arbitrarily**
   ```typescript
   // ❌ Bad
   await page.waitForTimeout(5000);
   
   // ✅ Good
   await page.waitForSelector('button[type="submit"]');
   ```

3. **Don't skip failed tests**
   - Investigate and fix
   - Update if requirements changed

---

## 🔍 Troubleshooting

### Issue: Tests fail with "Timeout"

**Solution**:
```powershell
# Increase timeout in playwright.config.ts
timeout: 60000  # 60 seconds
```

### Issue: Browser not opening

**Solution**:
```powershell
npx playwright install --with-deps
```

### Issue: Screenshots not captured

**Solution**:
Check `playwright.config.ts`:
```typescript
screenshot: 'on'  // Must be 'on', not 'only-on-failure'
```

### Issue: PDF report empty

**Solution**:
1. Run tests first: `npm test`
2. Then generate report: `npm run report:pdf`

---

## 📞 Support

For questions or issues:
1. Check test execution logs in `test-results/`
2. Review Playwright documentation: https://playwright.dev/
3. Check test case documentation in `test-cases/` folder

---

## 📜 Commands Cheat Sheet

```powershell
# Installation
npm install                          # Install dependencies
npx playwright install               # Install browsers

# Running Tests
npm test                            # Run all tests (headless)
npm run test:headed                 # Run with browser visible
npm run test:ui                     # Run in UI mode
npx playwright test --debug         # Debug mode
npx playwright test --grep "TC-01"  # Run specific test

# Reports
npm run report:pdf                  # Generate PDF report
npx playwright show-report          # Show HTML report

# Utilities
node scripts/generate-test-cases-excel.js  # Generate Excel test cases
```

---

## 🎓 Learning Resources

- **Playwright Docs**: https://playwright.dev/docs/intro
- **TypeScript**: https://www.typescriptlang.org/docs/
- **Page Object Model**: https://playwright.dev/docs/pom
- **Best Practices**: https://playwright.dev/docs/best-practices

---

## 📄 License

This project is for testing purposes for Flip Business signup functionality.

---

**Happy Testing! 🚀**
