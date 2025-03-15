# 📂 Package Minifier

**Recursively Minify/Uglify JS, CSS, and HTML Files in a Directory While Preserving Folder Structure!**

## ✨ Features

✅ Minify/Uglify JavaScript files (with `uglify-js`)  
✅ Minify CSS files (with `clean-css`)  
✅ Minify HTML files (with `html-minifier`)  
✅ Preserve original folder structure  
✅ Highly configurable via `package-minifier.config.js` or `package-minifier.config.ts`  
✅ Exclude specific files or folders  
✅ Simple CLI interface  
✅ Works recursively across folders

## 📦 Installation

### Globally (Recommended)

```bash
npm install -g package-minifier
```

### Locally (Optional)

```bash
npm install package-minifier --save-dev
```

## 🚀 Usage

After installation, you can run it from any directory:

```bash
pkgmin
```

By default, it will:

1. Use the **current working directory** as the input folder.
2. Look for a config file named `package-minifier.config.js` (or use the default configuration).

## 🔧 Configuration

Place a file called `package-minifier.config.js` (or `package-minifier.config.ts`) in the **root** of your project directory.

### Basic Example (`package-minifier.config.js`)

```javascript
import {defineConfig} from "package-minifier";

export default defineConfig({
    excludeFiles: ["ignore.js", "skip-this.html"],
    excludeFolders: ["node_modules", "tests"],
    outputDir: "minified",

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
```

## 📁 How It Works

| Step | What Happens                                                 |
| ---- | ------------------------------------------------------------ |
| 1    | Recursively traverses files in the current working directory |
| 2    | Minifies JS, CSS, and HTML based on your config options      |
| 3    | Copies other file types unchanged                            |
| 4    | Preserves the original folder structure                      |
| 5    | Outputs everything into the `outputDir` directory            |

## 🛠 Options Explained

| Option           | Type       | Description                                                                             |
| ---------------- | ---------- | --------------------------------------------------------------------------------------- |
| `excludeFiles`   | `string[]` | List of files to exclude                                                                |
| `excludeFolders` | `string[]` | List of folders to exclude (recursively)                                                |
| `outputDir`      | `string`   | Output directory path (relative to current working dir)                                 |
| `js.enabled`     | `boolean`  | Enable/disable JS minification/uglification                                             |
| `js.options`     | `object`   | Options passed to `uglify-js` (see [docs](https://github.com/mishoo/UglifyJS))          |
| `css.enabled`    | `boolean`  | Enable/disable CSS minification                                                         |
| `css.options`    | `object`   | Options passed to `clean-css` (see [docs](https://github.com/jakubpawlowicz/clean-css)) |
| `html.enabled`   | `boolean`  | Enable/disable HTML minification                                                        |
| `html.options`   | `object`   | Options passed to `html-minifier` (see [docs](https://github.com/kangax/html-minifier)) |


## ✅ Example Folder Structure

```
project/
├── src/
│   ├── index.html
│   ├── style.css
│   └── scripts/
│       └── app.js
├── package-minifier.config.js
└── minified/    <-- outputDir (generated)
```

## ✅ Contributing

Pull requests are welcome! Here's how to contribute:

1. Fork the repo
2. Create a new branch
3. Commit your changes
4. Submit a PR 🚀

## ✅ License

MIT License © Syed Abdullah
