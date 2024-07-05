'use strict';
const { spawnPromisified } = require('../common');
const { match, strictEqual } = require('node:assert');
const { test } = require('node:test');

test('eval typescript esm syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--input-type=module',
    '--experimental-strip-types',
    '--eval',
    `import util from 'node:util'
    const text: string = 'Hello, TypeScript!'
    console.log(util.styleText('red', text));`]);
  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('eval typescript cjs syntax', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--input-type=commonjs',
    '--experimental-strip-types',
    '--eval',
    `const util = require('node:util');
    const text: string = 'Hello, TypeScript!'
    console.log(util.styleText('red', text));`]);
  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('eval typescript cjs syntax by default', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    '--eval',
    `const util = require('node:util');
    const text: string = 'Hello, TypeScript!'
    console.log(util.styleText('red', text));`]);
  match(result.stdout, /Hello, TypeScript!/);
  strictEqual(result.stderr, '');
  strictEqual(result.code, 0);
});

test('fail typescript esm syntax if not specified', async () => {
  const result = await spawnPromisified(process.execPath, [
    '--experimental-strip-types',
    '--eval',
    `import util from 'node:util'
    const text: string = 'Hello, TypeScript!'
    console.log(util.styleText('red', text));`]);
  strictEqual(result.stdout, '');
  match(result.stderr, /Cannot use import statement outside a module/);
  strictEqual(result.code, 1);
});
