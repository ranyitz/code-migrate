process.on('unhandledRejection', (error) => {
  throw error;
});
import arg from 'arg';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { Migration, RegisterTasks } from './Migration';
import { register as tsNodeRegister } from 'ts-node';

export type Migrate = (
  title: string,
  fn: (RegisterTasks: RegisterTasks) => void
) => void;

const args = arg(
  {
    // Types
    '--version': Boolean,
    '--help': Boolean,
    '--verbose': Boolean,
    '--cwd': String,
    '--dry': Boolean,

    // Aliases
    '-v': '--version',
    '-h': '--help',
  },
  {
    permissive: true,
  }
);

const migrationFile = args._[0];

if (!migrationFile && args['--help']) {
  console.log(`
    Usage
      $ migratejs <path/to/migration/file.[tj]s>

      Options
      --version, -v   Version number
      --help, -h      Displays this message
      --dry           Dry-run mode, does not modify files
      --cwd           Runs the migration on this directory [defaults to process.cwd()]
  `);

  process.exit(0);
}

const migrationFileAbsolutePath = path.join(process.cwd(), migrationFile);

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

const migration = Migration.create({ cwd });

const migrate: Migrate = (title, fn) => {
  fn(migration.registerTaskMethods);
};

// @ts-expect-error not sure how to type this
globalThis.migrate = migrate;

tsNodeRegister({
  transpileOnly: true,
  dir: cwd,
});

require(migrationFileAbsolutePath);

const fileActions = migration.prepare();

if (args['--dry']) {
  console.log(chalk.bold('dry-run mode, no files will be modified'));
  console.log();
  console.log(fileActions);
} else {
  migration.execute(fileActions);
}
