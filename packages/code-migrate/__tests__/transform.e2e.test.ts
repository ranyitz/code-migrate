import path from 'path';
import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

const binFile = path.join(__dirname, '../bin/migrate');
const fixtures = resolveFixture('transform');
const migrationFile = path.join(fixtures, 'migration.ts');

createTestkit({
  migrationFile,
  command: ['node', binFile, migrationFile, '--yes', '--quiet'],
}).test({
  fixtures,
});
