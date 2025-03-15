import fs from 'fs-extra';
import path from 'path';
import { processHTMLFile } from './htmlMinifier';
import { processCSSFile } from './cssMinifier';
import { processJSFile } from './jsMinifier';
import type { Config } from './index';

/**
 * Run the minifier process.
 */
export const runMinifier = (userConfigPath: string | null, baseDir: string): void => {
	const defaultConfigPath = path.join(__dirname, '..', 'config', 'package-minifier.config.js');

	let defaultConfig: Config;
	try {
		defaultConfig = require(defaultConfigPath)?.default;
		console.log('✅ Loaded default config.');
	} catch (err) {
		console.error(`❌ Failed to load default config: ${defaultConfigPath}`, err);
		process.exit(1);
	}

	let userConfig: Partial<Config> = {};
	if (userConfigPath) {
		try {
			userConfig = require(userConfigPath)?.default;
			console.log('✅ Loaded user config:', userConfigPath);
		} catch (err) {
			console.error(`❌ Failed to load user config: ${userConfigPath}`, err);
			console.warn('➡️  Falling back to default config.');
		}
	}

	const config: Config = {
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

	const {
		excludeFiles = [],
		excludeFolders = [],
		outputDir,
		html,
		css,
		js
	} = config;

	const inputDir = baseDir;
	const resolvedOutputDir = path.resolve(baseDir, outputDir);

	console.log(`📂 Input directory: ${inputDir}`);
	console.log(`📂 Output directory: ${resolvedOutputDir}`);

	const shouldExclude = (filePath: string): boolean => {
		const relativePath = path.relative(inputDir, filePath);
		const parsed = path.parse(relativePath);

		const folderParts = relativePath.split(path.sep);
		if (folderParts.some((folder) => excludeFolders.includes(folder))) {
			return true;
		}

		if (excludeFiles.includes(parsed.base)) {
			return true;
		}

		return false;
	};

	const processFile = (filePath: string, srcRoot: string, destRoot: string) => {
		const relativePath = path.relative(srcRoot, filePath);
		const destPath = path.join(destRoot, relativePath);

		if (shouldExclude(filePath)) {
			console.log(`⚠️  Excluded: ${filePath}`);
			return;
		}

		const ext = path.extname(filePath).toLowerCase();

		if (ext === '.js') {
			processJSFile(filePath, destPath, js);
		} else if (ext === '.css') {
			processCSSFile(filePath, destPath, css);
		} else if (ext === '.html') {
			processHTMLFile(filePath, destPath, html);
		} else {
			fs.ensureDirSync(path.dirname(destPath));
			fs.copyFileSync(filePath, destPath);
			console.log(`📄 Copied other: ${destPath}`);
		}
	};

	const walkDir = (dir: string, srcRoot: string, destRoot: string) => {
		const entries = fs.readdirSync(dir);

		entries.forEach((entry) => {
			const fullPath = path.join(dir, entry);
			const stats = fs.statSync(fullPath);

			if (stats.isDirectory()) {
				if (excludeFolders.includes(entry)) {
					console.log(`⚠️  Excluded folder: ${entry}`);
					return;
				}
				walkDir(fullPath, srcRoot, destRoot);
			} else {
				processFile(fullPath, srcRoot, destRoot);
			}
		});
	};

	// Prepare output dir
	fs.removeSync(resolvedOutputDir);
	console.log(`🚀 Starting minification...`);

	// Start traversal
	walkDir(inputDir, inputDir, resolvedOutputDir);

	console.log(`✅ All done! Output at: ${resolvedOutputDir}`);
};
