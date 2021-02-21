import path from 'path';
import {
  resolveFixture,
  runMigrationAndGetOutput,
  sanitizeStacktrace,
} from '../utils';

const sanitizeDynamicContent = (output: string) => {
  output = output.replace(/> \/([\w/\-_]+)/, '> /static-directory');

  return sanitizeStacktrace(output);
};

describe('markdown reporter', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    let output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
      reporterName: 'markdown',
    });

    expect(sanitizeDynamicContent(output)).toMatchSnapshot();
  });

  it('error', async () => {
    const fixtures = resolveFixture('error');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = await runMigrationAndGetOutput({
      fixtures,
      migrationFile,
      reporterName: 'markdown',
    });

    expect(sanitizeDynamicContent(output)).toMatchSnapshot();
  });
});
