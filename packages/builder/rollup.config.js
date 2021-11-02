import alias from "@rollup/plugin-alias"
import svelte from "rollup-plugin-svelte"
import resolve from "rollup-plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import url from "rollup-plugin-url"
import livereload from "rollup-plugin-livereload"
import { terser } from "rollup-plugin-terser"
import builtins from "rollup-plugin-node-builtins"
import nodeglobals from "rollup-plugin-node-globals"
import copy from "rollup-plugin-copy"
import css from "rollup-plugin-css-only"
import replace from "rollup-plugin-replace"
import json from "@rollup/plugin-json"
import html from "rollup-plugin-html"

import path from "path"

const production = !process.env.ROLLUP_WATCH
const outputpath = "../server/builder"
const coreExternal = [
  "lodash",
  "lodash/fp",
  "date-fns",
  "lunr",
  "safe-buffer",
  "shortid",
  "@nx-js/compiler-util",
]

const customResolver = resolve({
  extensions: [
    ".mjs",
    ".js",
    ".jsx",
    ".json",
    ".sass",
    ".scss",
    ".svelte",
    ".css",
  ],
})
const projectRootDir = path.resolve(__dirname)

export default {
  input: "src/main.js",
  output: {
    sourcemap: true,
    format: "iife",
    name: "app",
    file: `${outputpath}/bundle.js`,
  },
  plugins: [
    alias({
      entries: [
        {
          find: "components",
          replacement: path.resolve(projectRootDir, "src/components"),
        },
        {
          find: "builderStore",
          replacement: path.resolve(projectRootDir, "src/builderStore"),
        },
        {
          find: "constants",
          replacement: path.resolve(projectRootDir, "src/constants"),
        },
        {
          find: "analytics",
          replacement: path.resolve(projectRootDir, "src/analytics"),
        },
      ],
      customResolver,
    }),
    copy({
      targets: [
        { src: "src/index.html", dest: outputpath },
        { src: "src/favicon.png", dest: outputpath },
        { src: "assets", dest: outputpath },
        {
          src: "node_modules/@budibase/client/dist/budibase-client.esm.mjs",
          dest: outputpath,
        },
        {
          src: "node_modules/@budibase/bbui/dist/bbui.css",
          dest: outputpath,
        },
        {
          src: "node_modules/remixicon/fonts/*",
          dest: outputpath,
        },
      ],
    }),

    replace({
      "process.env.NODE_ENV": JSON.stringify(
        production ? "production" : "development"
      ),
      "process.env.POSTHOG_TOKEN": JSON.stringify(process.env.POSTHOG_TOKEN),
      "process.env.POSTHOG_URL": JSON.stringify(process.env.POSTHOG_URL),
      "process.env.SENTRY_DSN": JSON.stringify(process.env.SENTRY_DSN),
    }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      include: [
        "src/**/*.svelte",
        "node_modules/**/*.svelte",
        "../../../bbui/src/**/*.svelte",
      ],
      // we'll extract any component CSS out into
      // a separate file — better for performance
      css: css => {
        css.write("bundle.css")
      },
    }),

    // export all CSS imported in the JS to it's own bundle
    css({
      output: `${outputpath}/external.css`,
    }),

    resolve({
      browser: true,
      dedupe: importee => {
        return (
          importee === "svelte" ||
          importee.startsWith("svelte/") ||
          coreExternal.includes(importee)
        )
      },
    }),
    commonjs(),
    url({
      limit: 0,
      include: ["**/*.woff2", "**/*.png"],
      fileName: "[dirname][name][extname]",
      emitFiles: true,
    }),
    builtins(),
    nodeglobals(),

    // Watch the `dist` directory and refresh the
    // browser on changes when not in production
    !production && livereload({ watch: outputpath, delay: 500 }),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
    json(),
    html(),
  ],
}
