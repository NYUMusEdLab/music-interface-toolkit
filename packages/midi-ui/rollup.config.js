import ts from '@wessberg/rollup-plugin-ts';

export default {
  plugins: [ts({ tsconfig: '../../tsconfig.json', include: ['src/**/*'] })],
  input: {
    dist: 'src/hooks.ts'
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
