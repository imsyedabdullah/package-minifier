import fs from 'fs-extra';
import path from 'path';
import CleanCSS from 'clean-css';
import type { Config } from './index';
import type { OptionsOutput } from 'clean-css';

/**
 * Minify or copy CSS files.
 */
export const processCSSFile = (
	inputPath: string,
	outputPath: string,
	cssConfig: Config['css']
) => {
	const code = fs.readFileSync(inputPath, 'utf8');

	if (!cssConfig?.enabled) {
		fs.ensureDirSync(path.dirname(outputPath));
		fs.copyFileSync(inputPath, outputPath);
		console.log(`📄 Copied CSS (no minify): ${outputPath}`);
		return;
	}

	const cleanCSSOptions: OptionsOutput = {
		...(cssConfig.options || {}),
		returnPromise: false
	};

	const output = new CleanCSS(cleanCSSOptions).minify(code);

	if (output.errors.length > 0) {
		console.error(`❌ Error minifying CSS: ${inputPath}`, output.errors);
		return;
	}

	fs.ensureDirSync(path.dirname(outputPath));
	fs.writeFileSync(outputPath, output.styles, 'utf8');
	console.log(`✅ Minified CSS: ${outputPath}`);
};
