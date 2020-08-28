import resolve from 'rollup-plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import ts from '@wessberg/rollup-plugin-ts';

export default {
  external: ['react'],
  plugins: [
    resolve(),
    postcss({
      extensions: ['.css'],
    }),
    ts({
      tsconfig: '../../tsconfig.json',
      include: ['src/**/*'],
      transpiler: 'babel',
      babelConfig: '../../babel.config.js',
    }),
  ],
  input: {
    accidental: 'src/Accidental.tsx',
    pitch: 'src/Pitch.tsx',
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
