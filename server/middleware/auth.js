// Protected-route middleware - stateless JWT authentication (Track A, Bonus Project 4)
//
// The client sends:   Authorization: Bearer <token>
// The server verifies the token's signature and expiry, then loads the user from MongoDB and attaches
// it to req.user, so ownership checks (delete photo / comment) still use database values.
// Nothing is stored on the server between requests: the signed token is the whole session.

const mongoose = require('mongoose');
const User = require('../models/User');
const { verifyToken } = require('../utils/token');

const unauthorized = (res, message) => res.status(401).json({ success: false, message });

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return unauthorized(res, 'يجب تسجيل الدخول أولاً.');
    }

    let payload;
    try {
      payload = verifyToken(token);
    } catch (err) {
      const message =
        err.name === 'TokenExpiredError'
          ? 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.'
          : 'رمز الدخول غير صالح. يرجى تسجيل الدخول مرة أخرى.';
      return unauthorized(res, message);
    }

    if (!mongoose.isValidObjectId(payload.sub)) {
      return unauthorized(res, 'رمز الدخول غير صالح. يرجى تسجيل الدخول مرة أخرى.');
    }

    // The account may have been deleted after the token was issued
    const user = await User.findById(payload.sub);
    if (!user) {
      return unauthorized(res, 'انتهت صلاحية الجلسة. يرجى تسجيل الدخول مرة أخرى.');
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = auth;
