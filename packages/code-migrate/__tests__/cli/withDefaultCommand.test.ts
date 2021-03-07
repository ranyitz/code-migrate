import path from 'path';
import { resolveFixture, tsConfigPath, tsNodeBin } from '../utils';
import { createTestkit } from 'code-migrate/testing';
import execa from 'execa';

const withDefaultCommandBin = path.join(__dirname, 'withDefaultCommand.ts');

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
    withDefaultCommandBin,
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
    withDefaultCommandBin,
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
    withDefaultCommandBin,
    '--help',
  ]);

  expect(stdout).toMatch('$ code-migrate [full]');
});
