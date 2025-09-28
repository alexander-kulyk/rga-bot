//core
import mammoth from 'mammoth';
import pdfParse from 'pdf-parse';
import * as XLSX from 'xlsx';

/**
 * Extracts text from different file types based on buffer and filename
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Original filename with extension
 * @returns {Promise<string>} - Extracted text content
 */
export const getExtractedText = async (buffer, fileName) => {
  // Determine file type based on file extension
  const getFileType = (filename) => {
    const extension = filename.toLowerCase().split('.').pop();
    return extension;
  };

  const fileType = getFileType(fileName);
  let extractedText = '';

  // Extract text based on file type
  if (fileType === 'docx') {
    const result = await mammoth.extractRawText({ buffer });
    extractedText = result.value;
  } else if (fileType === 'pdf') {
    const result = await pdfParse(buffer);
    extractedText = result.text;
  } else if (fileType === 'xlsx' || fileType === 'xls') {
    // Parse Excel file
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    let allText = [];

    // Process all worksheets
    workbook.SheetNames.forEach((sheetName) => {
      const worksheet = workbook.Sheets[sheetName];
      // Convert sheet to JSON and extract text content
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
      });

      // Add sheet name as a header
      allText.push(`Sheet: ${sheetName}`);
      allText.push(''); // Empty line

      // Process each row
      jsonData.forEach((row, rowIndex) => {
        if (Array.isArray(row) && row.some((cell) => cell !== '')) {
          // Join non-empty cells with tabs to preserve structure
          const rowText = row.map((cell) => cell.toString().trim()).join('\t');
          if (rowText.trim()) {
            allText.push(rowText);
          }
        }
      });

      allText.push('');
    });

    extractedText = allText.join('\n');
  } else {
    throw new Error(
      `Unsupported file type: ${fileType}. Only DOCX, PDF, and Excel (XLSX/XLS) files are supported.`
    );
  }

  if (!extractedText || extractedText.trim().length === 0) {
    throw new Error('No text content found in the document');
  }

  return extractedText;
};
