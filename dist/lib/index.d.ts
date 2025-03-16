import type { MinifyOptions as JsOptions } from 'uglify-js';
import type { Options as CssOptions } from 'clean-css';
import type { Options as HtmlOptions } from 'html-minifier-terser';
export interface Config {
    excludeFiles: string[];
    excludeFolders: string[];
    outputDir: string;
    html: {
        enabled: boolean;
        options?: HtmlOptions;
    };
    css: {
        enabled: boolean;
        options?: CssOptions;
    };
    js: {
        enabled: boolean;
        options?: JsOptions;
    };
}
export declare function defineConfig(config: Partial<Config>): Partial<Config>;
