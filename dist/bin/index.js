#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const minifier_1 = require("../lib/minifier");
const cwd = process.cwd();
let configPath = null;
const jsConfig = path_1.default.join(cwd, 'package-minifier.config.js');
const tsConfig = path_1.default.join(cwd, 'package-minifier.config.ts');
// ✅ Prefer JS config, then fallback to TS config
if (fs_1.default.existsSync(jsConfig)) {
    configPath = jsConfig;
    console.log(`🔧 Using user config: ${configPath}`);
}
else if (fs_1.default.existsSync(tsConfig)) {
    configPath = tsConfig;
    console.log(`🔧 Using user config: ${configPath}`);
}
else {
    console.log('⚠️  No user config found. Using default configuration.');
}
(0, minifier_1.runMinifier)(configPath, cwd);
