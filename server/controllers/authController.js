// Auth controller - registration, login and current-user lookup
// register and login both return a signed JWT (see utils/token.js)
// Input is already validated/normalised by the Joi middleware in the routes.

const User = require('../models/User');
const { signToken } = require('../utils/token');

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, location, description, occupation } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'البريد الإلكتروني مستخدم بالفعل.' });
    }

    // Password is hashed with bcrypt in the User model's pre-save hook
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      location: location || undefined,
      description: description || undefined,
      occupation: occupation || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'تم إنشاء حسابك بنجاح. يمكنك الآن تسجيل الدخول.',
      token: signToken(user),
      user: user.toPublic(),
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // password has select:false, so it must be requested explicitly for comparison
    const user = await User.findOne({ email }).select('+password');
    const isMatch = user ? await user.matchPassword(password) : false;

    // Same message for unknown email and wrong password (no account enumeration)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة.' });
    }

    // Remember when the user last logged in: send the PREVIOUS login time back
    // (shown as "last login") and store the current one for next time.
    const previousLogin = user.lastLoginAt || null;
    user.lastLoginAt = new Date();
    await user.save({ validateBeforeSave: false }); // password is not modified, so it is not re-hashed

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح.',
      token: signToken(user),
      user: { ...user.toPublic(), lastLogin: previousLogin },
    });
  } catch (error) {
    next(error);
  }
};

// Lets the client confirm that a stored session still belongs to an existing user
const me = (req, res) => {
  res.json({ success: true, user: req.user.toPublic() });
};

module.exports = { register, login, me };
