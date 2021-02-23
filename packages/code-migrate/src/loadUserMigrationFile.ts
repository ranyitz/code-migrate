import path from 'path';
import importFresh from 'import-fresh';
import { Migration } from './Migration';
import type { Migrate } from './migrate';

/**
 *
 * @param migration migration instance
 * @param migrationFile An absolute path to the users migration file
 */
export const loadUserMigrationFile = async (
  migration: Migration,
  migrationFile: string
): Promise<void> => {
  return new Promise((resolve) => {
    // Load user's migration file
    const migrate: Migrate = async (title, fn) => {
      migration.title = title;
      migration.events.emit('migration-start', { migration });

      await fn(migration.registerMethods, {
        ...migration.options,
        fs: migration.fs,
      });

      resolve();
    };

    // @ts-expect-error not sure how to type this
    globalThis.migrate = migrate;

    if (migrationFile.endsWith('.ts')) {
      require('ts-node').register({
        dir: path.dirname(migrationFile),
        transpileOnly: true,
        ignore: [],
      });
    }

    if (typeof jest !== 'undefined') {
      jest.doMock('code-migrate', () => {
        return {
          __esModule: true,
          migrate,
        };
      });
    } else {
      require('mock-require')('code-migrate', {
        migrate,
      });
    }

    importFresh(migrationFile);
  });
};
