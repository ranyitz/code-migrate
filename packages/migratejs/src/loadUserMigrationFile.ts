import { register as tsNodeRegister } from 'ts-node';
import importFresh from 'import-fresh';
import { Migrate, Migration } from './Migration';

/**
 *
 * @param migration migration instance
 * @param migrationFile An absolute path to the users migration file
 */
export const loadUserMigrationFile = (
  migration: Migration,
  migrationFile: string
) => {
  // Load user's migration file
  const migrate: Migrate = (title, fn) => {
    fn(migration.registerTaskMethods, migration.options);
  };

  // @ts-expect-error not sure how to type this
  globalThis.migrate = migrate;

  tsNodeRegister({
    transpileOnly: true,
    dir: migration.options.cwd,
  });

  importFresh(migrationFile);
};
