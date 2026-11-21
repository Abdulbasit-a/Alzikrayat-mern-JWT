// Mongoose schema for User collection
// Following patterns from Lecture 13

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'الاسم الأول مطلوب.'],
      trim: true,
      maxlength: [50, 'الاسم الأول يجب ألا يتجاوز 50 حرفاً.'],
    },
    lastName: {
      type: String,
      required: [true, 'الاسم الأخير مطلوب.'],
      trim: true,
      maxlength: [50, 'الاسم الأخير يجب ألا يتجاوز 50 حرفاً.'],
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب.'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [100, 'البريد الإلكتروني يجب ألا يتجاوز 100 حرف.'],
      match: [/^\S+@\S+\.\S+$/, 'يرجى إدخال بريد إلكتروني صحيح.'],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة.'],
      minlength: [8, 'كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل.'],
      select: false, // Never return password in queries by default
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    occupation: {
      type: String,
      trim: true,
      maxlength: [100, 'Occupation cannot exceed 100 characters'],
    },
    // Time of the user's most recent successful login (shown as "last login" next time)
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password with bcrypt
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to get public profile (without password)
userSchema.methods.toPublic = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  delete obj.lastLoginAt; // internal; the API sends `lastLogin` explicitly on login
  return obj;
};

module.exports = mongoose.model('User', userSchema);