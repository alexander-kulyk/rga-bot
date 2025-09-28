import multer from 'multer';

// Configure multer for file uploads using memory storage
const uploadMiddleware = multer({
  storage: multer.memoryStorage(),

  fileFilter: (req, file, cb) => {
    console.log('=== FILE UPLOAD MIDDLEWARE ===');
    console.log('File details:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      fieldname: file.fieldname,
      size: file.size,
    });

    // Accept .docx files
    const isDocx =
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.originalname.toLowerCase().endsWith('.docx');

    // Accept .pdf files
    const isPdf =
      file.mimetype === 'application/pdf' ||
      file.originalname.toLowerCase().endsWith('.pdf');

    // Accept .xlsx and .xls files
    const isExcel =
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.mimetype === 'application/vnd.ms-excel' ||
      file.originalname.toLowerCase().endsWith('.xlsx') ||
      file.originalname.toLowerCase().endsWith('.xls');

    if (isDocx || isPdf || isExcel) {
      console.log('✅ File accepted - proceeding with upload');
      cb(null, true);
    } else {
      console.log('❌ File rejected - unsupported file type');
      const error = new Error(
        'Only .docx, .pdf, and Excel (.xlsx/.xls) files are allowed. Received: ' +
          file.mimetype
      );
      cb(error, false);
    }
  },
});

export default uploadMiddleware;
