import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import ts from '@wessberg/rollup-plugin-ts';

import path from 'path';

export default {
  external: ['react'],
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css'],
    }),
    ts({
      tsconfig: 'tsconfig.json',
      include: ['src/**/*'],
      transpiler: 'babel',
      cwd: path.join(__dirname, '../..'),
    }),
  ],
  input: {
    'dist/index': 'src/index.ts',
  },
  output: {
    dir: '.',
    format: 'esm',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
