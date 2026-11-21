// Mongoose schema for Photo collection
// Following patterns from Lecture 13

const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب أن تنتمي الصورة إلى مستخدم.'],
    },
    fileName: {
      type: String,
      required: [true, 'اسم الملف مطلوب.'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'عنوان الصورة مطلوب.'],
      trim: true,
      maxlength: [200, 'عنوان الصورة يجب ألا يتجاوز 200 حرف.'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'وصف الصورة يجب ألا يتجاوز 1000 حرف.'],
    },
    dateTime: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient user photo lookups
photoSchema.index({ userId: 1 });

module.exports = mongoose.model('Photo', photoSchema);