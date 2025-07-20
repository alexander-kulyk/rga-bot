#!/usr/bin/env node

/**
 * Validation script to check if the server refactoring is working correctly
 * Usage: no    // Check 4: Wiki routes are intact
    console.    const requiredFiles = [
      'App.js',
      'server.js',
      'routes/wiki.js',
      'controllers/wikiController.js',
      'controllers/index.js',
      'scripts/update-wiki-chunks.js',
      'middlewares/logger.js',
      'middlewares/rateLimiter.js',
      'helpers/index.js',
      'helpers/textProcessing.js',
      'helpers/wikiApi.js',
      'helpers/fileOperations.js'
    ];. Checking wiki routes...');
    const wikiPath = path.join(__dirname, 'routes', 'wiki.js');
    const wikiContent = await fs.readFile(wikiPath, 'utf8');

    if (wikiContent.includes("router.post('/fetch-and-chunk'")) {
      console.log('   ✅ Wiki routes include fetch-and-chunk endpoint');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes missing fetch-and-chunk endpoint');
      checks.push(false);
    }
    
    // Check that wiki routes import from helpers
    if (wikiContent.includes("from '../helpers/index.js'")) {
      console.log('   ✅ Wiki routes import from helpers');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes not importing from helpers');
      checks.push(false);
    }

    // Check that wiki routes import from controllers
    if (wikiContent.includes("from '../controllers/wikiController.js'")) {
      console.log('   ✅ Wiki routes import from controllers');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes not importing from controllers');
      checks.push(false);
    }

    // Check 5: Package.json scriptsfactoring.js
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateRefactoring() {
  console.log('🔍 Validating server refactoring...\n');

  const checks = [];

  try {
    // Check 0: Environment variables
    console.log('0. Checking environment variables...');

    if (process.env.AZURE_DEVOPS_PAT) {
      console.log('   ✅ AZURE_DEVOPS_PAT is set');
      checks.push(true);
    } else {
      console.log('   ❌ AZURE_DEVOPS_PAT not set in environment');
      checks.push(false);
    }

    if (process.env.PORT) {
      console.log('   ✅ PORT is configured');
      checks.push(true);
    } else {
      console.log('   ⚠️  PORT not set, will use default');
      checks.push(true); // Not critical
    }

    // Check .env.example exists
    const envExamplePath = path.join(__dirname, '.env.example');
    try {
      await fs.access(envExamplePath);
      console.log('   ✅ .env.example file exists');
      checks.push(true);
    } catch {
      console.log('   ❌ .env.example file missing');
      checks.push(false);
    }

    // Check 1: App.js exists and has the right exports
    console.log('1. Checking App.js...');
    const appPath = path.join(__dirname, 'App.js');
    const appContent = await fs.readFile(appPath, 'utf8');

    if (appContent.includes('export default app')) {
      console.log('   ✅ App.js exports app correctly');
      checks.push(true);
    } else {
      console.log('   ❌ App.js missing default export');
      checks.push(false);
    }

    if (appContent.includes("app.use('/api/wiki'")) {
      console.log('   ✅ App.js includes wiki routes');
      checks.push(true);
    } else {
      console.log('   ❌ App.js missing wiki routes');
      checks.push(false);
    }

    // Check 2: server.js is clean and only has launch logic
    console.log('\n2. Checking server.js...');
    const serverPath = path.join(__dirname, 'server.js');
    const serverContent = await fs.readFile(serverPath, 'utf8');

    if (serverContent.includes("import app from './App.js'")) {
      console.log('   ✅ server.js imports App.js');
      checks.push(true);
    } else {
      console.log('   ❌ server.js not importing App.js');
      checks.push(false);
    }

    if (
      !serverContent.includes('app.use(') &&
      !serverContent.includes('app.get(')
    ) {
      console.log('   ✅ server.js contains no route definitions');
      checks.push(true);
    } else {
      console.log('   ❌ server.js still contains route definitions');
      checks.push(false);
    }

    if (serverContent.includes('app.listen(')) {
      console.log('   ✅ server.js contains server startup logic');
      checks.push(true);
    } else {
      console.log('   ❌ server.js missing server startup logic');
      checks.push(false);
    }

    // Check 3: Helper structure
    console.log('\n3. Checking helper structure...');

    const helperFiles = [
      'helpers/index.js',
      'helpers/textProcessing.js',
      'helpers/wikiApi.js',
      'helpers/fileOperations.js',
    ];

    for (const file of helperFiles) {
      const filePath = path.join(__dirname, file);
      try {
        await fs.access(filePath);
        console.log(`   ✅ ${file} exists`);
        checks.push(true);
      } catch {
        console.log(`   ❌ ${file} missing`);
        checks.push(false);
      }
    }

    // Check helper exports
    const helperIndexPath = path.join(__dirname, 'helpers', 'index.js');
    const helperIndexContent = await fs.readFile(helperIndexPath, 'utf8');

    const expectedExports = [
      'createTextChunks',
      'createWikiChunks',
      'fetchAllWikiPages',
      'fetchPageContent',
      'fetchAllPageContents',
      'saveChunksToFile',
    ];

    for (const exportName of expectedExports) {
      if (helperIndexContent.includes(exportName)) {
        console.log(`   ✅ Helper exports ${exportName}`);
        checks.push(true);
      } else {
        console.log(`   ❌ Helper missing export ${exportName}`);
        checks.push(false);
      }
    }

    // Check 4: Wiki routes are intact
    console.log('\n4. Checking wiki routes...');
    const wikiPath = path.join(__dirname, 'routes', 'wiki.js');
    const wikiContent = await fs.readFile(wikiPath, 'utf8');

    if (wikiContent.includes("router.post('/fetch-and-chunk'")) {
      console.log('   ✅ Wiki routes include fetch-and-chunk endpoint');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes missing fetch-and-chunk endpoint');
      checks.push(false);
    }

    // Check that wiki routes import from helpers
    if (wikiContent.includes("from '../helpers/index.js'")) {
      console.log('   ✅ Wiki routes import from helpers');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes not importing from helpers');
      checks.push(false);
    }

    // Check that wiki routes import from controllers
    if (wikiContent.includes("from '../controllers/wikiController.js'")) {
      console.log('   ✅ Wiki routes import from controllers');
      checks.push(true);
    } else {
      console.log('   ❌ Wiki routes not importing from controllers');
      checks.push(false);
    }

    // Check 5: Package.json scripts
    console.log('\n5. Checking package.json scripts...');
    const packagePath = path.join(__dirname, 'package.json');
    const packageContent = await fs.readFile(packagePath, 'utf8');
    const packageJson = JSON.parse(packageContent);

    if (packageJson.scripts['update-wiki']) {
      console.log('   ✅ update-wiki script available');
      checks.push(true);
    } else {
      console.log('   ❌ update-wiki script missing');
      checks.push(false);
    }

    // Check 6: Directory structure
    console.log('\n6. Checking directory structure...');

    const requiredFiles = [
      'App.js',
      'server.js',
      'routes/wiki.js',
      'scripts/update-wiki-chunks.js',
      'middlewares/logger.js',
      'middlewares/rateLimiter.js',
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(__dirname, file);
      try {
        await fs.access(filePath);
        console.log(`   ✅ ${file} exists`);
        checks.push(true);
      } catch {
        console.log(`   ❌ ${file} missing`);
        checks.push(false);
      }
    }

    // Check controller exports
    const controllerIndexPath = path.join(__dirname, 'controllers', 'index.js');
    const controllerIndexContent = await fs.readFile(
      controllerIndexPath,
      'utf8'
    );

    const expectedControllerExports = [
      'getWikiPages',
      'fetchAndChunkWikiContent',
      'getWikiChunks',
      'searchWikiChunks',
    ];

    for (const exportName of expectedControllerExports) {
      if (controllerIndexContent.includes(exportName)) {
        console.log(`   ✅ Controller exports ${exportName}`);
        checks.push(true);
      } else {
        console.log(`   ❌ Controller missing export ${exportName}`);
        checks.push(false);
      }
    }

    // Summary
    const passed = checks.filter(Boolean).length;
    const total = checks.length;

    console.log(`\n📊 Validation Summary: ${passed}/${total} checks passed`);

    if (passed === total) {
      console.log('🎉 All checks passed! Refactoring is successful.');
      console.log('\n🚀 You can now start the server with: npm start');
      console.log('📝 Available commands:');
      console.log('   npm start           - Start the server');
      console.log('   npm run dev         - Start in development mode');
      console.log('   npm run update-wiki - Update wiki chunks');
      console.log('   npm run test-wiki   - Test wiki endpoints');
    } else {
      console.log('❌ Some checks failed. Please review the issues above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

validateRefactoring();
