import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Validating ES6 Modules Setup...\n');

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

console.log('📦 Package.json validation:');
console.log(`✅ Name: ${packageJson.name}`);
console.log(`✅ Type: ${packageJson.type || 'Not set (will use CommonJS)'}`);
console.log(`✅ Main: ${packageJson.main}`);

if (packageJson.type === 'module') {
  console.log('🎉 ES6 Modules are enabled!\n');
} else {
  console.log(
    '⚠️  ES6 Modules not enabled. Add "type": "module" to package.json\n'
  );
}

// Check if all files exist
const files = [
  'server.js',
  'middlewares/errorHandler.js',
  'middlewares/rateLimiter.js',
  'middlewares/auth.js',
  'middlewares/logger.js',
  'routes/api.js',
  'routes/wiki.js',
];

console.log('📁 File existence check:');
files.forEach((file) => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
});

console.log('\n🚀 ES6 Modules validation complete!');
