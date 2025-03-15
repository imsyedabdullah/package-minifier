import type { Config } from './index';
/**
 * Minify or copy JS files.
 */
export declare const processJSFile: (inputPath: string, outputPath: string, jsConfig: Config["js"]) => void;
