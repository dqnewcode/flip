const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

// Configuration
const RESULTS_DIR = path.join(__dirname, '..', 'test-results');
const JSON_RESULT = path.join(RESULTS_DIR, 'results.json');
const OUTPUT_PDF = path.join(__dirname, '..', 'docs', 'Test-Report.pdf');

// TC Name mapping for cleaner display
function getCleanTestName(title) {
  // Map test titles to TC numbers with proper QA naming in English
  const mappings = [
    { match: /display all signup page elements/i, name: 'TC-01: Verify Signup Page Elements Display' },
    { match: /valid data as Perseorangan/i, name: 'TC-02: Submit Valid Data as Individual' },
    { match: /valid data as Badan Usaha/i, name: 'TC-03: Submit Valid Data as Business Entity' },
    { match: /empty required fields/i, name: 'TC-04: Validate Empty Required Fields' },
    { match: /Missing.*and domain/i, name: 'TC-05: Validate Email Without @ and Domain' },
    { match: /Missing local part/i, name: 'TC-06: Validate Email Without Local Part' },
    { match: /Missing TLD/i, name: 'TC-07: Validate Email Without TLD' },
    { match: /Missing domain name/i, name: 'TC-08: Validate Email Without Domain Name' },
    { match: /email.*Contains space/i, name: 'TC-09: Validate Email Containing Spaces' },
    { match: /Double.*symbol/i, name: 'TC-10: Validate Email With Double @ Symbol' },
    { match: /phone.*Too short/i, name: 'TC-11: Validate Phone Number Too Short' },
    { match: /phone.*Contains letters/i, name: 'TC-12: Validate Phone Number With Letters' },
    { match: /phone.*Too long/i, name: 'TC-13: Validate Phone Number Too Long' },
    { match: /phone.*Special char/i, name: 'TC-14: Validate Phone Number With Special Characters' },
    { match: /Less than 8/i, name: 'TC-15: Validate Password Less Than 8 Characters' },
    { match: /No numbers or special/i, name: 'TC-16: Validate Password Without Numbers or Special Chars' },
    { match: /No letters or special/i, name: 'TC-17: Validate Password Without Letters or Special Chars' },
    { match: /password.*Contains space/i, name: 'TC-18: Validate Password Containing Spaces' },
    { match: /Only lowercase/i, name: 'TC-19: Validate Password With Only Lowercase' },
    { match: /Only uppercase/i, name: 'TC-20: Validate Password With Only Uppercase' },
    { match: /toggle password visibility/i, name: 'TC-21: Verify Password Visibility Toggle' },
    { match: /login.*Masuk|Masuk button/i, name: 'TC-22: Verify Login Page Navigation' },
    { match: /Terms and Privacy/i, name: 'TC-23: Verify Terms and Privacy Policy Links' },
    { match: /already registered|duplicate/i, name: 'TC-24: Validate Duplicate Email Registration' },
    { match: /long input|very long/i, name: 'TC-25: Validate Long Input Handling' },
    { match: /business types/i, name: 'TC-26: Verify Business Type Selection Toggle' },
    { match: /placeholder/i, name: 'TC-27: Verify Input Placeholder Text' },
    { match: /form input names|accessibility/i, name: 'TC-28: Verify Form Input Names for Accessibility' },
  ];

  for (const map of mappings) {
    if (map.match.test(title)) {
      return map.name;
    }
  }
  return 'TC-XX: Unknown Test Case';
}

// Determine if test is input validation type (should show INPUT_OK instead of PASS)
function isInputValidationTest(title) {
  const inputTests = [
    /invalid email/i,
    /invalid phone/i,
    /weak password/i,
    /Missing.*domain/i,
    /Missing local/i,
    /Missing TLD/i,
    /Contains space/i,
    /Double.*symbol/i,
    /Too short/i,
    /Too long/i,
    /Contains letters/i,
    /Special char/i,
    /Less than 8/i,
    /No numbers/i,
    /No letters/i,
    /lowercase/i,
    /uppercase/i,
  ];
  return inputTests.some(pattern => pattern.test(title));
}

// Get category from test title
function getCategory(title) {
  if (/element|display/i.test(title)) return 'Smoke';
  if (/email/i.test(title)) return 'Input Test';
  if (/phone/i.test(title)) return 'Input Test';
  if (/password.*weak|less than|no numbers|no letters|lowercase|uppercase|contains space/i.test(title)) return 'Input Test';
  if (/toggle|visibility/i.test(title)) return 'Functional';
  if (/login|masuk|navigation/i.test(title)) return 'Navigation';
  if (/terms|privacy|link/i.test(title)) return 'Navigation';
  if (/long|boundary/i.test(title)) return 'Boundary';
  if (/business type/i.test(title)) return 'Functional';
  if (/placeholder/i.test(title)) return 'UI';
  if (/accessibility|input names/i.test(title)) return 'Accessibility';
  if (/empty|required|button/i.test(title)) return 'Functional';
  if (/perseorangan|badan usaha|form/i.test(title)) return 'Functional';
  return 'Other';
}

// Parse test results from JSON
function parseTestResults() {
  if (!fs.existsSync(JSON_RESULT)) {
    console.log('⚠️  No results.json found. Run tests first with: npm test');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(JSON_RESULT, 'utf8'));
    const results = [];
    
    // Recursive function to extract specs from suites
    function extractSpecs(suite, parentTitle = '') {
      if (suite.specs) {
        suite.specs.forEach(spec => {
          const fullTitle = parentTitle ? `${parentTitle} > ${spec.title}` : spec.title;
          const testResult = spec.tests?.[0]?.results?.[0];
          
          let status = 'unknown';
          if (testResult) {
            if (testResult.status === 'passed') status = 'passed';
            else if (testResult.status === 'failed') status = 'failed';
            else if (testResult.status === 'skipped') status = 'skipped';
          } else if (spec.ok === true) {
            status = 'passed';
          } else if (spec.ok === false) {
            status = 'failed';
          }

          results.push({
            title: spec.title,
            fullTitle: fullTitle,
            status: status,
            duration: testResult?.duration || 0,
          });
        });
      }
      
      if (suite.suites) {
        suite.suites.forEach(sub => {
          extractSpecs(sub, suite.title);
        });
      }
    }

    if (data.suites) {
      data.suites.forEach(suite => extractSpecs(suite));
    }

    return {
      results,
      stats: data.stats || {},
      startTime: data.stats?.startTime || new Date().toISOString(),
      duration: data.stats?.duration || 0,
    };

  } catch (e) {
    console.error('Error parsing results.json:', e.message);
    return null;
  }
}

function generatePDFReport() {
  // Parse actual test results
  const testData = parseTestResults();
  
  if (!testData) {
    console.log('\n❌ Cannot generate PDF without test results.');
    console.log('   Run: npm test && npm run report:pdf');
    return;
  }

  const doc = new PDFDocument({ 
    size: 'A4', 
    margin: 40,
    info: {
      Title: 'Flip Business Signup - Test Report',
      Author: 'QA Automation'
    }
  });

  const stream = fs.createWriteStream(OUTPUT_PDF);
  doc.pipe(stream);

  // Colors
  const ORANGE = '#FF6B35';
  const GREEN = '#28a745';
  const RED = '#dc3545';
  const GRAY = '#6c757d';
  const BLUE = '#007bff';
  const YELLOW = '#ffc107';

  // Process results with clean names and proper status
  const processedResults = testData.results.map(r => {
    let displayStatus = r.status;
    
    // For input validation tests that passed, show as INPUT_OK
    if (r.status === 'passed' && isInputValidationTest(r.title)) {
      displayStatus = 'input_accepted';
    }

    return {
      title: getCleanTestName(r.title),
      originalTitle: r.title,
      status: displayStatus,
      category: getCategory(r.title),
      duration: r.duration,
    };
  });

  // Calculate stats
  const passed = processedResults.filter(t => t.status === 'passed').length;
  const inputAccepted = processedResults.filter(t => t.status === 'input_accepted').length;
  const failed = processedResults.filter(t => t.status === 'failed').length;
  const skipped = processedResults.filter(t => t.status === 'skipped').length;
  const total = processedResults.length;
  const execRate = total > 0 ? (((passed + inputAccepted) / total) * 100).toFixed(1) : 0;
  const totalDuration = (testData.duration / 1000).toFixed(1);

  // ===== COVER PAGE =====
  doc.rect(0, 0, doc.page.width, 200).fill(ORANGE);
  
  doc.fillColor('white')
     .fontSize(28)
     .font('Helvetica-Bold')
     .text('Test Execution Report', 40, 60, { align: 'center' });
  
  doc.fontSize(18)
     .font('Helvetica')
     .text('Flip for Business - Signup Page', 40, 100, { align: 'center' });

  doc.fontSize(12)
     .text('Automated UI Testing with Playwright', 40, 130, { align: 'center' });

  // Execution info
  const execDate = new Date(testData.startTime).toLocaleString('id-ID');
  doc.fillColor('black').fontSize(11);
  doc.text(`Execution Date: ${execDate}`, 40, 240);
  doc.text(`Duration: ${totalDuration} seconds`, 40, 258);
  doc.text(`Total Tests: ${total}`, 40, 276);
  doc.text('URL: https://business.flip.id/signup', 40, 294);
  doc.text('Framework: Playwright + TypeScript', 40, 312);

  // Quick summary box
  doc.rect(350, 235, 180, 90).fill('#f8f9fa').stroke(GRAY);
  doc.fillColor(ORANGE).fontSize(12).font('Helvetica-Bold').text('Quick Summary', 360, 245);
  doc.fillColor(GREEN).fontSize(20).font('Helvetica-Bold').text(`${passed + inputAccepted}`, 360, 270);
  doc.fillColor('black').fontSize(10).font('Helvetica').text('Executed', 395, 275);
  doc.fillColor(RED).fontSize(20).font('Helvetica-Bold').text(`${failed}`, 450, 270);
  doc.fillColor('black').fontSize(10).font('Helvetica').text('Failed', 475, 275);
  doc.fillColor(ORANGE).fontSize(14).font('Helvetica-Bold').text(`${execRate}%`, 360, 300);
  doc.fillColor('black').fontSize(10).font('Helvetica').text('Success Rate', 395, 303);

  // ===== TEST SCOPE PAGE =====
  doc.addPage();
  
  doc.fillColor(ORANGE).fontSize(22).font('Helvetica-Bold').text('Test Scope & Methodology', 40, 40);
  doc.moveTo(40, 70).lineTo(555, 70).stroke(ORANGE);

  doc.fillColor('black').fontSize(11).font('Helvetica');
  
  doc.font('Helvetica-Bold').text('Scope:', 40, 90);
  doc.font('Helvetica').text('UI Automation testing untuk halaman Signup Flip for Business', 40, 105);

  doc.font('Helvetica-Bold').text('Test Categories:', 40, 135);
  const categories = [
    '• Smoke Test - Verifikasi elemen halaman tampil dengan benar',
    '• Functional Test - Form filling, button clicks, navigation',
    '• Input Test - Behavior UI saat menerima berbagai input',
    '• Boundary Test - Input dengan panjang ekstrem',
    '• Accessibility - Atribut form untuk screen readers'
  ];
  let y = 155;
  categories.forEach(cat => {
    doc.font('Helvetica').text(cat, 50, y);
    y += 18;
  });

  doc.font('Helvetica-Bold').text('Important Notes:', 40, y + 20);
  doc.fillColor(RED).font('Helvetica');
  const notes = [
    '⚠ Beberapa test adalah INPUT BEHAVIOR test, bukan VALIDATION test',
    '⚠ UI tidak menampilkan inline error untuk semua invalid input',
    '⚠ Actual validation terjadi saat form di-submit (server-side)',
    '⚠ Status "INPUT OK" = UI menerima input tanpa inline validation'
  ];
  y += 40;
  notes.forEach(note => {
    doc.text(note, 50, y, { width: 500 });
    y += 20;
  });

  doc.fillColor(BLUE).font('Helvetica-Bold').text('Status Legend:', 40, y + 20);
  doc.fillColor(GREEN).text('● PASS', 50, y + 40);
  doc.fillColor('black').font('Helvetica').text('- Test executed successfully', 100, y + 40);
  doc.fillColor(YELLOW).text('● INPUT OK', 50, y + 60);
  doc.fillColor('black').text('- UI accepts input (no inline validation)', 130, y + 60);
  doc.fillColor(GRAY).text('● SKIPPED', 50, y + 80);
  doc.fillColor('black').text('- Test skipped', 120, y + 80);
  doc.fillColor(RED).text('● FAIL', 50, y + 100);
  doc.fillColor('black').text('- Test failed', 95, y + 100);

  // ===== SUMMARY PAGE =====
  doc.addPage();
  
  doc.fillColor(ORANGE).fontSize(22).font('Helvetica-Bold').text('Test Summary', 40, 40);
  doc.moveTo(40, 70).lineTo(555, 70).stroke(ORANGE);

  // Summary boxes
  const boxY = 90;
  const boxWidth = 95;
  const boxHeight = 65;
  const gap = 10;
  
  doc.rect(40, boxY, boxWidth, boxHeight).fill('#f8f9fa').stroke(GRAY);
  doc.fillColor(GRAY).fontSize(10).text('Total', 40, boxY + 8, { width: boxWidth, align: 'center' });
  doc.fillColor('black').fontSize(24).font('Helvetica-Bold').text(total.toString(), 40, boxY + 30, { width: boxWidth, align: 'center' });

  doc.rect(40 + boxWidth + gap, boxY, boxWidth, boxHeight).fill('#d4edda').stroke(GREEN);
  doc.fillColor(GREEN).fontSize(10).font('Helvetica').text('Passed', 40 + boxWidth + gap, boxY + 8, { width: boxWidth, align: 'center' });
  doc.fillColor(GREEN).fontSize(24).font('Helvetica-Bold').text(passed.toString(), 40 + boxWidth + gap, boxY + 30, { width: boxWidth, align: 'center' });

  doc.rect(40 + (boxWidth + gap) * 2, boxY, boxWidth, boxHeight).fill('#fff3cd').stroke(YELLOW);
  doc.fillColor('#856404').fontSize(9).font('Helvetica').text('Input OK', 40 + (boxWidth + gap) * 2, boxY + 8, { width: boxWidth, align: 'center' });
  doc.fillColor('#856404').fontSize(24).font('Helvetica-Bold').text(inputAccepted.toString(), 40 + (boxWidth + gap) * 2, boxY + 30, { width: boxWidth, align: 'center' });

  doc.rect(40 + (boxWidth + gap) * 3, boxY, boxWidth, boxHeight).fill('#f8d7da').stroke(RED);
  doc.fillColor(RED).fontSize(10).font('Helvetica').text('Failed', 40 + (boxWidth + gap) * 3, boxY + 8, { width: boxWidth, align: 'center' });
  doc.fillColor(RED).fontSize(24).font('Helvetica-Bold').text(failed.toString(), 40 + (boxWidth + gap) * 3, boxY + 30, { width: boxWidth, align: 'center' });

  doc.rect(40 + (boxWidth + gap) * 4, boxY, boxWidth, boxHeight).fill('#e2e3e5').stroke(GRAY);
  doc.fillColor(GRAY).fontSize(10).font('Helvetica').text('Skipped', 40 + (boxWidth + gap) * 4, boxY + 8, { width: boxWidth, align: 'center' });
  doc.fillColor(GRAY).fontSize(24).font('Helvetica-Bold').text(skipped.toString(), 40 + (boxWidth + gap) * 4, boxY + 30, { width: boxWidth, align: 'center' });

  doc.fillColor('black').fontSize(14).font('Helvetica-Bold').text(`Execution Rate: ${execRate}%`, 40, boxY + 85);
  doc.fillColor(GRAY).fontSize(10).font('Helvetica').text(`Duration: ${totalDuration}s`, 250, boxY + 87);

  // Results Table
  doc.fontSize(14).fillColor(ORANGE).font('Helvetica-Bold').text('Detailed Results:', 40, boxY + 115);
  
  let yPos = boxY + 140;
  doc.rect(40, yPos, 515, 22).fill('#f0f0f0');
  doc.fillColor('black').fontSize(9).font('Helvetica-Bold');
  doc.text('Test Case', 45, yPos + 6, { width: 230 });
  doc.text('Category', 280, yPos + 6, { width: 70 });
  doc.text('Status', 355, yPos + 6, { width: 55 });
  doc.text('Duration', 415, yPos + 6, { width: 50 });
  yPos += 22;

  processedResults.forEach((test, index) => {
    if (yPos > 750) {
      doc.addPage();
      yPos = 50;
      doc.rect(40, yPos, 515, 22).fill('#f0f0f0');
      doc.fillColor('black').fontSize(9).font('Helvetica-Bold');
      doc.text('Test Case', 45, yPos + 6, { width: 230 });
      doc.text('Category', 280, yPos + 6, { width: 70 });
      doc.text('Status', 355, yPos + 6, { width: 55 });
      doc.text('Duration', 415, yPos + 6, { width: 50 });
      yPos += 22;
    }

    if (index % 2 === 0) {
      doc.rect(40, yPos, 515, 20).fill('#fafafa');
    }

    const statusColor = test.status === 'passed' ? GREEN : 
                       test.status === 'input_accepted' ? '#856404' : 
                       test.status === 'failed' ? RED : GRAY;
    const statusText = test.status === 'passed' ? 'PASS' : 
                      test.status === 'input_accepted' ? 'INPUT OK' : 
                      test.status === 'failed' ? 'FAIL' : 'SKIP';
    const duration = (test.duration / 1000).toFixed(1) + 's';
    
    doc.fillColor('black').fontSize(8).font('Helvetica').text(test.title, 45, yPos + 5, { width: 230 });
    doc.fillColor(GRAY).text(test.category, 280, yPos + 5, { width: 70 });
    doc.fillColor(statusColor).font('Helvetica-Bold').text(statusText, 355, yPos + 5, { width: 55 });
    doc.fillColor(GRAY).font('Helvetica').text(duration, 415, yPos + 5, { width: 50 });
    
    yPos += 20;
  });

  // ===== SCREENSHOT PAGES =====
  // Direct mapping from folder name to TC name - CLEAN & SEQUENTIAL
  function getScreenshotTestName(folderName) {
    const dir = folderName.toLowerCase();
    
    // TC-01 to TC-27 - Clean sequential numbering
    if (dir.includes('elements-correctly')) return 'TC-01: Verifikasi Elemen Halaman Signup';
    if (dir.includes('perseorangan')) return 'TC-02: Isi Form Sebagai Perseorangan';
    if (dir.includes('badan-usaha')) return 'TC-03: Isi Form Sebagai Badan Usaha';
    if (dir.includes('empty-required-fields')) return 'TC-04: Validasi Field Kosong';
    if (dir.includes('missing-and-domain') || (dir.includes('missing') && dir.includes('domain') && !dir.includes('name'))) return 'TC-05: Email Tanpa @ dan Domain';
    if (dir.includes('missing-local-part')) return 'TC-06: Email Tanpa Local Part';
    if (dir.includes('missing-tld')) return 'TC-07: Email Tanpa TLD';
    if (dir.includes('missing-domain-name')) return 'TC-08: Email Tanpa Nama Domain';
    if (dir.includes('email') && dir.includes('contains-space')) return 'TC-09: Email Mengandung Spasi';
    if (dir.includes('double') && dir.includes('symbol')) return 'TC-10: Email Dengan Double @';
    if (dir.includes('phone') && dir.includes('too-short')) return 'TC-11: Nomor HP Terlalu Pendek';
    if (dir.includes('phone') && dir.includes('contains-letters')) return 'TC-12: Nomor HP Mengandung Huruf';
    if (dir.includes('phone') && dir.includes('too-long')) return 'TC-13: Nomor HP Terlalu Panjang';
    if (dir.includes('special-characters-only')) return 'TC-14: Nomor HP Karakter Spesial';
    if (dir.includes('less-than-8')) return 'TC-15: Password Kurang dari 8 Karakter';
    if (dir.includes('no-numbers-or-special')) return 'TC-16: Password Tanpa Angka/Spesial';
    if (dir.includes('no-letters-or-special')) return 'TC-17: Password Tanpa Huruf/Spesial';
    if (dir.includes('password') && dir.includes('contains-space')) return 'TC-18: Password Mengandung Spasi';
    if (dir.includes('lowercase-letters')) return 'TC-19: Password Hanya Huruf Kecil';
    if (dir.includes('uppercase-letters')) return 'TC-20: Password Hanya Huruf Besar';
    if (dir.includes('toggle-password-visibility')) return 'TC-21: Toggle Visibility Password';
    if (dir.includes('masuk-button')) return 'TC-22: Navigasi Tombol Masuk';
    if (dir.includes('terms-and-privacy')) return 'TC-23: Link Syarat dan Privasi';
    if (dir.includes('long-input') && dir.includes('form-fields')) return 'TC-24: Input Panjang di Form';
    if (dir.includes('business-types')) return 'TC-25: Toggle Tipe Bisnis';
    if (dir.includes('correct-placeholders')) return 'TC-26: Verifikasi Placeholder';
    if (dir.includes('accessibility') && dir.includes('input-names')) return 'TC-27: Accessibility Input Names';
    
    // Fallback
    return 'TC-XX: ' + dir.replace(/-chromium$/, '')
              .replace(/^signup-flip-business-signu-[a-z0-9]+-/i, '')
              .replace(/^signup-/i, '')
              .replace(/-/g, ' ')
              .substring(0, 40);
  }

  if (fs.existsSync(RESULTS_DIR)) {
    const testDirs = fs.readdirSync(RESULTS_DIR).filter(f => {
      const fullPath = path.join(RESULTS_DIR, f);
      return fs.statSync(fullPath).isDirectory();
    }).sort();

    testDirs.forEach((dir) => {
      const dirPath = path.join(RESULTS_DIR, dir);
      const screenshots = fs.readdirSync(dirPath).filter(f => f.endsWith('.png'));
      
      screenshots.forEach(screenshot => {
        doc.addPage();
        
        const testName = getScreenshotTestName(dir);
        
        // Header
        doc.rect(0, 0, doc.page.width, 55).fill(ORANGE);
        doc.fillColor('white').fontSize(12).font('Helvetica-Bold').text('Test Evidence', 40, 15);
        doc.fillColor('white').fontSize(10).font('Helvetica').text(testName, 40, 32, { width: 500 });
        
        // Screenshot
        const imgPath = path.join(dirPath, screenshot);
        try {
          doc.image(imgPath, 40, 70, { fit: [515, 690], align: 'center' });
        } catch (e) {
          doc.fillColor(GRAY).fontSize(12).text('Screenshot could not be loaded', 40, 300);
        }
        
        doc.fillColor(GRAY).fontSize(7).text(`File: ${screenshot}`, 40, 775);
      });
    });
  }

  // ===== END PAGE =====
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');
  
  doc.fillColor(ORANGE).fontSize(24).font('Helvetica-Bold').text('End of Report', 40, 280, { align: 'center' });
  doc.fillColor(GRAY).fontSize(12).font('Helvetica');
  doc.text('Automated Test Report', 40, 320, { align: 'center' });
  doc.text('Generated by Playwright + TypeScript', 40, 340, { align: 'center' });
  doc.text(new Date().toLocaleString('id-ID'), 40, 360, { align: 'center' });
  doc.fillColor(ORANGE).fontSize(10).text('— QA Automation —', 40, 400, { align: 'center' });

  doc.end();

  stream.on('finish', () => {
    console.log(`\n✅ PDF Report generated: ${OUTPUT_PDF}`);
    console.log(`\n   📊 Summary (from actual test run):`);
    console.log(`   ├─ Execution: ${execDate}`);
    console.log(`   ├─ Duration: ${totalDuration}s`);
    console.log(`   ├─ Total: ${total}`);
    console.log(`   ├─ Passed: ${passed}`);
    console.log(`   ├─ Input OK: ${inputAccepted}`);
    console.log(`   ├─ Failed: ${failed}`);
    console.log(`   ├─ Skipped: ${skipped}`);
    console.log(`   └─ Success Rate: ${execRate}%`);
  });
}

generatePDFReport();
