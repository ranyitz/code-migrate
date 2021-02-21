import path from 'path';
import {
  resolveFixture,
  runMigrationAndGetOutput,
  sanitizeStacktrace,
} from '../utils';

const sanitizeDynamicContent = (output: string) => {
  output = output.split('\n').slice(2).join('\n');
  return sanitizeStacktrace(output);
};

describe('default reporter', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    let output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
    });

    expect(sanitizeDynamicContent(output)).toMatchSnapshot();
  });

  it('error', async () => {
    const fixtures = resolveFixture('error');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
    });

    expect(sanitizeDynamicContent(output)).toMatchSnapshot();
  });
});
