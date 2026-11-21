// Multer configuration for image uploads

const multer = require('multer');
const path = require('path');

// The stored extension comes from the verified MIME type, never from the client's
// file name (otherwise "x.html" sent as image/png would be served back as HTML).
const MIME_TO_EXT = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `photo-${uniqueSuffix}${MIME_TO_EXT[file.mimetype]}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (MIME_TO_EXT[file.mimetype]) {
    cb(null, true);
  } else {
    const error = new Error('نوع الملف غير مسموح. يسمح فقط بـ JPG و PNG و GIF و WEBP.');
    error.status = 400;
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
