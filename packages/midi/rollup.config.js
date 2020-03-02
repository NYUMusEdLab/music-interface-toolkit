import ts from '@wessberg/rollup-plugin-ts';

export default {
  plugins: [ts({ tsconfig: '../../tsconfig.json', include: ['src/**/*'] })],
  input: {
    data: 'src/data/index.ts',
    messages: 'src/messages/index.ts',
    file: 'src/file/index.ts',
    'file/messages': 'src/file/messages/index.ts',
    web: 'src/web/index.ts'
  },
  output: {
    dir: '.',
    format: 'esm',
    entryFileNames: '[name]/index.js',
    chunkFileNames: 'shared/[name]-[hash].js'
  }
};
