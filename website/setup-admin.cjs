#!/usr/bin/env node
// Usage: node setup-admin.cjs dittLösenord
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const password = process.argv[2];
if (!password) {
  console.error("Usage: node setup-admin.cjs <password>");
  process.exit(1);
}

bcrypt.hash(password, 10).then((hash) => {
  const hashFile = path.join(__dirname, ".admin-hash");
  fs.writeFileSync(hashFile, hash, "utf8");
  console.log("✓ Admin-hash sparad i .admin-hash");
  console.log("  Starta om servern: pm2 restart step-website");
});
