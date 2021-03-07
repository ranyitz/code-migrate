import execa from 'execa';
import path from 'path';
import stripAnsi from 'strip-ansi';
// TODO: Replace this package with native call after node v.15
// @ts-expect-error no types
import replaceAll from 'string.prototype.replaceall';
import { createTestkit } from '../src/testing/createTestkit';

const root = path.join(__dirname, '../../../');

export const tsNodeBin = path.join(root, 'node_modules/.bin/ts-node');
export const tsConfigPath = path.join(root, 'tsconfig.json');

const binFile = path.join(__dirname, '../bin/code-migrate');

export const resolveFixture = (fixtureName: string): string => {
  return path.resolve(__dirname, 'fixtures', fixtureName);
};

export const runMigrationAndGetOutput = async ({
  fixtures,
  migrationFile,
  reporterName,
}: {
  fixtures: string;
  migrationFile: string;
  reporterName?: string;
}) => {
  let output = '';

  const testkit = createTestkit({
    migrationFile,
    migrationFunction: async ({ cwd }) => {
      let { stdout } = await execa(
        'node',
        [
          binFile,
          migrationFile,
          '--yes',
          ...(reporterName ? [`--reporter=${reporterName}`] : []),
        ],
        {
          cwd,
        }
      );

      output = stdout;
    },
  });

  await testkit.run({
    fixtures,
  });

  return stripAnsi(output);
};

export const sanitizeStacktrace = (output: string) => {
  return replaceAll(
    output,
    / {3}at( [\w.<>\d~!_:-]+)? \(?[\w.<>\d~!_/\\:-]+\)?/gim,
    '   at function (/path/to/file)'
  );
};
