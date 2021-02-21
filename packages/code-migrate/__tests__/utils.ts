import execa from 'execa';
import path from 'path';
import { createTestkit } from '../src/testing/createTestkit';

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

  return output;
};
