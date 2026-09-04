const ExcelJS = require('exceljs');
const path = require('path');

async function generateTestCasesExcel() {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Cases');

  // Define columns
  worksheet.columns = [
    { header: 'TC ID', key: 'tcId', width: 12 },
    { header: 'Test Case Title', key: 'title', width: 50 },
    { header: 'Category', key: 'category', width: 20 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Pre-conditions', key: 'preconditions', width: 40 },
    { header: 'Test Steps', key: 'steps', width: 60 },
    { header: 'Test Data', key: 'testData', width: 40 },
    { header: 'Expected Result', key: 'expected', width: 50 },
    { header: 'Status', key: 'status', width: 15 },
  ];

  // Style header
  worksheet.getRow(1).font = { bold: true, size: 11 };
  worksheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }
  };
  worksheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
  worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

  // Test cases data
  const testCases = [
    {
      tcId: 'TC-01',
      title: 'Verify Signup Page Elements Display',
      category: 'UI Verification',
      priority: 'High',
      preconditions: 'Browser is open and navigated to https://business.flip.id/signup',
      steps: '1. Navigate to signup page\n2. Verify all page elements are visible\n3. Check header, logo, form fields, buttons, and links',
      testData: 'N/A',
      expected: 'All signup page elements (logo, title, form fields, business type options, submit button, login link, terms links) are displayed correctly',
      status: 'Automated'
    },
    {
      tcId: 'TC-02',
      title: 'Submit Valid Data as Individual',
      category: 'Positive Flow',
      priority: 'Critical',
      preconditions: 'User is on signup page, Perseorangan option is selected',
      steps: '1. Enter valid name\n2. Enter valid unique email\n3. Enter valid phone number (10-13 digits)\n4. Enter valid password (min 8 chars, uppercase, lowercase, number, special char)\n5. Click Daftar Sekarang button',
      testData: 'Name: "John Doe"\nEmail: "john.doe.test@example.com"\nPhone: "081234567890"\nPassword: "Test@123"',
      expected: 'Form is submitted successfully, user is registered as Individual business type',
      status: 'Automated'
    },
    {
      tcId: 'TC-03',
      title: 'Submit Valid Data as Business Entity',
      category: 'Positive Flow',
      priority: 'Critical',
      preconditions: 'User is on signup page, Badan Usaha option is selected',
      steps: '1. Select Badan Usaha radio button\n2. Enter valid name\n3. Enter valid unique email\n4. Enter valid phone number (10-13 digits)\n5. Enter valid password (min 8 chars, uppercase, lowercase, number, special char)\n6. Click Daftar Sekarang button',
      testData: 'Business Type: "Badan Usaha"\nName: "PT Test Company"\nEmail: "company.test@example.com"\nPhone: "081234567890"\nPassword: "Test@123"',
      expected: 'Form is submitted successfully, user is registered as Business Entity',
      status: 'Automated'
    },
    {
      tcId: 'TC-04',
      title: 'Validate Empty Required Fields',
      category: 'Negative - Validation',
      priority: 'High',
      preconditions: 'User is on signup page',
      steps: '1. Leave all fields empty\n2. Click Daftar Sekarang button\n3. Observe validation messages',
      testData: 'All fields: empty',
      expected: 'Form is not submitted, validation errors shown for all required fields',
      status: 'Automated'
    },
    {
      tcId: 'TC-05',
      title: 'Validate Email Without @ and Domain',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email without @ symbol and domain\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "invalidemail"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-06',
      title: 'Validate Email Without Local Part',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email with @ but no local part\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "@example.com"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-07',
      title: 'Validate Email Without TLD',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email without top-level domain\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "test@example"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-08',
      title: 'Validate Email Without Domain Name',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email without domain name but with @\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "test@.com"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-09',
      title: 'Validate Email Containing Spaces',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email with spaces\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "test user@example.com"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-10',
      title: 'Validate Email With Double @ Symbol',
      category: 'Negative - Email Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter email with double @ symbol\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Email: "test@@example.com"',
      expected: 'Email validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-11',
      title: 'Validate Phone Number Too Short',
      category: 'Negative - Phone Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter phone number with less than 10 digits\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Phone: "0812345"',
      expected: 'Phone number validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-12',
      title: 'Validate Phone Number With Letters',
      category: 'Negative - Phone Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter phone number containing letters\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Phone: "081234ABC90"',
      expected: 'Phone number validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-13',
      title: 'Validate Phone Number Too Long',
      category: 'Negative - Phone Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter phone number with more than 13 digits\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Phone: "08123456789012345"',
      expected: 'Phone number validation error is triggered or input is limited to 13 digits',
      status: 'Automated'
    },
    {
      tcId: 'TC-14',
      title: 'Validate Phone Number With Special Characters',
      category: 'Negative - Phone Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter phone number with special characters\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Phone: "0812-345-6789"',
      expected: 'Phone number validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-15',
      title: 'Validate Password Less Than 8 Characters',
      category: 'Negative - Password Validation',
      priority: 'High',
      preconditions: 'User is on signup page',
      steps: '1. Enter password with less than 8 characters\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "Test@1"',
      expected: 'Password validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-16',
      title: 'Validate Password Without Numbers or Special Chars',
      category: 'Negative - Password Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter password without numbers and special characters\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "TestPassword"',
      expected: 'Password validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-17',
      title: 'Validate Password Without Letters or Special Chars',
      category: 'Negative - Password Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter password without letters and special characters\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "12345678"',
      expected: 'Password validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-18',
      title: 'Validate Password Containing Spaces',
      category: 'Negative - Password Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter password with spaces\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "Test @123"',
      expected: 'Password validation error is triggered',
      status: 'Automated'
    },
    {
      tcId: 'TC-19',
      title: 'Validate Password With Only Lowercase',
      category: 'Negative - Password Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter password with only lowercase letters, numbers, and special chars\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "test@123"',
      expected: 'Password validation error is triggered (requires uppercase)',
      status: 'Automated'
    },
    {
      tcId: 'TC-20',
      title: 'Validate Password With Only Uppercase',
      category: 'Negative - Password Validation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Enter password with only uppercase letters, numbers, and special chars\n2. Fill other valid data\n3. Attempt to submit',
      testData: 'Password: "TEST@123"',
      expected: 'Password validation error is triggered (requires lowercase)',
      status: 'Automated'
    },
    {
      tcId: 'TC-21',
      title: 'Verify Password Visibility Toggle',
      category: 'Functional',
      priority: 'Medium',
      preconditions: 'User is on signup page, password is entered',
      steps: '1. Enter password in password field\n2. Click on show/hide password toggle icon\n3. Observe password visibility change\n4. Click toggle again',
      testData: 'Password: "Test@123"',
      expected: 'Password toggles between visible (text) and hidden (dots/asterisks) when clicking toggle icon',
      status: 'Automated'
    },
    {
      tcId: 'TC-22',
      title: 'Verify Login Page Navigation',
      category: 'Navigation',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Locate "Masuk" link on signup page\n2. Click on "Masuk" link\n3. Verify navigation to login page',
      testData: 'N/A',
      expected: 'User is redirected to login page when clicking "Masuk" link',
      status: 'Automated'
    },
    {
      tcId: 'TC-23',
      title: 'Verify Terms and Privacy Policy Links',
      category: 'Navigation',
      priority: 'Low',
      preconditions: 'User is on signup page',
      steps: '1. Locate "Syarat & Ketentuan" and "Kebijakan Privasi" links\n2. Verify links are clickable and have correct href attributes',
      testData: 'N/A',
      expected: 'Both "Syarat & Ketentuan" and "Kebijakan Privasi" links are present and functional',
      status: 'Automated'
    },
    {
      tcId: 'TC-24',
      title: 'Validate Duplicate Email Registration',
      category: 'Negative - Business Logic',
      priority: 'High',
      preconditions: 'Email is already registered in the system',
      steps: '1. Enter email that is already registered\n2. Fill other valid data\n3. Click Daftar Sekarang button\n4. Observe error message',
      testData: 'Email: already.registered@example.com',
      expected: 'Error message is displayed indicating email is already registered',
      status: 'Automated'
    },
    {
      tcId: 'TC-25',
      title: 'Validate Long Input Handling',
      category: 'Boundary',
      priority: 'Low',
      preconditions: 'User is on signup page',
      steps: '1. Enter very long strings in all input fields\n2. Verify input handling and field limits',
      testData: 'All fields: 100+ character strings',
      expected: 'System handles long inputs gracefully (truncates, shows error, or accepts within limits)',
      status: 'Automated'
    },
    {
      tcId: 'TC-26',
      title: 'Verify Business Type Selection Toggle',
      category: 'Functional',
      priority: 'High',
      preconditions: 'User is on signup page',
      steps: '1. Verify Perseorangan is selected by default\n2. Click Badan Usaha radio button\n3. Verify selection changes\n4. Click Perseorangan again\n5. Verify selection changes back',
      testData: 'N/A',
      expected: 'Business type selection toggles correctly between Perseorangan and Badan Usaha',
      status: 'Automated'
    },
    {
      tcId: 'TC-27',
      title: 'Verify Input Placeholder Text',
      category: 'UI Verification',
      priority: 'Low',
      preconditions: 'User is on signup page',
      steps: '1. Observe placeholder text in all input fields\n2. Verify placeholder text is helpful and correct',
      testData: 'N/A',
      expected: 'All input fields display appropriate placeholder text',
      status: 'Automated'
    },
    {
      tcId: 'TC-28',
      title: 'Verify Form Input Names for Accessibility',
      category: 'Accessibility',
      priority: 'Medium',
      preconditions: 'User is on signup page',
      steps: '1. Inspect form input elements\n2. Verify each input has proper "name" attribute\n3. Check for accessibility compliance',
      testData: 'N/A',
      expected: 'All form inputs have proper name attributes (name, email, phone_number, password, business_type)',
      status: 'Automated'
    }
  ];

  // Add test cases
  testCases.forEach((tc, index) => {
    const row = worksheet.addRow(tc);
    
    // Set row height for better readability
    row.height = 60;
    
    // Enable text wrapping
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });

    // Color coding by category
    if (tc.category.includes('Positive')) {
      row.getCell('category').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' }
      };
    } else if (tc.category.includes('Negative')) {
      row.getCell('category').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC7CE' }
      };
    } else if (tc.category.includes('UI') || tc.category.includes('Navigation')) {
      row.getCell('category').fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFEB9C' }
      };
    }

    // Priority color coding
    const priorityCell = row.getCell('priority');
    if (tc.priority === 'Critical') {
      priorityCell.font = { color: { argb: 'FFC00000' }, bold: true };
    } else if (tc.priority === 'High') {
      priorityCell.font = { color: { argb: 'FFFF0000' }, bold: true };
    } else if (tc.priority === 'Medium') {
      priorityCell.font = { color: { argb: 'FFFFA500' } };
    }

    // Status color
    row.getCell('status').fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF92D050' }
    };
  });

  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  });

  // Save file
  const outputPath = path.join(__dirname, '..', 'test-cases', 'Flip-Signup-Test-Cases-Detailed.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  
  console.log(`✅ Test Cases Excel generated: ${outputPath}`);
  console.log(`   📋 Total Test Cases: ${testCases.length}`);
  console.log(`   ├─ Critical: ${testCases.filter(tc => tc.priority === 'Critical').length}`);
  console.log(`   ├─ High: ${testCases.filter(tc => tc.priority === 'High').length}`);
  console.log(`   ├─ Medium: ${testCases.filter(tc => tc.priority === 'Medium').length}`);
  console.log(`   └─ Low: ${testCases.filter(tc => tc.priority === 'Low').length}`);
}

generateTestCasesExcel().catch(console.error);
