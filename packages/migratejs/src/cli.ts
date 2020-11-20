process.on('unhandledRejection', (error) => {
  throw error;
});
import arg from 'arg';
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
      --cwd           Runs the migration on this directory [defaults to process.cwd()]
  `);

  process.exit(0);
}

if (!fs.existsSync(migrationFile)) {
  console.error(
    chalk.red(`couldn't find a migration file on "${migrationFile}"`)
  );
  process.exit(1);
}

const customCwd = args['--cwd'];

if (customCwd && !fs.existsSync(customCwd)) {
  console.error(chalk.red(`passed cwd "${customCwd}" does not exists`));
  process.exit(1);
}

const cwd = customCwd || process.cwd();

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

require(migrationFile);

migration.run();
