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

export declare const migrate: Migrate;

throw new Error(
  `Do not import "code-migrate" outside of the code-migrate environment.
Please try the following command:

      npx code-migrate <path/to/migration.ts>\n`
);
