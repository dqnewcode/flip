# Test Cases - Flip Business Signup Page

**URL:** https://business.flip.id/signup  
**Module:** User Registration  
**Last Updated:** September 2026

---

## Overview

Halaman signup Flip for Business memiliki form dengan field:
- Nama Lengkap (required)
- Email (required)
- Nomor HP dengan prefix +62 (required)
- Tipe Bisnis - Radio button: Perseorangan / Badan Usaha (required)
- Kata Sandi dengan toggle visibility (required)
- Button "Buat Akun"

---

## Test Scenarios

### TC-001: Verify Signup Page Elements

| Field | Value |
|-------|-------|
| **Test ID** | TC-001 |
| **Title** | Verify all signup page elements are displayed correctly |
| **Priority** | High |
| **Type** | Smoke Test |

**Preconditions:**
- User has internet connection
- Browser is supported (Chrome, Firefox, Safari)

**Test Steps:**
1. Navigate to https://business.flip.id/signup
2. Verify page title and logo
3. Verify all form fields are visible
4. Verify "Buat Akun" button is visible but disabled
5. Verify "Masuk" link is visible
6. Verify "Syarat & Ketentuan" and "Kebijakan Privasi" links are visible

**Expected Results:**
- Page loads successfully
- All elements are visible and properly aligned
- Button "Buat Akun" is disabled by default

---

### TC-002: Successful Signup with Valid Data (Perseorangan)

| Field | Value |
|-------|-------|
| **Test ID** | TC-002 |
| **Title** | User can signup successfully as Perseorangan |
| **Priority** | Critical |
| **Type** | Positive Test |

**Preconditions:**
- User has a valid email not yet registered
- User has a valid Indonesian phone number

**Test Data:**
- Nama Lengkap: Test User Automation
- Email: testuser+{timestamp}@example.com
- Nomor HP: 81234567890
- Tipe Bisnis: Perseorangan
- Kata Sandi: Test@123456

**Test Steps:**
1. Navigate to signup page
2. Enter valid Nama Lengkap
3. Enter valid Email
4. Enter valid Nomor HP (without +62)
5. Select "Perseorangan" as Tipe Bisnis
6. Enter valid Kata Sandi
7. Click "Buat Akun" button

**Expected Results:**
- Form validation passes
- User is redirected to verification/success page
- Account creation process initiated

---

### TC-003: Successful Signup with Valid Data (Badan Usaha)

| Field | Value |
|-------|-------|
| **Test ID** | TC-003 |
| **Title** | User can signup successfully as Badan Usaha |
| **Priority** | Critical |
| **Type** | Positive Test |

**Test Data:**
- Nama Lengkap: PT Test Company
- Email: company+{timestamp}@example.com
- Nomor HP: 82198765432
- Tipe Bisnis: Badan Usaha
- Kata Sandi: Company@123

**Test Steps:**
1. Navigate to signup page
2. Fill all fields with valid data
3. Select "Badan Usaha" as Tipe Bisnis
4. Click "Buat Akun" button

**Expected Results:**
- Form validation passes
- User is redirected appropriately

---

### TC-004: Validation - Empty Required Fields

| Field | Value |
|-------|-------|
| **Test ID** | TC-004 |
| **Title** | Verify error messages for empty required fields |
| **Priority** | High |
| **Type** | Negative Test |

**Test Steps:**
1. Navigate to signup page
2. Leave all fields empty
3. Attempt to submit (or click outside fields to trigger validation)
4. Verify each field shows appropriate error message

**Expected Results:**
- Each empty required field shows validation error
- "Buat Akun" button remains disabled

---

### TC-005: Validation - Invalid Email Format

| Field | Value |
|-------|-------|
| **Test ID** | TC-005 |
| **Title** | Verify error message for invalid email format |
| **Priority** | High |
| **Type** | Negative Test |

**Test Data:**
| Invalid Email | Description |
|---------------|-------------|
| plainaddress | Missing @ and domain |
| @missinglocal.com | Missing local part |
| missing@domain | Missing TLD |
| test@.com | Missing domain name |
| test space@email.com | Contains space |

**Test Steps:**
1. Navigate to signup page
2. Enter invalid email format
3. Click outside the field or tab to next field
4. Verify error message appears

**Expected Results:**
- Error message displayed for invalid email format
- Form cannot be submitted

---

### TC-006: Validation - Invalid Phone Number

| Field | Value |
|-------|-------|
| **Test ID** | TC-006 |
| **Title** | Verify error message for invalid phone number |
| **Priority** | High |
| **Type** | Negative Test |

**Test Data:**
| Invalid Phone | Description |
|---------------|-------------|
| 123 | Too short |
| abcdefghij | Contains letters |
| 0812345678901234 | Too long |

**Test Steps:**
1. Navigate to signup page
2. Enter invalid phone number
3. Verify error message appears

**Expected Results:**
- Error message displayed for invalid phone number
- Form cannot be submitted

---

### TC-007: Validation - Weak Password

| Field | Value |
|-------|-------|
| **Test ID** | TC-007 |
| **Title** | Verify error message for weak password |
| **Priority** | High |
| **Type** | Negative Test |

**Password Requirements (from UI):**
- Tidak boleh berisi data pribadi seperti nama atau email
- Gunakan minimal 8 karakter tanpa spasi
- Kombinasikan huruf, angka, dan karakter spesial (contoh: #$!%)

**Test Data:**
| Weak Password | Reason |
|---------------|--------|
| 1234567 | Less than 8 characters |
| password | No numbers or special chars |
| 12345678 | No letters or special chars |
| Pass word1 | Contains space |

**Test Steps:**
1. Navigate to signup page
2. Enter weak password
3. Verify error/warning message appears

**Expected Results:**
- Password strength indicator or error shows
- Tips are displayed to guide user

---

### TC-008: Password Visibility Toggle

| Field | Value |
|-------|-------|
| **Test ID** | TC-008 |
| **Title** | Verify password visibility toggle works |
| **Priority** | Medium |
| **Type** | Functional Test |

**Test Steps:**
1. Navigate to signup page
2. Enter password "Test@123"
3. Verify password is masked (type="password")
4. Click eye icon to show password
5. Verify password is visible (type="text")
6. Click eye icon again
7. Verify password is masked again

**Expected Results:**
- Password toggles between visible and hidden
- Eye icon changes appropriately

---

### TC-009: Navigation to Login Page

| Field | Value |
|-------|-------|
| **Test ID** | TC-009 |
| **Title** | Verify "Masuk" link navigates to login page |
| **Priority** | Medium |
| **Type** | Navigation Test |

**Test Steps:**
1. Navigate to signup page
2. Click "Masuk" link
3. Verify user is redirected to login page

**Expected Results:**
- User navigates to login page
- Login form is displayed

---

### TC-010: Terms and Privacy Links

| Field | Value |
|-------|-------|
| **Test ID** | TC-010 |
| **Title** | Verify Terms and Privacy links work |
| **Priority** | Low |
| **Type** | Navigation Test |

**Test Steps:**
1. Navigate to signup page
2. Click "Syarat & Ketentuan" link
3. Verify link opens (new tab or page)
4. Go back to signup page
5. Click "Kebijakan Privasi" link
6. Verify link opens

**Expected Results:**
- Both links are clickable and navigate to correct pages

---

### TC-011: Duplicate Email Registration

| Field | Value |
|-------|-------|
| **Test ID** | TC-011 |
| **Title** | Verify error for already registered email |
| **Priority** | High |
| **Type** | Negative Test |

**Preconditions:**
- An account with the test email already exists

**Test Steps:**
1. Navigate to signup page
2. Fill form with already registered email
3. Complete all other fields with valid data
4. Click "Buat Akun"

**Expected Results:**
- Error message indicates email is already registered
- User is not allowed to create duplicate account

---

### TC-012: Form Field Character Limits

| Field | Value |
|-------|-------|
| **Test ID** | TC-012 |
| **Title** | Verify form fields have appropriate character limits |
| **Priority** | Medium |
| **Type** | Boundary Test |

**Test Steps:**
1. Navigate to signup page
2. Enter very long text (500+ chars) in Nama Lengkap
3. Enter very long text in Email
4. Enter very long numbers in Phone
5. Verify fields truncate or show error

**Expected Results:**
- Fields have max length limits or show validation error for excessive length

---

## Test Summary

| Category | Test Cases | Priority |
|----------|------------|----------|
| Smoke Test | TC-001 | High |
| Positive Tests | TC-002, TC-003 | Critical |
| Negative Tests | TC-004, TC-005, TC-006, TC-007, TC-011 | High |
| Functional Tests | TC-008, TC-012 | Medium |
| Navigation Tests | TC-009, TC-010 | Medium/Low |

**Total Test Cases:** 12
