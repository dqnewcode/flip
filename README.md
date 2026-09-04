# Flip Business UI Automation

Playwright UI Automation project for [Flip for Business](https://business.flip.id) signup page.

## Tech Stack

- **Playwright** - Modern end-to-end testing framework
- **TypeScript** - Type-safe JavaScript
- **Page Object Model** - Design pattern for maintainable tests

## Project Structure

```
flip/
├── docs/                    # Documentation
│   └── TEST-CASES.md        # Test case specifications
├── src/
│   ├── fixtures/            # Test fixtures
│   │   └── test.fixture.ts
│   ├── pages/               # Page Object Models
│   │   └── signup.page.ts
│   ├── test-data/           # Test data
│   │   └── signup.data.ts
│   └── utils/               # Utility functions
│       └── helpers.ts
├── tests/                   # Test files
│   └── signup.spec.ts
├── playwright.config.ts     # Playwright configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install chromium
```

### Running Tests

```bash
# Run all tests
npm test

# Run tests with browser visible
npm run test:headed

# Run tests in UI mode (interactive)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run only Chrome tests
npm run test:chrome

# Open test report
npm run report
```

### Code Generation

Use Playwright codegen to record interactions:

```bash
npm run codegen
```

## Test Cases

See [docs/TEST-CASES.md](docs/TEST-CASES.md) for complete test case documentation.

| Test ID | Description | Priority |
|---------|-------------|----------|
| TC-001 | Verify page elements | High |
| TC-002 | Signup as Perseorangan | Critical |
| TC-003 | Signup as Badan Usaha | Critical |
| TC-004 | Empty field validation | High |
| TC-005 | Invalid email validation | High |
| TC-006 | Invalid phone validation | High |
| TC-007 | Weak password validation | High |
| TC-008 | Password visibility toggle | Medium |
| TC-009 | Navigation to login | Medium |
| TC-010 | Terms & Privacy links | Low |
| TC-011 | Duplicate email | High |
| TC-012 | Character limits | Medium |

## Best Practices Used

1. **Page Object Model (POM)** - Encapsulates page elements and interactions
2. **Custom Fixtures** - Reusable test setup with page objects
3. **Data-Driven Testing** - External test data for easy maintenance
4. **Robust Locators** - Uses role-based and placeholder selectors
5. **Proper Waits** - Network idle and element visibility checks
6. **Test Isolation** - Each test runs independently
7. **Comprehensive Reporting** - HTML, JSON, and list reporters

## Configuration

Edit `playwright.config.ts` to customize:

- Base URL
- Timeout settings
- Browser configurations
- Screenshot/video capture
- Retry settings

## Contributing

1. Create feature branch
2. Write tests following POM pattern
3. Update test documentation
4. Run all tests before PR
5. Submit PR for review
