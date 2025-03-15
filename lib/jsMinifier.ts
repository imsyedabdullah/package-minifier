import fs from 'fs-extra';
import path from 'path';
import UglifyJS from 'uglify-js';
import type { Config } from './index';

/**
 * Minify or copy JS files.
 */
export const processJSFile = (
	inputPath: string,
	outputPath: string,
	jsConfig: Config['js']
) => {
	const code = fs.readFileSync(inputPath, 'utf8');

	if (!jsConfig?.enabled) {
		fs.ensureDirSync(path.dirname(outputPath));
		fs.copyFileSync(inputPath, outputPath);
		console.log(`📄 Copied JS (no minify): ${outputPath}`);
		return;
	}

	const result = UglifyJS.minify(code, jsConfig.options || {});

	if (result.error) {
		console.error(`❌ Error uglifying JS: ${inputPath}`, result.error);
		return;
	}

	fs.ensureDirSync(path.dirname(outputPath));
	fs.writeFileSync(outputPath, result.code || '', 'utf8');
	console.log(`✅ Minified JS: ${outputPath}`);
};
