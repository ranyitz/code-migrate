import arg from 'arg';
import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import { runMigration } from '../runMigration';

/**
 *
 * @param options.binName the name of the bin file, as presented in the --help output
 * @param options.migrationFile absolute path to the migrationFile
 * @param options.version path to the verison of the CLI (package.json's version)
 * @param options.subCommands create sub commands for multiple migrations on the same application
 */
export const createCli = async ({
  binName,
  migrationFile: customMigrationFile,
  version,
  subCommands,
}: {
  binName: string;
  migrationFile?: string;
  version: string;
  subCommands?: Record<string, { migrationFile: string }>;
}) => {
  process.on('unhandledRejection', (error) => {
    throw error;
  });

  const args = arg(
    {
      // Types
      '--version': Boolean,
      '--help': Boolean,
      '--verbose': Boolean,
      '--cwd': String,
      '--dry': Boolean,
      '--yes': Boolean,
      '--reportFile': String,
      '--reporter': String,

      // Aliases
      '-v': '--version',
      '-h': '--help',
      '-d': '--dry',
      '-y': '--yes',
    },
    {
      permissive: false,
    }
  );

  if (args['--version']) {
    console.log(version);
    process.exit(0);
  }

  const subCommand = args._[0];

  let migrationFile: string;

  if (subCommand && subCommands) {
    if (subCommand in subCommands) {
      migrationFile = subCommands[subCommand].migrationFile;
    } else {
      console.log(chalk.red`unknown command ${chalk.bold(subCommand)}`);
      console.log(chalk.red`Please use one of the following sub commands:`);

      Object.keys(subCommands).forEach((subCommand) => {
        console.log(chalk.red` > ${subCommand}`);
      });

      process.exit(1);
    }
  } else {
    migrationFile = customMigrationFile || args._[0];
  }

  let helpUsage = binName;

  if (subCommands) {
    const subCommandsString = Object.keys(subCommands).join('|');
    if (migrationFile) {
      helpUsage += ` [${subCommandsString}]`;
    } else {
      helpUsage += ` <${subCommandsString}>`;
    }
  } else if (!migrationFile) {
    helpUsage += ' <path/to/migration.ts>';
  }

  if (args['--help']) {
    console.log(`
        Usage
          $ ${helpUsage}

        Options
          --version, -v   Version number
          --help, -h      Displays this message
          --dry, -d       Dry-run mode, does not modify files
          --yes, -y       Skip all confirmation prompts. Useful in CI to automatically answer the confirmation prompt
          --cwd           Runs the migration on this directory [defaults to process.cwd()]
          --reporter      Choose a reporter ("default"/"quiet"/"markdown"/"path/to/custom/reporter")
          --reportFile    Create a markdown report and output it to a file [for example "report.md"]
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
    reportFile: args['--reportFile'],
    reporter: args['--reporter'],
  });
};
