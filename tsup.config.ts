import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  outDir: 'dist',
  dts: false,
  format: ['cjs'],
  target: 'node16',
  minify: false,
  skipNodeModulesBundle: true,
  tsconfig: 'tsconfig.release.json',
  bundle: false,
  shims: false,
  keepNames: true,
  splitting: false,
});
