const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const publicDir = path.join(root, "public");
const files = [
  "index.html",
  "clown-prototype.html",
  "clown-prototype.css",
  "clown-prototype.js",
];

fs.mkdirSync(publicDir, { recursive: true });

for (const file of files) {
  fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
}

console.log(`Copied ${files.length} game files to public/`);
