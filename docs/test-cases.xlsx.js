const ExcelJS = require('exceljs');

async function generateExcel() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Kiro';
  workbook.created = new Date();

  const sheet = workbook.addWorksheet('Test Cases', {
    views: [{ state: 'frozen', ySplit: 1 }]
  });

  // Define columns
  sheet.columns = [
    { header: 'Test ID', key: 'testId', width: 12 },
    { header: 'Title', key: 'title', width: 50 },
    { header: 'Priority', key: 'priority', width: 12 },
    { header: 'Type', key: 'type', width: 18 },
    { header: 'Preconditions', key: 'preconditions', width: 35 },
    { header: 'Test Steps', key: 'steps', width: 60 },
    { header: 'Test Data', key: 'testData', width: 40 },
    { header: 'Expected Results', key: 'expected', width: 45 },
    { header: 'Status', key: 'status', width: 12 },
  ];

  // Style header
  sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' } };
  sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF6B35' } };
  sheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };
  sheet.getRow(1).height = 25;

  // Test cases data
  const testCases = [
    {
      testId: 'TC-001',
      title: 'Verify all signup page elements are displayed correctly',
      priority: 'High',
      type: 'Smoke Test',
      preconditions: '- User has internet connection\n- Browser is supported',
      steps: '1. Navigate to https://business.flip.id/signup\n2. Verify page title and logo\n3. Verify all form fields are visible\n4. Verify "Buat Akun" button is visible\n5. Verify "Masuk" link is visible\n6. Verify Terms and Privacy links are visible',
      testData: 'N/A',
      expected: '- Page loads successfully\n- All elements are visible and properly aligned\n- Button "Buat Akun" is visible',
      status: 'Pass'
    },
    {
      testId: 'TC-002',
      title: 'User can signup successfully as Perseorangan',
      priority: 'Critical',
      type: 'Positive Test',
      preconditions: '- User has valid email not yet registered\n- User has valid Indonesian phone number',
      steps: '1. Navigate to signup page\n2. Enter valid Nama Lengkap\n3. Enter valid Email\n4. Enter valid Nomor HP\n5. Select "Perseorangan" as Tipe Bisnis\n6. Enter valid Kata Sandi\n7. Verify form filled correctly',
      testData: 'Nama: Test User Automation\nEmail: testuser+timestamp@example.com\nPhone: 81234567890\nTipe: Perseorangan\nPassword: Test@123456',
      expected: '- Form validation passes\n- All fields filled correctly\n- Perseorangan selected',
      status: 'Pass'
    },
    {
      testId: 'TC-003',
      title: 'User can signup successfully as Badan Usaha',
      priority: 'Critical',
      type: 'Positive Test',
      preconditions: '- User has valid business email\n- User has valid Indonesian phone number',
      steps: '1. Navigate to signup page\n2. Fill all fields with valid data\n3. Select "Badan Usaha" as Tipe Bisnis\n4. Verify form filled correctly',
      testData: 'Nama: PT Test Company Indonesia\nEmail: company+timestamp@example.com\nPhone: 82198765432\nTipe: Badan Usaha\nPassword: Company@123',
      expected: '- Form validation passes\n- Badan Usaha selected',
      status: 'Pass'
    },
    {
      testId: 'TC-004',
      title: 'Verify error messages for empty required fields',
      priority: 'High',
      type: 'Negative Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Leave all fields empty\n3. Click on each field and blur to trigger validation\n4. Verify button state',
      testData: 'All fields empty',
      expected: '- "Buat Akun" button remains disabled\n- Validation triggered on blur',
      status: 'Pass'
    },
    {
      testId: 'TC-005',
      title: 'Verify error message for invalid email format',
      priority: 'High',
      type: 'Negative Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Enter invalid email format\n3. Fill other fields with valid data\n4. Blur email field\n5. Verify validation',
      testData: 'Invalid emails:\n- plainaddress\n- @missinglocal.com\n- missing@domain\n- test@.com\n- test space@email.com\n- test@@email.com',
      expected: '- Error message or validation indicator shown\n- Form cannot be submitted with invalid email',
      status: 'Pass'
    },
    {
      testId: 'TC-006',
      title: 'Verify error message for invalid phone number',
      priority: 'High',
      type: 'Negative Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Enter invalid phone number\n3. Fill other fields with valid data\n4. Verify validation',
      testData: 'Invalid phones:\n- 123 (too short)\n- abcdefghij (letters)\n- 0812345678901234 (too long)\n- !@#$%^&*() (special chars)',
      expected: '- Error message for invalid phone number\n- Form validation fails',
      status: 'Pass'
    },
    {
      testId: 'TC-007',
      title: 'Verify error message for weak password',
      priority: 'High',
      type: 'Negative Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Enter weak password\n3. Fill other fields\n4. Verify password tips displayed',
      testData: 'Weak passwords:\n- 1234567 (< 8 chars)\n- password (no numbers)\n- 12345678 (no letters)\n- Pass word1 (has space)',
      expected: '- Password tips visible\n- Guidance shown for strong password',
      status: 'Pass'
    },
    {
      testId: 'TC-008',
      title: 'Verify password visibility toggle works',
      priority: 'Medium',
      type: 'Functional Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Enter password "Test@123"\n3. Verify password is masked (type=password)\n4. Click eye icon to show password\n5. Verify password is visible (type=text)\n6. Click eye icon again\n7. Verify password is masked again',
      testData: 'Password: Test@123',
      expected: '- Password toggles between visible and hidden\n- Input type changes between password and text',
      status: 'Pass'
    },
    {
      testId: 'TC-009',
      title: 'Verify "Masuk" button navigates to login page',
      priority: 'Medium',
      type: 'Navigation Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Click "Masuk" button\n3. Verify user is redirected',
      testData: 'N/A',
      expected: '- User navigates to login page or homepage\n- Login form is accessible',
      status: 'Pass'
    },
    {
      testId: 'TC-010',
      title: 'Verify Terms and Privacy links work',
      priority: 'Low',
      type: 'Navigation Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Verify "Syarat & Ketentuan" link has correct href\n3. Verify "Kebijakan Privasi" link has correct href\n4. Click Terms link\n5. Verify navigation to terms page',
      testData: 'N/A',
      expected: '- Links have correct href attributes\n- Links navigate to correct pages',
      status: 'Pass'
    },
    {
      testId: 'TC-011',
      title: 'Verify error for already registered email',
      priority: 'High',
      type: 'Negative Test',
      preconditions: 'Account with test email already exists',
      steps: '1. Navigate to signup page\n2. Fill form with already registered email\n3. Complete all other fields\n4. Click "Buat Akun"\n5. Verify error message',
      testData: 'Email: already.registered@example.com',
      expected: '- Error message indicates email already registered\n- User cannot create duplicate account',
      status: 'Skipped'
    },
    {
      testId: 'TC-012',
      title: 'Verify form fields handle very long input',
      priority: 'Medium',
      type: 'Boundary Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Enter very long text (500+ chars) in Nama\n3. Enter very long numbers in Phone\n4. Verify fields accept input',
      testData: 'Nama: 500+ characters\nPhone: 50+ digits',
      expected: '- Fields accept input\n- No crash or error',
      status: 'Pass'
    },
    {
      testId: 'TC-013',
      title: 'Verify business type selection toggle',
      priority: 'Medium',
      type: 'Functional Test',
      preconditions: 'User on signup page with form partially filled',
      steps: '1. Fill name, email, phone first\n2. Select Perseorangan\n3. Verify Perseorangan checked\n4. Select Badan Usaha\n5. Verify Badan Usaha checked\n6. Select Perseorangan again\n7. Verify toggle works correctly',
      testData: 'N/A',
      expected: '- Radio buttons toggle correctly\n- Only one option selected at a time',
      status: 'Pass'
    },
    {
      testId: 'TC-014',
      title: 'Verify correct placeholders are displayed',
      priority: 'Medium',
      type: 'UI Test',
      preconditions: 'User on signup page',
      steps: '1. Navigate to signup page\n2. Verify Nama placeholder\n3. Verify Email placeholder\n4. Verify Phone placeholder\n5. Verify Password placeholder',
      testData: 'N/A',
      expected: '- Nama: "Masukkan nama lengkap sesuai e-KTP/Paspor"\n- Email: "Masukkan alamat email bisnis"\n- Phone: "8123456789"\n- Password: "Buat kata sandi yang aman"',
      status: 'Pass'
    },
  ];

  // Add data rows
  testCases.forEach((tc, index) => {
    const row = sheet.addRow(tc);
    row.alignment = { vertical: 'top', wrapText: true };
    row.height = 80;
    
    // Alternate row colors
    if (index % 2 === 0) {
      row.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF5F5F5' } };
    }

    // Color status cell
    const statusCell = row.getCell('status');
    if (tc.status === 'Pass') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF90EE90' } };
    } else if (tc.status === 'Skipped') {
      statusCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFFFE0' } };
    }

    // Color priority cell
    const priorityCell = row.getCell('priority');
    if (tc.priority === 'Critical') {
      priorityCell.font = { bold: true, color: { argb: 'FFDC143C' } };
    } else if (tc.priority === 'High') {
      priorityCell.font = { bold: true, color: { argb: 'FFFF8C00' } };
    }
  });

  // Add borders
  sheet.eachRow((row) => {
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
  await workbook.xlsx.writeFile('D:\\flip\\docs\\Flip-Signup-Test-Cases.xlsx');
  console.log('Excel file created: D:\\flip\\docs\\Flip-Signup-Test-Cases.xlsx');
}

generateExcel();
