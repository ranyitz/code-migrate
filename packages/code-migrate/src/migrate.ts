import { RegisterTasks } from './Migration';
import { Options } from './types';
import { VirtualFileSystem } from './VirtualFileSystem';

// The global migrate function which is used
// by the user in order to register migration tasks
export type Migrate = (
  title: string,
  fn: (
    RegisterTasks: RegisterTasks,
    options: Options & { fs: VirtualFileSystem }
  ) => void
) => void;

/**
 * @param title The title of the migration
 * @param fn callback function that accepts the tasks to register
 *
 */
export const migrate: Migrate = () => {
  throw new Error(
    `Do not use "migrate" outside of the code-migrate environment.
  Please try the following command:

        npx code-migrate <path/to/migration.ts>\n`
  );
};
