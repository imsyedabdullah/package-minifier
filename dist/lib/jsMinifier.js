"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processJSFile = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const uglify_js_1 = __importDefault(require("uglify-js"));
/**
 * Minify or copy JS files.
 */
const processJSFile = (inputPath, outputPath, jsConfig) => {
    const code = fs_extra_1.default.readFileSync(inputPath, 'utf8');
    if (!(jsConfig === null || jsConfig === void 0 ? void 0 : jsConfig.enabled)) {
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
        fs_extra_1.default.copyFileSync(inputPath, outputPath);
        console.log(`📄 Copied JS (no minify): ${outputPath}`);
        return;
    }
    const result = uglify_js_1.default.minify(code, jsConfig.options || {});
    if (result.error) {
        console.error(`❌ Error uglifying JS: ${inputPath}`, result.error);
        return;
    }
    fs_extra_1.default.ensureDirSync(path_1.default.dirname(outputPath));
    fs_extra_1.default.writeFileSync(outputPath, result.code || '', 'utf8');
    console.log(`✅ Minified JS: ${outputPath}`);
};
exports.processJSFile = processJSFile;
