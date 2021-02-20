import path from 'path';
import { resolveFixture } from './utils';
import { createTestkit } from 'code-migrate/testing';
import fs from 'fs-extra';

const binFile = path.join(__dirname, '../bin/code-migrate');
const fixtures = resolveFixture('full-with-errors');
const migrationFile = path.join(fixtures, 'migration.ts');

test('reportFile markdown report', async () => {
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
