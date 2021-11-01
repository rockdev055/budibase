import svelte from 'rollup-plugin-svelte';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import url from 'rollup-plugin-url';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import builtins from 'rollup-plugin-node-builtins';
import nodeglobals from 'rollup-plugin-node-globals';
import copy from 'rollup-plugin-copy';
import browsersync from "rollup-plugin-browsersync";
import proxy from "http-proxy-middleware";

const apiProxy =  proxy('/api', {
  target: 'http://localhost:4001/_builder',
  logLevel: "debug",
  changeOrigin: true,
  cookieDomainRewrite: true,
  onProxyReq(proxyReq) {
    if (proxyReq.getHeader("origin")) {
	  proxyReq.setHeader("origin", target)
    }
  }
});

const production = !process.env.ROLLUP_WATCH;

const lodash_fp_exports = ["union", "reduce", "isUndefined", "cloneDeep", "split", "some", "map", "filter", "isEmpty", "countBy", "includes", "last", "find", "constant", 
"take", "first", "intersection", "mapValues", "isNull", "has", "isNumber", "isString", "isBoolean", "isDate", "isArray", "isObject", "clone", "values", "keyBy", 
"keys", "orderBy", "concat", "reverse", "difference", "merge", "flatten", "each", "pull", "join", "defaultCase", "uniqBy", "every", "uniqWith", "isFunction", "groupBy", 
"differenceBy", "intersectionBy", "isEqual", "max", "sortBy", "assign"];

const lodash_exports = ["toNumber", "flow", "isArray", "join", "replace", "trim", "dropRight", "takeRight", "head", "isUndefined", "isNull", "isNaN", "reduce", "isEmpty", 
"constant", "tail", "includes", "startsWith", "findIndex", "isInteger", "isDate", "isString", "split", "clone", "keys", "isFunction", "merge", "has", "isBoolean", "isNumber", 
"isObjectLike", "assign", "some", "each", "find", "orderBy", "union", "cloneDeep"];

const writeoptions = {dest: "output/output.js"};

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'dist/bundle.js'
	},
	plugins: [
		copy({
			targets: [
				{ src: 'src/index.html', dest: 'dist' },
				{ src: 'src/favicon.png', dest: 'dist' }
			  ]
		}),

		svelte({
			// enable run-time checks when not in production
			dev: !production,
			include: 'src/**/*.svelte',
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('dist/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		
		}),
		commonjs({
			namedExports: {
				"lodash/fp": lodash_fp_exports,
				"lodash":lodash_exports,
				"shortid": ["generate"]
			},
			include: /node_modules/
		}),
		url({
			limit: 0, 
			include: ["**/*.woff2", "**/*.png"], 
			fileName: "[dirname][name][extname]",
			emitFiles: true
		}),
		url({
			limit: 0, 
			include: ["**/*.css"], 
			fileName: "[name][extname]",
			emitFiles: true
		}),
		builtins(),
		nodeglobals(),

		// Watch the `dist` directory and refresh the
		// browser on changes when not in production
		!production && livereload('dist'),
		!production && browsersync({
			server: 'dist',
			middleware: [apiProxy]
		}),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};
