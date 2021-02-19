import prompts from 'prompts';
import { Migration } from './Migration';
import { loadUserMigrationFile } from './loadUserMigrationFile';
import { isEmpty } from 'lodash';
import type { TaskResult } from './types';

export type Results = { taskResults: TaskResult[]; options: { dry: boolean } };

type RunMigration = ({
  cwd,
  migrationFilePath,
  dry,
  yes,
  quiet,
}: {
  cwd: string;
  migrationFilePath: string;
  dry: boolean;
  yes: boolean;
  quiet: boolean;
}) => Promise<void>;

/**
 *
 * @param options.cwd The directory of the project which the migration runs on
 * @param options.migrationFilePath path to the migration file
 * @param options.dry dry run mode
 * @param options.yes do not prompt the user with confirmation
 * Run a migration
 * @param options.quiet runs on quiet mode (does not print the result)
 *
 */
export const runMigration: RunMigration = async ({
  cwd,
  migrationFilePath,
  dry,
  yes,
  quiet,
}) => {
  const migration = Migration.init({ cwd, quiet });
  const { events } = migration;

  await loadUserMigrationFile(migration, migrationFilePath);

  const taskResults = migration.getMigrationInstructions();

  const results: Results = { taskResults, options: { dry } };

  events.emit('migration-after-run', results);

  if (dry) {
    process.exit(0);
  }

  if (isEmpty(taskResults)) {
    process.exit(0);
  }

  if (!yes) {
    events.emit('migration-before-prompt');
    const response = await prompts({
      type: 'confirm',
      name: 'value',
      message: 'Do you want to perform the migration on the above files?',
      initial: true,
    });

    if (!response.value) {
      events.emit('migration-after-prompt-aborted');
      process.exit(1);
    }

    events.emit('migration-after-prompt-confirmed');
  }

  migration.write();

  events.emit('migration-after-write');
};
