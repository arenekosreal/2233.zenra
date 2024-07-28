import { defineExternal, definePlugins } from '@gera2ld/plaid-rollup';
import { defineConfig } from 'rollup';
import userscript from 'rollup-plugin-userscript';
// https://github.com/rollup/rollup/issues/5531#issuecomment-2134413022
import pkg from './package.json' with { type: 'json' };

export default defineConfig(
  Object.entries({
    '2233.zenra': 'src/2233.zenra/index.ts',
  }).map(([name, entry]) => ({
    input: entry,
    plugins: [
      ...definePlugins({
        esm: true,
        minimize: false,
        postcss: {
          inject: false,
          minimize: true,
        },
        extensions: ['.ts', '.tsx', '.mjs', '.js', '.jsx'],
      }),
      userscript((meta) =>
        meta
          .replace('process.env.AUTHOR', pkg.author)
          .replace('process.env.VERSION', pkg.version)
          .replace('process.env.LICENSE', pkg.license),
      ),
    ],
    external: defineExternal(['@violentmonkey/dom']),
    output: {
      format: 'iife',
      file: `dist/${name}.user.js`,
      globals: {
        // Note:
        // - VM.solid is just a third-party UMD bundle for solid-js since there is no official one
        // - If you don't want to use it, just remove `solid-js` related packages from `external`, `globals` and the `meta.js` file.
        '@violentmonkey/dom': 'VM',
      },
      indent: false,
    },
  })),
);
