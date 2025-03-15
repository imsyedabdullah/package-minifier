"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processCSSFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const clean_css_1 = __importDefault(require("clean-css"));
/**
 * Minify or copy CSS files.
 */
const processCSSFile = (inputPath, outputPath, cssConfig) => {
    const code = fs_extra_1.default.readFileSync(inputPath, 'utf8');
    if (!(cssConfig === null || cssConfig === void 0 ? void 0 : cssConfig.enabled)) {
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.copyFileSync(inputPath, outputPath);
        console.log(`📄 Copied CSS (no minify): ${outputPath}`);
        return;
    }
    const cleanCSSOptions = {
        ...(cssConfig.options || {}),
        returnPromise: false
    };
    const output = new clean_css_1.default(cleanCSSOptions).minify(code);
    if (output.errors.length > 0) {
        console.error(`❌ Error minifying CSS: ${inputPath}`, output.errors);
        return;
    }
    fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
    fs_extra_1.default.writeFileSync(outputPath, output.styles, 'utf8');
    console.log(`✅ Minified CSS: ${outputPath}`);
};
exports.processCSSFile = processCSSFile;
