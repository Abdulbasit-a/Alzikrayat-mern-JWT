// Replaces the JWT_SECRET placeholder in server/.env with a random 64-byte secret.
// Run automatically by start.bat on first launch; safe to run again (it never overwrites a real secret).
// Manual use:  node scripts/generateSecret.js

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.log('No server/.env found - copy .env.example to .env first.');
  process.exit(0);
}

let content = fs.readFileSync(envPath, 'utf8');
const match = content.match(/^JWT_SECRET=(.*)$/m);
const secret = crypto.randomBytes(64).toString('hex');

if (!match) {
  content = content.replace(/\s*$/, '\n') + `JWT_SECRET=${secret}\n`;
} else if (match[1].trim() === '' || match[1].startsWith('change-me')) {
  content = content.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${secret}`);
} else {
  console.log('JWT_SECRET is already set - nothing to do.');
  process.exit(0);
}

fs.writeFileSync(envPath, content);
console.log('Generated a new JWT_SECRET in server/.env');
