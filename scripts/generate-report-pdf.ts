import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';

// Interfaces
interface TestResult {
  title: string;
  fullTitle: string;
  status: 'passed' | 'failed' | 'skipped' | 'unknown';
  duration: number;
}

interface ProcessedResult {
  title: string;
  status: string;
  duration: number;
}

interface TestData {
  results: TestResult[];
  stats: Record<string, unknown>;
  startTime: string;
  duration: number;
}

interface Suite {
  title?: string;
  specs?: Spec[];
  suites?: Suite[];
}

interface Spec {
  title: string;
  ok?: boolean;
  tests?: Test[];
}

interface Test {
  results?: TestResultData[];
}

interface TestResultData {
  status: string;
  duration: number;
}

// Configuration
const RESULTS_DIR: string = path.join(__dirname, '..', 'test-results');
const JSON_RESULT: string = path.join(RESULTS_DIR, 'results.json');
const OUTPUT_PDF: string = path.join(__dirname, '..', 'docs', 'Test-Report.pdf');

// TC Name mapping - must match test spec exactly
function getCleanTestName(title: string): string {
  const mappings: { match: RegExp; name: string }[] = [
    { match: /TC-01.*Verify Signup Page Elements/i, name: 'TC-01: Verify Signup Page Elements Display' },
    { match: /TC-02.*Submit Valid.*Perseorangan/i, name: 'TC-02: Submit Valid Signup Form - Perseorangan' },
    { match: /TC-03.*Submit Valid.*Badan Usaha/i, name: 'TC-03: Submit Valid Signup Form - Badan Usaha' },
    { match: /TC-04.*Empty Form/i, name: 'TC-04: Validate Empty Form Submission' },
    { match: /TC-05.*Invalid Email Format/i, name: 'TC-05: Validate Invalid Email Format' },
    { match: /TC-06.*Email Without Domain/i, name: 'TC-06: Validate Email Without Domain' },
    { match: /TC-07.*Short Phone/i, name: 'TC-07: Validate Short Phone Number' },
    { match: /TC-08.*Phone.*Letters/i, name: 'TC-08: Validate Phone Number With Letters' },
    { match: /TC-09.*Weak Password/i, name: 'TC-09: Validate Weak Password' },
    { match: /TC-10.*Password Without Special/i, name: 'TC-10: Validate Password Without Special Characters' },
    { match: /TC-11.*Toggle Password/i, name: 'TC-11: Toggle Password Visibility' },
    { match: /TC-12.*Navigate.*Login/i, name: 'TC-12: Navigate To Login Page' },
    { match: /TC-13.*Terms/i, name: 'TC-13: Verify Terms And Conditions Link' },
    { match: /TC-14.*Privacy/i, name: 'TC-14: Verify Privacy Policy Link' },
  ];

  for (const map of mappings) {
    if (map.match.test(title)) {
      return map.name;
    }
  }

  const tcMatch = title.match(/TC-\d+/i);
  if (tcMatch) {
    return title;
  }

  return 'Unknown Test Case';
}

// Parse test results from JSON
function parseTestResults(): TestData | null {
  if (!fs.existsSync(JSON_RESULT)) {
    console.log('⚠️  No results.json found. Run tests first with: npm test');
    return null;
  }

  try {
    const data = JSON.parse(fs.readFileSync(JSON_RESULT, 'utf8'));
    const results: TestResult[] = [];

    function extractSpecs(suite: Suite, parentTitle: string = ''): void {
      if (suite.specs) {
        suite.specs.forEach((spec: Spec) => {
          const fullTitle = parentTitle ? `${parentTitle} > ${spec.title}` : spec.title;
          const testResult = spec.tests?.[0]?.results?.[0];

          let status: TestResult['status'] = 'unknown';
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
        suite.suites.forEach((sub: Suite) => {
          extractSpecs(sub, suite.title || '');
        });
      }
    }

    if (data.suites) {
      data.suites.forEach((suite: Suite) => extractSpecs(suite));
    }

    return {
      results,
      stats: data.stats || {},
      startTime: data.stats?.startTime || new Date().toISOString(),
      duration: data.stats?.duration || 0,
    };
  } catch (e) {
    console.error('Error parsing results.json:', (e as Error).message);
    return null;
  }
}

function generatePDFReport(): void {
  const testData = parseTestResults();

  if (!testData) {
    console.log('\n❌ Cannot generate PDF without test results.');
    console.log('   Run: npm test && npm run report');
    return;
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    info: {
      Title: 'Flip Business Signup - Test Execution Report',
      Author: 'QA Automation',
    },
  });

  const stream = fs.createWriteStream(OUTPUT_PDF);
  doc.pipe(stream);

  // Colors
  const BLUE = '#007bff';
  const GREEN = '#28a745';
  const RED = '#dc3545';
  const GRAY = '#6c757d';

  // Process results
  const processedResults: ProcessedResult[] = testData.results.map((r) => ({
    title: getCleanTestName(r.title),
    status: r.status,
    duration: r.duration,
  }));

  // Calculate stats
  const passed = processedResults.filter((t) => t.status === 'passed').length;
  const failed = processedResults.filter((t) => t.status === 'failed').length;
  const skipped = processedResults.filter((t) => t.status === 'skipped').length;
  const total = processedResults.length;
  const successRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
  const totalDuration = (testData.duration / 1000).toFixed(1);
  const execDate = new Date(testData.startTime).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // ===== PAGE 1: HEADER & SUMMARY =====
  doc.fillColor(BLUE).fontSize(26).font('Helvetica-Bold').text('Test Execution Report', 50, 50);

  doc.fontSize(14).fillColor(GRAY).font('Helvetica').text('Flip Business - Signup Page Automation', 50, 85);

  doc.moveTo(50, 110).lineTo(545, 110).stroke(BLUE);

  // Execution info
  doc.fontSize(10).fillColor('black').font('Helvetica-Bold');
  doc.text('Execution Date:', 50, 130);
  doc.font('Helvetica').text(execDate, 160, 130);

  doc.font('Helvetica-Bold').text('Duration:', 50, 147);
  doc.font('Helvetica').text(`${totalDuration} seconds`, 160, 147);

  doc.font('Helvetica-Bold').text('Test URL:', 50, 164);
  doc.font('Helvetica').text('https://business.flip.id/signup', 160, 164);

  doc.font('Helvetica-Bold').text('Framework:', 50, 181);
  doc.font('Helvetica').text('Playwright + TypeScript', 160, 181);

  // Summary boxes
  const boxY = 215;
  const boxWidth = 115;
  const boxHeight = 70;
  const gap = 10;

  // Total box
  doc.rect(50, boxY, boxWidth, boxHeight).fillAndStroke('#e9ecef', GRAY);
  doc.fillColor(GRAY).fontSize(11).font('Helvetica').text('Total Tests', 50, boxY + 10, { width: boxWidth, align: 'center' });
  doc.fillColor('black').fontSize(28).font('Helvetica-Bold').text(total.toString(), 50, boxY + 35, { width: boxWidth, align: 'center' });

  // Passed box
  doc.rect(50 + boxWidth + gap, boxY, boxWidth, boxHeight).fillAndStroke('#d4edda', GREEN);
  doc.fillColor(GREEN).fontSize(11).font('Helvetica').text('Passed', 50 + boxWidth + gap, boxY + 10, { width: boxWidth, align: 'center' });
  doc.fillColor(GREEN).fontSize(28).font('Helvetica-Bold').text(passed.toString(), 50 + boxWidth + gap, boxY + 35, { width: boxWidth, align: 'center' });

  // Failed box
  doc.rect(50 + (boxWidth + gap) * 2, boxY, boxWidth, boxHeight).fillAndStroke('#f8d7da', RED);
  doc.fillColor(RED).fontSize(11).font('Helvetica').text('Failed', 50 + (boxWidth + gap) * 2, boxY + 10, { width: boxWidth, align: 'center' });
  doc.fillColor(RED).fontSize(28).font('Helvetica-Bold').text(failed.toString(), 50 + (boxWidth + gap) * 2, boxY + 35, { width: boxWidth, align: 'center' });

  // Skipped box
  doc.rect(50 + (boxWidth + gap) * 3, boxY, boxWidth, boxHeight).fillAndStroke('#e2e3e5', GRAY);
  doc.fillColor(GRAY).fontSize(11).font('Helvetica').text('Skipped', 50 + (boxWidth + gap) * 3, boxY + 10, { width: boxWidth, align: 'center' });
  doc.fillColor(GRAY).fontSize(28).font('Helvetica-Bold').text(skipped.toString(), 50 + (boxWidth + gap) * 3, boxY + 35, { width: boxWidth, align: 'center' });

  // Success rate
  doc.fillColor(BLUE).fontSize(16).font('Helvetica-Bold').text(`Success Rate: ${successRate}%`, 50, boxY + 90);

  // ===== TEST RESULTS TABLE =====
  let yPos = 390;

  doc.fontSize(14).fillColor(BLUE).font('Helvetica-Bold').text('Test Results', 50, yPos);
  yPos += 30;

  // Table header
  doc.rect(50, yPos, 495, 25).fillAndStroke('#e9ecef', GRAY);
  doc.fillColor('black').fontSize(10).font('Helvetica-Bold');
  doc.text('Test Case', 60, yPos + 8, { width: 350 });
  doc.text('Status', 420, yPos + 8, { width: 60 });
  doc.text('Duration', 480, yPos + 8, { width: 55 });
  yPos += 25;

  // Table rows
  processedResults.forEach((test, index) => {
    if (yPos > 720) {
      doc.addPage();
      yPos = 50;

      doc.rect(50, yPos, 495, 25).fillAndStroke('#e9ecef', GRAY);
      doc.fillColor('black').fontSize(10).font('Helvetica-Bold');
      doc.text('Test Case', 60, yPos + 8, { width: 350 });
      doc.text('Status', 420, yPos + 8, { width: 60 });
      doc.text('Duration', 480, yPos + 8, { width: 55 });
      yPos += 25;
    }

    if (index % 2 === 0) {
      doc.rect(50, yPos, 495, 22).fill('#f8f9fa');
    } else {
      doc.rect(50, yPos, 495, 22).fill('white');
    }

    doc.fillColor('black').fontSize(9).font('Helvetica').text(test.title, 60, yPos + 6, { width: 350 });

    let statusText = '';
    let statusColor = 'black';

    if (test.status === 'passed') {
      statusText = 'PASS';
      statusColor = GREEN;
    } else if (test.status === 'failed') {
      statusText = 'FAIL';
      statusColor = RED;
    } else if (test.status === 'skipped') {
      statusText = 'SKIP';
      statusColor = GRAY;
    } else {
      statusText = 'N/A';
      statusColor = GRAY;
    }

    doc.fillColor(statusColor).fontSize(9).font('Helvetica-Bold').text(statusText, 420, yPos + 6, { width: 60 });

    const duration = (test.duration / 1000).toFixed(1) + 's';
    doc.fillColor(GRAY).fontSize(8).font('Helvetica').text(duration, 480, yPos + 6, { width: 55 });

    yPos += 22;
  });

  // ===== SCREENSHOTS =====
  if (fs.existsSync(RESULTS_DIR)) {
    const testDirs = fs
      .readdirSync(RESULTS_DIR)
      .filter((f) => {
        const fullPath = path.join(RESULTS_DIR, f);
        return fs.statSync(fullPath).isDirectory();
      })
      .sort();

    testDirs.forEach((dir) => {
      const dirPath = path.join(RESULTS_DIR, dir);
      const screenshots = fs.readdirSync(dirPath).filter((f) => f.endsWith('.png'));

      if (screenshots.length > 0) {
        const tcMatch = dir.match(/tc-(\d+)/i);
        const tcId = tcMatch ? `TC-${tcMatch[1].padStart(2, '0')}` : '';

        const matchingTest = processedResults.find((r) => r.title.startsWith(tcId));
        const tcName = matchingTest ? matchingTest.title : `${tcId}: Test Case`;

        screenshots.forEach((screenshot, idx) => {
          doc.addPage();

          doc.fillColor(BLUE).fontSize(12).font('Helvetica-Bold').text(tcName, 50, 40);
          doc.moveTo(50, 60).lineTo(545, 60).stroke(GRAY);

          const imgPath = path.join(dirPath, screenshot);
          try {
            doc.image(imgPath, 50, 75, { fit: [495, 670], align: 'center' });
          } catch {
            doc.fillColor(GRAY).fontSize(12).text('Screenshot could not be loaded', 50, 300);
          }

          doc.fillColor(GRAY).fontSize(7).text(`Screenshot ${idx + 1}: ${screenshot}`, 50, 760);
        });
      }
    });
  }

  // ===== END PAGE =====
  doc.addPage();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill('#f8f9fa');

  doc.fillColor(BLUE).fontSize(24).font('Helvetica-Bold').text('End of Report', 0, 350, { align: 'center' });
  doc.fillColor(GRAY).fontSize(12).font('Helvetica');
  doc.text('Automated Test Report', 0, 390, { align: 'center' });
  doc.text('Generated by Playwright + TypeScript', 0, 410, { align: 'center' });
  doc.text(new Date().toLocaleString('en-US'), 0, 430, { align: 'center' });

  doc.end();

  stream.on('finish', () => {
    console.log(`\n✅ PDF Report generated: ${OUTPUT_PDF}`);
    console.log(`\n   📊 Test Execution Summary:`);
    console.log(`   ├─ Date: ${execDate}`);
    console.log(`   ├─ Duration: ${totalDuration}s`);
    console.log(`   ├─ Total: ${total}`);
    console.log(`   ├─ Passed: ${passed}`);
    console.log(`   ├─ Failed: ${failed}`);
    console.log(`   ├─ Skipped: ${skipped}`);
    console.log(`   └─ Success Rate: ${successRate}%`);
  });
}

generatePDFReport();
