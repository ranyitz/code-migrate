import path from 'path';
import execa from 'execa';
import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';

const binFile = path.join(__dirname, '../bin/migrate');

const runMigrationAndGetOutput = async ({
  fixtures,
  migrationFile,
}: {
  fixtures: string;
  migrationFile: string;
}) => {
  let output;

  const testkit = createTestkit({
    migrationFile,
    migrationFunction: async ({ cwd }) => {
      let { stdout } = await execa('node', [binFile, migrationFile, '--yes'], {
        cwd,
      });

      output = stdout;
    },
  });

  await testkit.run({
    fixtures,
  });

  return output;
};

describe('output', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = await runMigrationAndGetOutput({ fixtures, migrationFile });

    expect(output).toMatch('🏃‍ Running: transform');
    expect(output).toMatch('📁 On:');
    expect(output).toMatch('transform bar to baz in json contents');
    expect(output).toMatch('PASS baz.json');
    expect(output).toMatch('The migration was done successfully 🎉');
  });

  it('error', async () => {
    const fixtures = resolveFixture('error');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = await runMigrationAndGetOutput({ fixtures, migrationFile });
    expect(output).toMatch(
      '⚠️  The following migration tasks were failed, but you can still migrate the rest ⚠️'
    );

    expect(output).toMatch('ERROR baz.json');
    expect(output).toMatch(
      'SyntaxError: Unexpected token } in JSON at position 18'
    );
    expect(output).toMatch('at JSON.parse (<anonymous>)');
    expect(output).toMatch('🤷‍ No changes have been made');
  });
});
