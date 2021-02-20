import path from 'path';
import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';
import fs from 'fs-extra';
import execa from 'execa';

const binFile = path.join(__dirname, '../bin/code-migrate');
const fixtures = resolveFixture('full-with-errors');
const migrationFile = path.join(fixtures, 'migration.ts');

describe('default reporter', () => {
  const testkit = createTestkit({
    migrationFile,
    migrationFunction: async ({ cwd }) => {
      await execa(
        'node',
        [binFile, migrationFile, '--yes', '--reportFile=report.md'],
        {
          cwd,
        }
      );
    },
  });

  test('reportFile', async () => {
    const { cwd } = await testkit.run({
      fixtures,
    });

    const reportPath = path.join(cwd, 'report.md');
    const report = fs.readFileSync(reportPath, 'utf-8');

    expect(report).toMatch('## automatic migration for my library');
    expect(report).toMatch('#### add the build directory to .gitignore');
    expect(report).toMatch('```\n.gitignore\n```');
    expect(report).toMatch('**ERROR** `cool-config.json`');
    expect(report).toMatch(
      '```\nSyntaxError: Unexpected token f in JSON at position 1'
    );
  });
});

describe('quiet reporter', () => {
  const testkit = createTestkit({
    migrationFile,
    command: [
      'node',
      binFile,
      migrationFile,
      '--yes',
      '--quiet',
      '--reportFile=report.md',
    ],
  });

  test('reportFile', async () => {
    const { cwd } = await testkit.run({
      fixtures,
    });

    const reportPath = path.join(cwd, 'report.md');
    const report = fs.readFileSync(reportPath, 'utf-8');

    expect(report).toMatch('## automatic migration for my library');
    expect(report).toMatch('#### add the build directory to .gitignore');
    expect(report).toMatch('```\n.gitignore\n```');
    expect(report).toMatch('**ERROR** `cool-config.json`');
    expect(report).toMatch(
      '```\nSyntaxError: Unexpected token f in JSON at position 1'
    );
  });
});
