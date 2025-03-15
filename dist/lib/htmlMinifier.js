"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processHTMLFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const html_minifier_1 = require("html-minifier");
/**
 * Minify or copy HTML files.
 */
const processHTMLFile = (inputPath, outputPath, htmlConfig) => {
    const code = fs_extra_1.default.readFileSync(inputPath, 'utf8');
    if (!(htmlConfig === null || htmlConfig === void 0 ? void 0 : htmlConfig.enabled)) {
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.copyFileSync(inputPath, outputPath);
        console.log(`📄 Copied HTML (no minify): ${outputPath}`);
        return;
    }
    try {
        const result = (0, html_minifier_1.minify)(code, htmlConfig.options || {});
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.writeFileSync(outputPath, result, 'utf8');
        console.log(`✅ Minified HTML: ${outputPath}`);
    }
    catch (err) {
        console.error(`❌ Error minifying HTML: ${inputPath}`, err);
    }
};
exports.processHTMLFile = processHTMLFile;
