import ExcelJS from 'exceljs';
import path from 'path';

// Interfaces
interface TestCase {
  tcId: string;
  title: string;
  category: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  preconditions: string;
  steps: string;
  testData: string;
  expected: string;
  status: string;
}

// Test cases based on actual page analysis
const testCases: TestCase[] = [
  {
    tcId: 'TC-01',
    title: 'Verify Signup Page Elements Display',
    category: 'UI Verification',
    priority: 'High',
    preconditions: 'User navigates to https://business.flip.id/signup',
    steps: `1. Open signup page
2. Verify all elements are visible:
   - Name input field
   - Email input field
   - Phone number input field
   - Business type radio buttons (Perseorangan & Badan Usaha)
   - Password input field
   - "Buat Akun" button
   - "Masuk" button
   - Terms & Privacy links`,
    testData: 'N/A',
    expected: 'All signup page elements are displayed correctly',
    status: 'Automated',
  },
  {
    tcId: 'TC-02',
    title: 'Submit Valid Signup Form - Perseorangan',
    category: 'Positive',
    priority: 'Critical',
    preconditions: 'User is on signup page',
    steps: `1. Select "Perseorangan" business type
2. Enter valid name
3. Enter valid unique email
4. Enter valid phone number
5. Enter valid password
6. Click "Buat Akun" button`,
    testData: `Name: "John Doe"
Email: "john.test.{timestamp}@example.com"
Phone: "81234567890"
Password: "Test@1234"
Business Type: Perseorangan (value=2)`,
    expected: 'Form submits successfully, user account is created',
    status: 'Automated',
  },
  {
    tcId: 'TC-03',
    title: 'Submit Valid Signup Form - Badan Usaha',
    category: 'Positive',
    priority: 'Critical',
    preconditions: 'User is on signup page',
    steps: `1. Select "Badan Usaha" business type
2. Enter valid company name
3. Enter valid unique email
4. Enter valid phone number
5. Enter valid password
6. Click "Buat Akun" button`,
    testData: `Name: "PT Test Company"
Email: "company.test.{timestamp}@example.com"
Phone: "81234567890"
Password: "Test@1234"
Business Type: Badan Usaha (value=3)`,
    expected: 'Form submits successfully, business account is created',
    status: 'Automated',
  },
  {
    tcId: 'TC-04',
    title: 'Validate Empty Form Submission',
    category: 'Negative - Validation',
    priority: 'High',
    preconditions: 'User is on signup page',
    steps: `1. Leave all fields empty
2. Click "Buat Akun" button
3. Observe validation behavior`,
    testData: 'All fields: empty',
    expected: 'Form does not submit. Submit button is disabled when form is invalid',
    status: 'Automated',
  },
  {
    tcId: 'TC-05',
    title: 'Validate Invalid Email Format',
    category: 'Negative - Email',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except email
2. Enter invalid email (no @ symbol)
3. Click "Buat Akun" button`,
    testData: 'Email: "invalidemail"',
    expected: 'Email validation error is triggered',
    status: 'Automated',
  },
  {
    tcId: 'TC-06',
    title: 'Validate Email Without Domain',
    category: 'Negative - Email',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except email
2. Enter email without domain
3. Click "Buat Akun" button`,
    testData: 'Email: "test@"',
    expected: 'Email validation error is triggered',
    status: 'Automated',
  },
  {
    tcId: 'TC-07',
    title: 'Validate Short Phone Number',
    category: 'Negative - Phone',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except phone
2. Enter phone number less than 10 digits
3. Click "Buat Akun" button`,
    testData: 'Phone: "812345"',
    expected: 'Phone validation error is triggered',
    status: 'Automated',
  },
  {
    tcId: 'TC-08',
    title: 'Validate Phone Number With Letters',
    category: 'Negative - Phone',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except phone
2. Enter phone number with letters
3. Click "Buat Akun" button`,
    testData: 'Phone: "081ABC567"',
    expected: 'Phone validation error is triggered or letters are not accepted (input mask)',
    status: 'Automated',
  },
  {
    tcId: 'TC-09',
    title: 'Validate Weak Password',
    category: 'Negative - Password',
    priority: 'High',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except password
2. Enter weak password (less than 8 characters)
3. Click "Buat Akun" button`,
    testData: 'Password: "Test1"',
    expected: 'Password validation error is triggered or submit button remains disabled',
    status: 'Automated',
  },
  {
    tcId: 'TC-10',
    title: 'Validate Password Without Special Characters',
    category: 'Negative - Password',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Fill all fields with valid data except password
2. Enter password without special characters
3. Click "Buat Akun" button`,
    testData: 'Password: "Test12345"',
    expected: 'Password validation error if special characters are required',
    status: 'Automated',
  },
  {
    tcId: 'TC-11',
    title: 'Toggle Password Visibility',
    category: 'Functional',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Enter password in password field
2. Click password visibility toggle button
3. Observe password visibility
4. Click toggle again`,
    testData: 'Password: "Test@1234"',
    expected: 'Password visibility toggles between visible and hidden',
    status: 'Automated',
  },
  {
    tcId: 'TC-12',
    title: 'Navigate To Login Page',
    category: 'Navigation',
    priority: 'Medium',
    preconditions: 'User is on signup page',
    steps: `1. Locate "Masuk" button
2. Click "Masuk" button
3. Verify redirect`,
    testData: 'N/A',
    expected: 'User is redirected to login page',
    status: 'Automated',
  },
  {
    tcId: 'TC-13',
    title: 'Verify Terms And Conditions Link',
    category: 'Navigation',
    priority: 'Low',
    preconditions: 'User is on signup page',
    steps: `1. Locate "Syarat & Ketentuan" link
2. Verify link has correct href attribute
3. Click link (opens in new tab)`,
    testData: 'Expected URL: https://flip.id/business/terms-and-conditions#tnc',
    expected: 'Terms page opens in new tab',
    status: 'Automated',
  },
  {
    tcId: 'TC-14',
    title: 'Verify Privacy Policy Link',
    category: 'Navigation',
    priority: 'Low',
    preconditions: 'User is on signup page',
    steps: `1. Locate "Kebijakan Privasi" link
2. Verify link has correct href attribute
3. Click link (opens in new tab)`,
    testData: 'Expected URL: https://flip.id/business/terms-and-conditions#policy',
    expected: 'Privacy policy page opens in new tab',
    status: 'Automated',
  },
];

async function generateTestCasesExcel(): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Test Cases');

  // Define columns
  worksheet.columns = [
    { header: 'TC ID', key: 'tcId', width: 10 },
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
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' },
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

  // Add test cases to worksheet
  testCases.forEach((tc, index) => {
    const row = worksheet.addRow(tc);

    // Set row height
    row.height = 60;

    // Enable text wrapping
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
    });

    // Color coding by category
    const categoryCell = row.getCell('category');
    if (tc.category.includes('Positive')) {
      categoryCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFC6EFCE' },
      };
    } else if (tc.category.includes('Negative')) {
      categoryCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFC7CE' },
      };
    } else if (tc.category.includes('UI') || tc.category.includes('Navigation')) {
      categoryCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFEB9C' },
      };
    } else if (tc.category.includes('Functional')) {
      categoryCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD9E1F2' },
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
      fgColor: { argb: 'FF92D050' },
    };
  });

  // Add borders to all cells
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    });
  });

  // Save file
  const outputPath = path.join(__dirname, '..', 'test-cases', 'Flip-Signup-Test-Cases.xlsx');
  await workbook.xlsx.writeFile(outputPath);

  console.log(`✅ Test Cases Excel generated: ${outputPath}`);
  console.log(`   📋 Total Test Cases: ${testCases.length}`);
  console.log(`   ├─ Critical: ${testCases.filter((tc) => tc.priority === 'Critical').length}`);
  console.log(`   ├─ High: ${testCases.filter((tc) => tc.priority === 'High').length}`);
  console.log(`   ├─ Medium: ${testCases.filter((tc) => tc.priority === 'Medium').length}`);
  console.log(`   └─ Low: ${testCases.filter((tc) => tc.priority === 'Low').length}`);
}

generateTestCasesExcel().catch(console.error);
