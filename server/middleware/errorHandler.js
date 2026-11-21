// Global error handling middleware

const notFound = (req, res) => {
  res.status(404).json({ success: false, message: `المسار غير موجود: ${req.method} ${req.originalUrl}` });
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة.',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'value';
    return res.status(409).json({ success: false, message: field === 'email' ? 'البريد الإلكتروني مستخدم بالفعل.' : 'القيمة مستخدمة بالفعل.' });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'معرّف غير صالح.' });
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'حجم الصورة يجب ألا يتجاوز 10 ميغابايت.' : err.message;
    return res.status(400).json({ success: false, message });
  }

  // Malformed JSON body
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'صيغة الطلب غير صحيحة.' });
  }

  const status = err.status || 500;
  if (status >= 500) console.error('Error:', err.stack || err);

  res.status(status).json({
    success: false,
    // Do not leak internal details for unexpected errors
    message: status >= 500 ? 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.' : err.message,
  });
};

module.exports = { errorHandler, notFound };
