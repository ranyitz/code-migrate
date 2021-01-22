import chalk from 'chalk';
import prompts from 'prompts';
import { Migration } from './Migration';
import { createReport } from './createReport';
import { loadUserMigrationFile } from './loadUserMigrationFile';
import { isEmpty } from 'lodash';

type RunMigration = ({
  cwd,
  migrationFilePath,
  dry,
  yes,
}: {
  cwd: string;
  migrationFilePath: string;
  dry: boolean;
  yes: boolean;
}) => Promise<void>;

/**
 *
 * @param options.cwd The directory of the project which the migration runs on
 * @param options.migrationFilePath path to the migration file
 * @param options.dry dry run mode
 * @param options.yes do not prompt the user with confirmation
 * Run a migration
 *
 */
export const runMigration: RunMigration = async ({
  cwd,
  migrationFilePath,
  dry,
  yes,
}) => {
  const migration = Migration.create({ cwd });

  loadUserMigrationFile(migration, migrationFilePath);

  const fileActions = migration.getMigrationInstructions();

  if (dry) {
    console.log(chalk.bold('dry-run mode, no files will be modified'));
    console.log();
    console.log(createReport(fileActions));

    process.exit(0);
  }

  console.log();
  console.log(createReport(fileActions));

  if (isEmpty(fileActions)) {
    process.exit(0);
  }

  if (!yes) {
    // space the prompt
    console.log();
    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Do you want to perform the migration on the above files?',
      initial: true,
    });

    if (!response.value) {
      console.log('');
      console.log(chalk.red('Migration aborted'));
      process.exit(1);
    }
  }

  migration.run();

  console.log();
  console.log(chalk.green('The migration was done successfully 🎉'));
};
