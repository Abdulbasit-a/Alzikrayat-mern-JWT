// Joi validation middleware for request validation
// Following patterns from Lecture 14
// Rules mirror the original Flask application (names, email, password, lengths).

const fs = require('fs');
const mongoose = require('mongoose');
const Joi = require('joi');

// First/last name: letters only, Arabic or Latin (same rule as the Flask version)
const namePattern = /^[A-Za-z\u0600-\u06FF]+$/;

// Arabic error messages. {#label} is the Arabic field name, {#limit} the rule's limit.
const arabicMessages = {
  'any.required': '{#label} مطلوب.',
  'string.base': '{#label} يجب أن يكون نصاً.',
  'string.empty': '{#label} مطلوب.',
  'string.max': '{#label} يجب ألا يتجاوز {#limit} حرفاً.',
  'string.min': '{#label} يجب أن يحتوي على {#limit} أحرف على الأقل.',
  'string.email': 'يرجى إدخال بريد إلكتروني صحيح.',
  'string.pattern.base': '{#label} يجب أن يحتوي على أحرف فقط.',
  'object.unknown': 'حقل غير مسموح به.',
};

const schemas = {
  register: Joi.object({
    firstName: Joi.string().trim().max(50).pattern(namePattern).required().label('الاسم الأول'),
    lastName: Joi.string().trim().max(50).pattern(namePattern).required().label('الاسم الأخير'),
    email: Joi.string().trim().lowercase().max(100).email().required().label('البريد الإلكتروني'),
    password: Joi.string().min(8).max(72).required().label('كلمة المرور').messages({
      'string.min': 'كلمة المرور يجب أن تحتوي على {#limit} أحرف على الأقل.',
      'string.max': 'كلمة المرور يجب ألا تتجاوز {#limit} حرفاً.',
    }), // bcrypt ignores bytes past 72
    location: Joi.string().trim().max(100).allow('').label('المكان'),
    description: Joi.string().trim().max(1000).allow('').label('النبذة'),
    occupation: Joi.string().trim().max(100).allow('').label('المهنة'),
  }),
  login: Joi.object({
    email: Joi.string().trim().lowercase().required().label('البريد الإلكتروني'),
    password: Joi.string().required().label('كلمة المرور'),
  }),
  photo: Joi.object({
    title: Joi.string().trim().min(1).max(200).required().label('عنوان الصورة'),
    description: Joi.string().trim().max(1000).allow('').label('وصف الصورة'),
  }),
  comment: Joi.object({
    comment: Joi.string().trim().min(1).max(1000).required().label('التعليق'),
  }),
};

// Validates req.body and replaces it with the cleaned (trimmed, unknown-keys-stripped) value.
// If a file was already saved by multer and validation fails, the file is removed again.
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    messages: arabicMessages,
    errors: { wrap: { label: false } },
  });

  if (error) {
    if (req.file) fs.unlink(req.file.path, () => {});
    return res.status(400).json({
      success: false,
      message: 'بيانات غير صحيحة.',
      errors: error.details.map((detail) => detail.message),
    });
  }

  req.body = value;
  next();
};

// Rejects malformed ObjectIds in route params before they reach the database
const validateObjectId = (...params) => (req, res, next) => {
  const names = params.length ? params : ['id'];
  const bad = names.some((name) => !mongoose.isValidObjectId(req.params[name]));
  if (bad) {
    return res.status(400).json({ success: false, message: 'معرّف غير صالح.' });
  }
  next();
};

module.exports = { validate, validateObjectId, schemas };
