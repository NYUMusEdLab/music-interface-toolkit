import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import ts from '@wessberg/rollup-plugin-ts';

export default {
  external: ['react'],
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css'],
      modules: true,
    }),
    ts({
      tsconfig: '../../tsconfig.json',
      include: ['src/**/*'],
      transpiler: 'babel',
    }),
  ],
  input: {
    chord: 'src/chord/index.ts',
    pitch: 'src/pitch/index.ts',
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
