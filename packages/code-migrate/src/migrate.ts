import { RegisterMethods } from './Migration';
import { Options } from './types';
import { VirtualFileSystem } from './VirtualFileSystem';

type OptionalPromise<T> = T | Promise<T>;

// The global migrate function which is used
// by the user in order to register migration tasks
export type Migrate = (
  title: string,
  fn: (
    RegisterTasks: RegisterMethods,
    options: Options & { fs: VirtualFileSystem }
  ) => OptionalPromise<void>
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
