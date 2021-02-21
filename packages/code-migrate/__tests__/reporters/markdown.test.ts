import path from 'path';
import { resolveFixture, runMigrationAndGetOutput } from '../utils';
import stripAnsi from 'strip-ansi';
// TODO: Replace this package with native call after node v.15
// @ts-expect-error no types
import replaceAll from 'string.prototype.replaceall';

const stripDynamicContent = (output: string) => {
  output = output.replace(/> \/([\w/\-_]+)/, '> /static-directory');

  output = replaceAll(
    output,
    / {3}at( [\w.<>\d~!_:-]+)? \(?[\w.<>\d~!_/\\:-]+\)?/gim,
    '   at function (/path/to/file)'
  );

  return output;
};

describe('markdown reporter', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    let output = stripAnsi(
      await runMigrationAndGetOutput({
        fixtures,
        migrationFile,
        reporterName: 'markdown',
      })
    );

    expect(stripDynamicContent(output)).toMatchSnapshot();
  });

  it('error', async () => {
    const fixtures = resolveFixture('error');
    const migrationFile = path.join(fixtures, 'migration.ts');

    const output = stripAnsi(
      await runMigrationAndGetOutput({
        fixtures,
        migrationFile,
        reporterName: 'markdown',
      })
    );

    expect(stripDynamicContent(output)).toMatchSnapshot();
  });
});
