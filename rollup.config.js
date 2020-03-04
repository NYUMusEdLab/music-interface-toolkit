import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import ts from '@wessberg/rollup-plugin-ts';

export default {
  external: ['react'],
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css']
    }),
    ts({
      tsconfig: '../../tsconfig.json',
      include: ['src/**/*'],
      transpiler: 'babel'
    })
  ],
  input: {
    dist: 'src/index.js'
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
