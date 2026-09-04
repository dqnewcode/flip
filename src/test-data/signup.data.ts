/**
 * Test Data for Signup Page Tests
 */

// Generate unique email using timestamp
export const generateUniqueEmail = (prefix: string = 'testuser'): string => {
  const timestamp = Date.now();
  return `${prefix}+${timestamp}@example.com`;
};

// Valid test data
export const validSignupData = {
  perseorangan: {
    namaLengkap: 'Test User Automation',
    email: generateUniqueEmail('testuser'),
    phone: '81234567890',
    tipeBisnis: 'perseorangan' as const,
    password: 'Test@123456'
  },
  badanUsaha: {
    namaLengkap: 'PT Test Company Indonesia',
    email: generateUniqueEmail('company'),
    phone: '82198765432',
    tipeBisnis: 'badan_usaha' as const,
    password: 'Company@123'
  }
};

// Invalid email test data
export const invalidEmails = [
  { value: 'plainaddress', description: 'Missing @ and domain' },
  { value: '@missinglocal.com', description: 'Missing local part' },
  { value: 'missing@domain', description: 'Missing TLD' },
  { value: 'test@.com', description: 'Missing domain name' },
  { value: 'test space@email.com', description: 'Contains space' },
  { value: 'test@@email.com', description: 'Double @ symbol' },
];

// Invalid phone test data
export const invalidPhones = [
  { value: '123', description: 'Too short (3 digits)' },
  { value: 'abcdefghij', description: 'Contains letters' },
  { value: '0812345678901234', description: 'Too long (16 digits)' },
  { value: '!@#$%^&*()', description: 'Special characters only' },
];

// Weak password test data
export const weakPasswords = [
  { value: '1234567', description: 'Less than 8 characters' },
  { value: 'password', description: 'No numbers or special chars' },
  { value: '12345678', description: 'No letters or special chars' },
  { value: 'Pass word1', description: 'Contains space' },
  { value: 'abcdefgh', description: 'Only lowercase letters' },
  { value: 'ABCDEFGH', description: 'Only uppercase letters' },
];

// Strong password examples
export const strongPasswords = [
  'Test@123456',
  'Secure#Pass1',
  'MyP@ssw0rd!',
  'Str0ng$ecret',
];

// Boundary test data
export const boundaryTestData = {
  veryLongName: 'A'.repeat(500),
  veryLongEmail: 'a'.repeat(100) + '@' + 'b'.repeat(100) + '.com',
  veryLongPhone: '8'.repeat(50),
  minValidName: 'AB',
  minValidPhone: '81234567890', // typical Indonesian phone
};

// Field labels (Indonesian)
export const fieldLabels = {
  namaLengkap: 'Nama Lengkap',
  email: 'Email',
  nomorHp: 'Nomor HP',
  tipeBisnis: 'Tipe Bisnis',
  kataSandi: 'Kata Sandi',
};

// Expected error messages (adjust based on actual application)
export const expectedErrors = {
  requiredField: 'wajib diisi',
  invalidEmail: 'email tidak valid',
  invalidPhone: 'nomor tidak valid',
  weakPassword: 'kata sandi terlalu lemah',
  emailExists: 'email sudah terdaftar',
};
