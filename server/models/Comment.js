// Mongoose schema for Comment collection
// Following patterns from Lecture 13

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    photoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Photo',
      required: [true, 'يجب أن ينتمي التعليق إلى صورة.'],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'يجب أن يكون للتعليق كاتب.'],
    },
    comment: {
      type: String,
      required: [true, 'نص التعليق مطلوب.'],
      trim: true,
      maxlength: [1000, 'التعليق يجب ألا يتجاوز 1000 حرف.'],
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

// Index for efficient photo comment lookups
commentSchema.index({ photoId: 1 });

module.exports = mongoose.model('Comment', commentSchema);