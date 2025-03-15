import fs from 'fs-extra';
import path from 'path';
import { minify as minifyHTML } from 'html-minifier';
import type { Config } from './index';

/**
 * Minify or copy HTML files.
 */
export const processHTMLFile = (
	inputPath: string,
	outputPath: string,
	htmlConfig: Config['html']
) => {
	const code = fs.readFileSync(inputPath, 'utf8');

	if (!htmlConfig?.enabled) {
		fs.ensureDirSync(path.dirname(outputPath));
		fs.copyFileSync(inputPath, outputPath);
		console.log(`📄 Copied HTML (no minify): ${outputPath}`);
		return;
	}

	try {
		const result = minifyHTML(code, htmlConfig.options || {});
		fs.ensureDirSync(path.dirname(outputPath));
		fs.writeFileSync(outputPath, result, 'utf8');
		console.log(`✅ Minified HTML: ${outputPath}`);
	} catch (err) {
		console.error(`❌ Error minifying HTML: ${inputPath}`, err);
	}
};
