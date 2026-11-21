// JWT helpers (Track A - Bonus Project 4)
//
// A JWT has three Base64URL parts separated by dots: HEADER.PAYLOAD.SIGNATURE
//   header    -> { alg: "HS256", typ: "JWT" }
//   payload   -> { sub: "<user id>", iat: <issued at>, exp: <expires at> }
//   signature -> HMAC-SHA256(header + "." + payload, JWT_SECRET)
// The payload is only encoded, NOT encrypted, so it must never hold secrets (no password, no email).
// Changing even one character of the payload breaks the signature, so the server can trust a verified token.

const jwt = require('jsonwebtoken');

const ALGORITHM = 'HS256';

// Read lazily so dotenv has already run when these are called
const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not set. Add it to server/.env (see .env.example).');
  return secret;
};

// Create a signed token that identifies one user ("sub" = subject)
const signToken = (user) =>
  jwt.sign({ sub: user._id.toString() }, getSecret(), {
    algorithm: ALGORITHM,
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  });

// Returns the decoded payload, or throws (TokenExpiredError / JsonWebTokenError).
// The algorithm is pinned so a forged token cannot choose its own (e.g. "none").
const verifyToken = (token) => jwt.verify(token, getSecret(), { algorithms: [ALGORITHM] });

module.exports = { signToken, verifyToken };
