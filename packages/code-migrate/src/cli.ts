process.on('unhandledRejection', (error) => {
  throw error;
});

import arg from 'arg';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { runMigration } from './runMigration';

(async function () {
  const args = arg(
    {
      // Types
      '--version': Boolean,
      '--help': Boolean,
      '--verbose': Boolean,
      '--cwd': String,
      '--dry': Boolean,
      '--yes': Boolean,
      '--quiet': Boolean,

      // Aliases
      '-v': '--version',
      '-h': '--help',
      '-d': '--dry',
      '-y': '--yes',
      '-q': '--quiet',
    },
    {
      permissive: false,
    }
  );

  if (args['--version']) {
    console.log(require('../package.json').version);
    process.exit(0);
  }

  const migrationFile = args._[0];

  if (!migrationFile && args['--help']) {
    console.log(`
      Usage
        $ migrate <path/to/migration.ts>

      Options
        --version, -v   Version number
        --help, -h      Displays this message
        --dry, -d       Dry-run mode, does not modify files
        --yes, -y       Skip all confirmation prompts. Useful in CI to automatically answer the confirmation prompt
        --cwd           Runs the migration on this directory [defaults to process.cwd()]
        --quiet, -q     Runs on quite mode (does not print results)
    `);

    process.exit(0);
  }

  let migrationFileAbsolutePath;

  if (!path.isAbsolute(migrationFile)) {
    migrationFileAbsolutePath = path.join(process.cwd(), migrationFile);
  } else {
    migrationFileAbsolutePath = migrationFile;
  }

  if (!fs.existsSync(migrationFileAbsolutePath)) {
    console.error(
      chalk.red(
        `couldn't find a migration file on "${migrationFileAbsolutePath}"`
      )
    );

    process.exit(1);
  }

  const customCwd = args['--cwd'];
  const cwdAbsolutePath = customCwd && path.join(process.cwd(), customCwd);

  if (cwdAbsolutePath && !fs.existsSync(cwdAbsolutePath)) {
    console.error(chalk.red(`passed cwd "${cwdAbsolutePath}" does not exists`));
    process.exit(1);
  }

  const cwd = cwdAbsolutePath || process.cwd();

  await runMigration({
    cwd,
    migrationFilePath: migrationFileAbsolutePath,
    dry: !!args['--dry'],
    yes: !!args['--yes'],
    quite: !!args['--quiet'],
  });
})();
