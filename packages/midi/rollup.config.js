import ts from '@wessberg/rollup-plugin-ts';

export default {
  plugins: [ts({ hook: { outputPath: path => path } })],
  input: {
    message: 'src/message/index.ts',
    file: 'src/file/index.ts',
    web: 'src/web/index.js'
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
