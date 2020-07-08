import ts from '@wessberg/rollup-plugin-ts';

export default {
  plugins: [
    ts({
      tsconfig: '../../tsconfig.json',
      include: ['src/**/*'],
    }),
  ],
  input: {
    index: 'src/osc.ts',
    cli: 'src/cli.ts',
  },
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js',
    chunkFileNames: 'shared/[name]-[hash].js',
  },
};
