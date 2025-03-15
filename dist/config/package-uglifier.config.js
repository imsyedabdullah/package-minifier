"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../lib/index");
exports.default = (0, index_1.defineConfig)({
    excludeFiles: [],
    excludeFolders: ['node_modules', '.git', 'vendor'],
    outputDir: 'minified',
    html: {
        enabled: true,
        options: {
            collapseWhitespace: true,
            removeComments: true,
            minifyCSS: true,
            minifyJS: true
        }
    },
    css: {
        enabled: true,
        options: {
            level: 2
        }
    },
    js: {
        enabled: true,
        options: {
            compress: {
                drop_console: true
            },
            mangle: true,
            output: {
                comments: false
            }
        }
    }
});
