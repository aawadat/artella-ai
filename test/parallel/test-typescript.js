'use strict';
const { spawnPromisified } = require('../common');
const fixtures = require('../common/fixtures');
const { match, strictEqual } = require('node:assert');
const { test } = require('node:test');

test('execute a typescript file', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-typescript.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('execute a typescript file with imports', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/b.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('execute a typescript with node_modules', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-typescript-node-modules.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('expect error when executing a typescript file with imports with no extensions', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-import-no-extension.ts'),
  ]);

  match(result.stderr, /Error \[ERR_MODULE_NOT_FOUND\]:/);
  strictEqual(result.stdout, '');
  strictEqual(result.code, 1);
});

test('expect error when executing a typescript file with enum', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-enums.ts'),
  ]);

  // This error should be thrown during transformation
  match(result.stderr, /TypeScript enum is not supported in strip-only mode/);
  strictEqual(result.stdout, '');
  strictEqual(result.code, 1);
});

test('expect error when executing a typescript file with experimental decorators', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-experimental-decorators.ts'),
  ]);
  // This error should be thrown during transformation
  match(result.stderr, /Decorators are not supported/);
  strictEqual(result.stdout, '');
  strictEqual(result.code, 1);
});

test('expect error when executing a typescript file with namespaces', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-namespaces.ts'),
  ]);
  // This error should be thrown during transformation
  match(result.stderr, /Unexpected identifier 'Validation'/);
  strictEqual(result.stdout, '');
  strictEqual(result.code, 1);
});

test('execute a typescript file with type definition', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-import-types.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('execute a typescript file with commonjs syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-commonjs-parsing.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('execute a typescript file with ts extensions and commonjs syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-ts-extension-commonjs-syntax.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('execute a mts file with commonjs syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-esmodule-typescript.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('expect failure of a ts file requiring esm syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-require-mts-module.ts'),
  ]);

  strictEqual(result.stdout, '');
  match(result.stderr, /Cannot use import statement outside a module/);
  strictEqual(result.code, 1);
});

test('expect typescript file to importing cjs syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    fixtures.path('typescript/test-import-cts-module.ts'),
  ]);

  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

// TODO(marco-ippolito) fix compatibility --experimental-require-module
test('expect failure of a ts file requiring esm syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    '--experimental-require-module',
    fixtures.path('typescript/test-require-mts-module.ts'),
  ]);

  strictEqual(result.stdout, '');
  match(result.stderr, /Cannot use import statement outside a module/);
  strictEqual(result.code, 1);
});
