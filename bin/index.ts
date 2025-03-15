#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import { runMinifier } from '../lib/minifier';

const cwd = process.cwd();

let configPath: string | null = null;

const jsConfig = path.join(cwd, 'package-minifier.config.js');
const tsConfig = path.join(cwd, 'package-minifier.config.ts');

// ✅ Prefer JS config, then fallback to TS config
if (fs.existsSync(jsConfig)) {
  configPath = jsConfig;
  console.log(`🔧 Using user config: ${configPath}`);
} else if (fs.existsSync(tsConfig)) {
  configPath = tsConfig;
  console.log(`🔧 Using user config: ${configPath}`);
} else {
  console.log('⚠️  No user config found. Using default configuration.');
}

runMinifier(configPath, cwd);
