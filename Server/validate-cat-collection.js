#!/usr/bin/env node

/**
 * Simple validation script to verify Cat collection is properly set up
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function validateCatCollection() {
  console.log('🔍 Validating Cat collection setup...\n');

  const checks = [];

  try {
    // Check 1: Cat schema exists
    console.log('1. Checking Cat schema...');
    const schemaPath = path.join(__dirname, 'models', 'catSchema.js');
    const schemaContent = await fs.readFile(schemaPath, 'utf8');

    if (schemaContent.includes('const CatSchema = new Schema')) {
      console.log('   ✅ Cat schema defined');
      checks.push(true);
    } else {
      console.log('   ❌ Cat schema not found');
      checks.push(false);
    }

    if (schemaContent.includes("mongoose.model('Cat'")) {
      console.log('   ✅ Cat model exported');
      checks.push(true);
    } else {
      console.log('   ❌ Cat model not exported');
      checks.push(false);
    }

    // Check 2: Cat controller exists
    console.log('\n2. Checking Cat controller...');
    const controllerPath = path.join(
      __dirname,
      'controllers',
      'catController.js'
    );
    const controllerContent = await fs.readFile(controllerPath, 'utf8');

    const controllerFunctions = [
      'getCats',
      'getCatById',
      'createCat',
      'updateCat',
      'deleteCat',
    ];

    for (const func of controllerFunctions) {
      if (controllerContent.includes(`export const ${func}`)) {
        console.log(`   ✅ ${func} function defined`);
        checks.push(true);
      } else {
        console.log(`   ❌ ${func} function missing`);
        checks.push(false);
      }
    }

    // Check 3: Cat routes exist
    console.log('\n3. Checking Cat routes...');
    const routesPath = path.join(__dirname, 'routes', 'cat.js');
    const routesContent = await fs.readFile(routesPath, 'utf8');

    const routes = [
      "router.get('/', getCats)",
      "router.get('/:id', getCatById)",
      "router.post('/', createCat)",
      "router.put('/:id', updateCat)",
      "router.delete('/:id', deleteCat)",
    ];

    for (const route of routes) {
      if (routesContent.includes(route)) {
        console.log(`   ✅ Route defined: ${route}`);
        checks.push(true);
      } else {
        console.log(`   ❌ Route missing: ${route}`);
        checks.push(false);
      }
    }

    // Check 4: Routes registered in app.js
    console.log('\n4. Checking app.js integration...');
    const appPath = path.join(__dirname, 'app.js');
    const appContent = await fs.readFile(appPath, 'utf8');

    if (appContent.includes("import catRoutes from './routes/cat.js'")) {
      console.log("   ✅ Cat routes imported in app.js");
      checks.push(true);
    } else {
      console.log("   ❌ Cat routes not imported in app.js");
      checks.push(false);
    }

    if (appContent.includes("app.use('/api/cats', catRoutes)")) {
      console.log("   ✅ Cat routes registered at /api/cats");
      checks.push(true);
    } else {
      console.log("   ❌ Cat routes not registered in app.js");
      checks.push(false);
    }

    // Summary
    const passed = checks.filter(Boolean).length;
    const total = checks.length;

    console.log(`\n📊 Validation Summary: ${passed}/${total} checks passed`);

    if (passed === total) {
      console.log('🎉 All checks passed! Cat collection is properly set up.');
      console.log('\n📝 Available endpoints:');
      console.log('   GET    /api/cats     - Get all cats');
      console.log('   GET    /api/cats/:id - Get a cat by ID');
      console.log('   POST   /api/cats     - Create a new cat');
      console.log('   PUT    /api/cats/:id - Update a cat');
      console.log('   DELETE /api/cats/:id - Delete a cat');
    } else {
      console.log('❌ Some checks failed. Please review the issues above.');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

validateCatCollection();
