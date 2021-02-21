import path from 'path';
import stripAnsi from 'strip-ansi';
import { resolveFixture, runMigrationAndGetOutput } from '../utils';
// TODO: Replace this package with native call after node v.15
// @ts-expect-error no types
import replaceAll from 'string.prototype.replaceall';

const stripDynamicContent = (output: string) => {
  output = output.replace(/📁 On: ([\w/\-_]+)/, '📁 On: /static-directory');
  output = output.replace(/> \/([\w/\-_]+)/, '> /static-directory');

  output = replaceAll(
    output,
    / {3}at( [\w.<>\d~!_:-]+)? \(?[\w.<>\d~!_/\\:-]+\)?/gim,
    '   at function (/path/to/file)'
  );

  return output;
};

describe('default reporter', () => {
  it('passing', async () => {
    const fixtures = resolveFixture('transform');
    const migrationFile = path.join(fixtures, 'migration.ts');

    let output = stripAnsi(
      await runMigrationAndGetOutput({
        fixtures,
        migrationFile,
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
      })
    );

    expect(stripDynamicContent(output)).toMatchSnapshot();
  });
});
