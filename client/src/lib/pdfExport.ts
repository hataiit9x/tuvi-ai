import jsPDF from 'jspdf';

// Vietnamese font support - we'll use built-in fonts with Unicode support
// For full Vietnamese support, you would need to add a custom font

interface TuViPDFData {
  fullName: string;
  birthDate: string;
  birthHour?: string;
  gender?: string;
  calendarType?: string;
  element?: string;
  heavenlyStem?: string;
  earthlyBranch?: string;
  palaces: Array<{
    name: string;
    nameChinese?: string;
    position?: number;
    mainStars?: Array<{ name: string; nature?: string; type?: string }> | string[];
    minorStars?: string[];
  }>;
  aiAnalysis?: string;
}

interface NumerologyPDFData {
  fullName: string;
  birthDate: string;
  lifePathNumber: number;
  soulNumber: number;
  personalityNumber: number;
  destinyNumber: number;
  birthDayNumber: number;
  birthChart: number[][];
  aiAnalysis?: string;
}

// Helper function to wrap text
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  // Approximate characters per line based on font size
  const charsPerLine = Math.floor(maxWidth / (fontSize * 0.5));
  
  for (const word of words) {
    if ((currentLine + ' ' + word).length <= charsPerLine) {
      currentLine = currentLine ? currentLine + ' ' + word : word;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  
  return lines;
}

// Remove Vietnamese diacritics for PDF compatibility
function removeVietnameseDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function exportTuViToPDF(data: TuViPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237); // Purple
  doc.text('LA SO TU VI', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128); // Gray
  doc.text('Tu Vi AI - Ket hop tri tue nhan tao & thuat toan truyen thong', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Divider line
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Personal Info
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('THONG TIN CA NHAN', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  
  const info = [
    `Ho va ten: ${removeVietnameseDiacritics(data.fullName)}`,
    `Ngay sinh: ${data.birthDate}${data.calendarType ? ` (${data.calendarType === 'lunar' ? 'Am lich' : 'Duong lich'})` : ''}`,
  ];
  
  if (data.birthHour) {
    info.push(`Gio sinh: ${removeVietnameseDiacritics(data.birthHour)}`);
  }
  if (data.gender) {
    info.push(`Gioi tinh: ${data.gender === 'male' ? 'Nam' : 'Nu'}`);
  }
  if (data.element) {
    info.push(`Menh: ${removeVietnameseDiacritics(data.element)}`);
  }
  if (data.heavenlyStem && data.earthlyBranch) {
    info.push(`Thien Can - Dia Chi: ${removeVietnameseDiacritics(data.heavenlyStem)} ${removeVietnameseDiacritics(data.earthlyBranch)}`);
  }

  info.forEach(line => {
    doc.text(line, margin, yPos);
    yPos += 6;
  });

  yPos += 5;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // 12 Palaces
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('12 CUNG TRONG LA SO', margin, yPos);
  yPos += 10;

  doc.setFontSize(10);
  
  // Create a simple table for palaces
  const colWidth = (pageWidth - 2 * margin) / 3;
  let col = 0;
  let startY = yPos;

  data.palaces.forEach((palace, index) => {
    const x = margin + col * colWidth;
    const y = startY + Math.floor(index / 3) * 25;
    
    // Check if we need a new page
    if (y > pageHeight - 40) {
      doc.addPage();
      startY = margin;
    }
    
    // Palace name
    doc.setTextColor(124, 58, 237);
    doc.setFontSize(10);
    doc.text(removeVietnameseDiacritics(palace.name), x, y);
    
    // Stars - handle both array of strings and array of objects
    doc.setTextColor(75, 85, 99);
    doc.setFontSize(8);
    
    let starsText = '';
    if (palace.mainStars && palace.mainStars.length > 0) {
      const stars = palace.mainStars.slice(0, 3).map(star => {
        if (typeof star === 'string') return star;
        return star.name;
      });
      starsText = stars.join(', ');
    }
    
    doc.text(removeVietnameseDiacritics(starsText) || 'Khong co sao', x, y + 5);
    
    col = (col + 1) % 3;
  });

  yPos = startY + Math.ceil(data.palaces.length / 3) * 25 + 10;

  // AI Analysis (if available)
  if (data.aiAnalysis) {
    // Check if we need a new page
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('PHAN TICH AI', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    
    const analysisText = removeVietnameseDiacritics(data.aiAnalysis);
    const lines = wrapText(analysisText, pageWidth - 2 * margin, 10);
    
    lines.forEach(line => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Tao boi Tu Vi AI - tuviai.com', pageWidth / 2, footerY, { align: 'center' });

  // Save the PDF
  const fileName = `tuvi_${removeVietnameseDiacritics(data.fullName).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}

export function exportNumerologyToPDF(data: NumerologyPDFData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  let yPos = margin;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(124, 58, 237);
  doc.text('THAN SO HOC', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Subtitle
  doc.setFontSize(12);
  doc.setTextColor(107, 114, 128);
  doc.text('Tu Vi AI - Kham pha con so van menh cua ban', pageWidth / 2, yPos, { align: 'center' });
  yPos += 15;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Personal Info
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('THONG TIN CA NHAN', margin, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setTextColor(75, 85, 99);
  doc.text(`Ho va ten: ${removeVietnameseDiacritics(data.fullName)}`, margin, yPos);
  yPos += 6;
  doc.text(`Ngay sinh: ${data.birthDate}`, margin, yPos);
  yPos += 10;

  // Divider
  doc.setDrawColor(229, 231, 235);
  doc.line(margin, yPos, pageWidth - margin, yPos);
  yPos += 10;

  // Numbers Section
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('CAC CON SO VAN MENH', margin, yPos);
  yPos += 10;

  const numbers = [
    { label: 'So Chu Dao (Life Path)', value: data.lifePathNumber },
    { label: 'So Linh Hon (Soul)', value: data.soulNumber },
    { label: 'So Nhan Cach (Personality)', value: data.personalityNumber },
    { label: 'So Dinh Menh (Destiny)', value: data.destinyNumber },
    { label: 'So Ngay Sinh (Birth Day)', value: data.birthDayNumber },
  ];

  // Draw number boxes
  const boxWidth = (pageWidth - 2 * margin - 20) / 3;
  const boxHeight = 25;
  
  numbers.forEach((num, index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const x = margin + col * (boxWidth + 10);
    const y = yPos + row * (boxHeight + 10);

    // Box background
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(x, y, boxWidth, boxHeight, 3, 3, 'F');

    // Number
    doc.setFontSize(20);
    doc.setTextColor(124, 58, 237);
    doc.text(num.value.toString(), x + boxWidth / 2, y + 12, { align: 'center' });

    // Label
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(num.label, x + boxWidth / 2, y + 20, { align: 'center' });
  });

  yPos += Math.ceil(numbers.length / 3) * (boxHeight + 10) + 10;

  // Birth Chart
  doc.setFontSize(14);
  doc.setTextColor(31, 41, 55);
  doc.text('BIEU DO NGAY SINH', margin, yPos);
  yPos += 10;

  // Draw 3x3 grid
  const cellSize = 20;
  const gridStartX = margin;
  const gridStartY = yPos;

  // Grid layout: 3 6 9 / 2 5 8 / 1 4 7
  const gridNumbers = [
    [3, 6, 9],
    [2, 5, 8],
    [1, 4, 7]
  ];

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      const x = gridStartX + col * cellSize;
      const y = gridStartY + row * cellSize;
      const num = gridNumbers[row][col];
      
      // Check if number exists in birth chart
      const count = data.birthChart.flat().filter(n => n === num).length;
      
      if (count > 0) {
        doc.setFillColor(124, 58, 237);
        doc.roundedRect(x, y, cellSize - 2, cellSize - 2, 2, 2, 'F');
        doc.setTextColor(255, 255, 255);
      } else {
        doc.setFillColor(243, 244, 246);
        doc.roundedRect(x, y, cellSize - 2, cellSize - 2, 2, 2, 'F');
        doc.setTextColor(156, 163, 175);
      }
      
      doc.setFontSize(14);
      doc.text(num.toString(), x + (cellSize - 2) / 2, y + 13, { align: 'center' });
    }
  }

  yPos = gridStartY + 3 * cellSize + 15;

  // AI Analysis
  if (data.aiAnalysis) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = margin;
    }

    doc.setDrawColor(229, 231, 235);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    yPos += 10;

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('PHAN TICH AI', margin, yPos);
    yPos += 8;

    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    
    const analysisText = removeVietnameseDiacritics(data.aiAnalysis);
    const lines = wrapText(analysisText, pageWidth - 2 * margin, 10);
    
    lines.forEach(line => {
      if (yPos > pageHeight - 20) {
        doc.addPage();
        yPos = margin;
      }
      doc.text(line, margin, yPos);
      yPos += 5;
    });
  }

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setTextColor(156, 163, 175);
  doc.text('Tao boi Tu Vi AI - tuviai.com', pageWidth / 2, footerY, { align: 'center' });

  // Save
  const fileName = `thansohoc_${removeVietnameseDiacritics(data.fullName).replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
