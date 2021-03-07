import path from 'path';
import { resolveFixture, tsConfigPath, tsNodeBin } from '../utils';
import { createTestkit } from 'code-migrate/testing';
import execa from 'execa';

const onlySubCommandsBin = path.join(__dirname, 'onlySubCommands.ts');

const fixturesFull = resolveFixture('full');
const migrationFileFull = path.join(fixturesFull, 'migration.ts');

const fixturesTransform = resolveFixture('transform');
const migrationFileTransform = path.join(fixturesTransform, 'migration.ts');

createTestkit({
  migrationFile: migrationFileFull,
  command: [
    tsNodeBin,
    '-P',
    tsConfigPath,
    onlySubCommandsBin,
    'full',
    '--yes',
    '--reporter=quiet',
  ],
}).test({
  fixtures: fixturesFull,
});

createTestkit({
  migrationFile: migrationFileTransform,
  command: [
    tsNodeBin,
    '-P',
    tsConfigPath,
    onlySubCommandsBin,
    'transform',
    '--yes',
    '--reporter=quiet',
  ],
}).test({
  fixtures: fixturesTransform,
});

test('should render the help usage appropriately', () => {
  const { stdout } = execa.sync(tsNodeBin, [
    '-P',
    tsConfigPath,
    onlySubCommandsBin,
    '--help',
  ]);

  expect(stdout).toMatch('$ code-migrate <full|transform>');
});
