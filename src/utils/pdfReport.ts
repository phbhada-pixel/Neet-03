import jsPDF from 'jspdf';
import { MockTest, TestResult, Question } from '../types/neet';

export const generateTestReportPDF = (test: MockTest, result: TestResult) => {
  const doc = new jsPDF({
    orientation: 'p',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  let currentY = 16;

  // Helper for adding headers/footers on new pages
  const checkAddPage = (requiredHeight: number) => {
    if (currentY + requiredHeight > pageHeight - 15) {
      doc.addPage();
      currentY = 16;
      addHeaderFooter();
    }
  };

  const addHeaderFooter = () => {
    // Header line
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.line(margin, 10, pageWidth - margin, 10);

    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('NEET MASTER 2026 • Official Performance Scorecard Report', margin, 8);

    // Footer
    doc.line(margin, pageHeight - 10, pageWidth - margin, pageHeight - 10);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(`Generated on ${new Date().toLocaleString('en-IN')}`, margin, pageHeight - 6);
    doc.text(
      `Page ${doc.getNumberOfPages()}`,
      pageWidth - margin,
      pageHeight - 6,
      { align: 'right' }
    );
  };

  addHeaderFooter();

  // --- 1. TITLE BANNER ---
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 28, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.text('NEET MOCK TEST PERFORMANCE REPORT', margin + 6, currentY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(16, 185, 129); // emerald-500
  doc.text(test.title, margin + 6, currentY + 17);

  doc.setFontSize(8);
  doc.setTextColor(203, 213, 225);
  doc.text(`Completed: ${new Date(result.completedAt).toLocaleString('en-IN')} | Time: ${Math.floor(result.totalTimeSeconds / 60)}m ${result.totalTimeSeconds % 60}s`, margin + 6, currentY + 23);

  currentY += 34;

  // --- 2. CORE METRICS GRID ---
  checkAddPage(30);

  const boxWidth = (pageWidth - 2 * margin - 9) / 4;
  const metrics = [
    { label: 'TOTAL SCORE', val: `${result.totalScore} / ${result.maxMarks}`, sub: `${Math.round((result.totalScore / result.maxMarks) * 100)}% Marks`, color: [16, 185, 129] },
    { label: 'ACCURACY', val: `${result.accuracy}%`, sub: `${result.correctCount} Correct / ${result.incorrectCount} Wrong`, color: [20, 184, 166] },
    { label: 'ESTIMATED AIR', val: result.estimatedRankTier, sub: `~${result.estimatedPercentile}%ile`, color: [217, 119, 6] },
    { label: 'TIME SPENT', val: `${Math.floor(result.totalTimeSeconds / 60)}m ${result.totalTimeSeconds % 60}s`, sub: `Avg ${Math.round(result.totalTimeSeconds / (test.questions.length || 1))}s / Q`, color: [99, 102, 241] },
  ];

  metrics.forEach((m, idx) => {
    const x = margin + idx * (boxWidth + 3);
    doc.setFillColor(248, 250, 252); // slate-50
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, currentY, boxWidth, 24, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(m.label, x + 4, currentY + 6);

    doc.setFontSize(11);
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.val, x + 4, currentY + 13);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(m.sub, x + 4, currentY + 19);
  });

  currentY += 30;

  // --- 3. SUBJECT-WISE BREAKDOWN TABLE ---
  checkAddPage(40);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Subject-Wise Score Breakdown (+4 / -1 Marking Scheme)', margin, currentY);
  currentY += 5;

  // Table Header
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, currentY, pageWidth - 2 * margin, 8, 'F');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(51, 65, 85);

  const cols = [
    { title: 'Subject', x: margin + 3, w: 45 },
    { title: 'Score Obtained', x: margin + 50, w: 30 },
    { title: 'Correct (+4)', x: margin + 82, w: 25 },
    { title: 'Incorrect (-1)', x: margin + 110, w: 25 },
    { title: 'Unattempted (0)', x: margin + 138, w: 25 },
    { title: 'Accuracy %', x: margin + 165, w: 20 },
  ];

  cols.forEach(c => doc.text(c.title, c.x, currentY + 5.5));
  currentY += 8;

  // Table Rows
  Object.entries(result.subjectResults).forEach(([subName, res]: [string, any], rIdx) => {
    checkAddPage(8);

    if (rIdx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, currentY, pageWidth - 2 * margin, 7, 'F');
    }

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);

    doc.text(subName, cols[0].x, currentY + 4.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(16, 185, 129);
    doc.text(`${res.score} / ${res.maxMarks}`, cols[1].x, currentY + 4.5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(16, 185, 129);
    doc.text(`${res.correct}`, cols[2].x, currentY + 4.5);

    doc.setTextColor(225, 29, 72);
    doc.text(`${res.incorrect}`, cols[3].x, currentY + 4.5);

    doc.setTextColor(100, 116, 139);
    doc.text(`${res.unattempted}`, cols[4].x, currentY + 4.5);

    const subAcc = res.correct + res.incorrect > 0 
      ? Math.round((res.correct / (res.correct + res.incorrect)) * 100) 
      : 0;
    doc.setTextColor(15, 23, 42);
    doc.text(`${subAcc}%`, cols[5].x, currentY + 4.5);

    currentY += 7;
  });

  doc.setDrawColor(226, 232, 240);
  doc.line(margin, currentY, pageWidth - margin, currentY);
  currentY += 10;

  // --- 4. QUESTION SOLUTIONS SUMMARY ---
  checkAddPage(20);

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Detailed Question-by-Question Solution Analysis', margin, currentY);
  currentY += 6;

  test.questions.forEach((q, qIdx) => {
    const resp = result.userResponses[q.id];
    const isSelected = resp && resp.selectedOption !== null && resp.selectedOption !== undefined;
    const isCorrect = isSelected && resp.selectedOption === q.correctAnswer;

    // Estimate height required for this question block
    const qTextLines = doc.splitTextToSize(`Q${qIdx + 1}. [${q.subject}] ${q.question}`, pageWidth - 2 * margin - 20);
    const explLines = doc.splitTextToSize(`NCERT Solution: ${q.explanation}`, pageWidth - 2 * margin - 10);
    const blockHeight = 12 + (qTextLines.length * 4) + (explLines.length * 3.5) + 18;

    checkAddPage(Math.min(blockHeight, 60));

    // Question Box Header
    let statusBg = [241, 245, 249]; // default
    let statusText = 'UNATTEMPTED (0 Marks)';
    let statusColor = [100, 116, 139];

    if (isCorrect) {
      statusBg = [236, 253, 245]; // emerald-50
      statusText = 'CORRECT (+4 Marks)';
      statusColor = [16, 185, 129];
    } else if (isSelected) {
      statusBg = [255, 241, 242]; // rose-50
      statusText = 'INCORRECT (-1 Mark)';
      statusColor = [225, 29, 72];
    }

    doc.setFillColor(statusBg[0], statusBg[1], statusBg[2]);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 7, 1.5, 1.5, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 65, 85);
    doc.text(`Q${qIdx + 1} • ${q.subject} (${q.topic})`, margin + 3, currentY + 4.5);

    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(statusText, pageWidth - margin - 3, currentY + 4.5, { align: 'right' });

    currentY += 9;

    // Question Text
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    doc.text(qTextLines, margin + 2, currentY);
    currentY += qTextLines.length * 4.2;

    // User Selection vs Correct Answer
    const userOptionLabel = isSelected ? `Option ${['A', 'B', 'C', 'D'][resp.selectedOption!]}: ${q.options[resp.selectedOption!]}` : 'Not Attempted';
    const correctOptionLabel = `Option ${['A', 'B', 'C', 'D'][q.correctAnswer]}: ${q.options[q.correctAnswer]}`;

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    if (isCorrect) {
      doc.setTextColor(16, 185, 129);
      doc.text(`Your Answer: ${userOptionLabel} (Correct)`, margin + 2, currentY);
    } else if (isSelected) {
      doc.setTextColor(225, 29, 72);
      doc.text(`Your Answer: ${userOptionLabel}`, margin + 2, currentY);
      currentY += 3.5;
      doc.setTextColor(16, 185, 129);
      doc.text(`Correct Answer: ${correctOptionLabel}`, margin + 2, currentY);
    } else {
      doc.setTextColor(100, 116, 139);
      doc.text(`Your Answer: Unattempted`, margin + 2, currentY);
      currentY += 3.5;
      doc.setTextColor(16, 185, 129);
      doc.text(`Correct Answer: ${correctOptionLabel}`, margin + 2, currentY);
    }
    currentY += 5;

    // NCERT Explanation Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    const boxH = explLines.length * 3.8 + 6;
    doc.roundedRect(margin, currentY, pageWidth - 2 * margin, boxH, 1, 1, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    doc.text(explLines, margin + 3, currentY + 4);

    currentY += boxH + 6;
  });

  // Save the generated PDF file
  const fileName = `${test.title.replace(/[^a-zA-Z0-9]/g, '_')}_Result_Report.pdf`;
  doc.save(fileName);
};
