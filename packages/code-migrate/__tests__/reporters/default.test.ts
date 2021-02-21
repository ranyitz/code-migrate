import path from 'path';
import { resolveFixture, runMigrationAndGetOutput } from '../utils';

describe('default reporter', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    let output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
    });

    expect(output).toMatch('🏃‍ Running: transform');
    expect(output).toMatch('📁 On:');
    expect(output).toMatch('baz.json');
    expect(output).toMatch('READY');
    expect(output).toMatch('The migration has been completed successfully');
  });

  it('error', async () => {
    const fixtures = resolveFixture('error');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
    });

    expect(output).toMatch('🏃‍ Running: error');
    expect(output).toMatch('📁 On:');
    expect(output).toMatch(
      'The following migration tasks were failed, but you can still migrate the rest'
    );
    expect(output).toMatch('ERROR');
    expect(output).toMatch('baz.json');
  });
});
