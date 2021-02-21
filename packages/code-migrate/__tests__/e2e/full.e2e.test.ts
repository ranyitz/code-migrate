import path from 'path';
import { resolveFixture } from '../utils';
import { createTestkit } from 'code-migrate/testing';

const binFile = path.join(__dirname, '../../bin/code-migrate');
const fixtures = resolveFixture('full');
const migrationFile = path.join(fixtures, 'migration.ts');

createTestkit({
  migrationFile,
  command: ['node', binFile, migrationFile, '--yes', '--reporter=quiet'],
}).test({
  fixtures,
});
