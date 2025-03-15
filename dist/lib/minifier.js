"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runMinifier = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const htmlMinifier_1 = require("./htmlMinifier");
const cssMinifier_1 = require("./cssMinifier");
const jsMinifier_1 = require("./jsMinifier");
/**
 * Run the minifier process.
 */
const runMinifier = (userConfigPath, baseDir) => {
    var _a, _b;
    const defaultConfigPath = path_1.default.join(__dirname, '..', 'config', 'package-minifier.config.js');
    let defaultConfig;
    try {
        defaultConfig = (_a = require(defaultConfigPath)) === null || _a === void 0 ? void 0 : _a.default;
        console.log('✅ Loaded default config.');
    }
    catch (err) {
        console.error(`❌ Failed to load default config: ${defaultConfigPath}`, err);
        process.exit(1);
    }
    let userConfig = {};
    if (userConfigPath) {
        try {
            userConfig = (_b = require(userConfigPath)) === null || _b === void 0 ? void 0 : _b.default;
            console.log('✅ Loaded user config:', userConfigPath);
        }
        catch (err) {
            console.error(`❌ Failed to load user config: ${userConfigPath}`, err);
            console.warn('➡️  Falling back to default config.');
        }
    }
    const config = {
        ...defaultConfig,
        ...userConfig,
        html: {
            ...defaultConfig.html,
            ...userConfig.html
        },
        css: {
            ...defaultConfig.css,
            ...userConfig.css
        },
        js: {
            ...defaultConfig.js,
            ...userConfig.js
        }
    };
    console.log(config);
    const { excludeFiles = [], excludeFolders = [], outputDir, html, css, js } = config;
    const inputDir = baseDir;
    const resolvedOutputDir = path_1.default.resolve(baseDir, outputDir);
    console.log(`📂 Input directory: ${inputDir}`);
    console.log(`📂 Output directory: ${resolvedOutputDir}`);
    const shouldExclude = (filePath) => {
        const relativePath = path_1.default.relative(inputDir, filePath);
        const parsed = path_1.default.parse(relativePath);
        const folderParts = relativePath.split(path_1.default.sep);
        if (folderParts.some((folder) => excludeFolders.includes(folder))) {
            return true;
        }
        if (excludeFiles.includes(parsed.base)) {
            return true;
        }
        return false;
    };
    const processFile = (filePath, srcRoot, destRoot) => {
        const relativePath = path_1.default.relative(srcRoot, filePath);
        const destPath = path_1.default.join(destRoot, relativePath);
        if (shouldExclude(filePath)) {
            console.log(`⚠️  Excluded: ${filePath}`);
            return;
        }
        const ext = path_1.default.extname(filePath).toLowerCase();
        if (ext === '.js') {
            (0, jsMinifier_1.processJSFile)(filePath, destPath, js);
        }
        else if (ext === '.css') {
            (0, cssMinifier_1.processCSSFile)(filePath, destPath, css);
        }
        else if (ext === '.html') {
            (0, htmlMinifier_1.processHTMLFile)(filePath, destPath, html);
        }
        else {
            fs_extra_1.default.ensureDirSync(path_1.default.dirname(destPath));
            fs_extra_1.default.copyFileSync(filePath, destPath);
            console.log(`📄 Copied other: ${destPath}`);
        }
    };
    const walkDir = (dir, srcRoot, destRoot) => {
        const entries = fs_extra_1.default.readdirSync(dir);
        entries.forEach((entry) => {
            const fullPath = path_1.default.join(dir, entry);
            const stats = fs_extra_1.default.statSync(fullPath);
            if (stats.isDirectory()) {
                if (excludeFolders.includes(entry)) {
                    console.log(`⚠️  Excluded folder: ${entry}`);
                    return;
                }
                walkDir(fullPath, srcRoot, destRoot);
            }
            else {
                processFile(fullPath, srcRoot, destRoot);
            }
        });
    };
    // Prepare output dir
    fs_extra_1.default.removeSync(resolvedOutputDir);
    console.log(`🚀 Starting minification...`);
    // Start traversal
    walkDir(inputDir, inputDir, resolvedOutputDir);
    console.log(`✅ All done! Output at: ${resolvedOutputDir}`);
};
exports.runMinifier = runMinifier;
