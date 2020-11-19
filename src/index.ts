import { reporter } from './reporter';
import { MigrationEmitter } from './migrationEmitter';
import type { Options, Task, Pattern, Transform, RunMigration } from './types';
import { createRunMigration } from './runMigration';

type RegisterTask = (
  taskName: string,
  pattern: Pattern,
  transformFn: Transform
) => void;

export type Migration = (registerTask: RegisterTask) => void;

type CreateMigration = (options: Options, migration: Migration) => RunMigration;

export const createMigration: CreateMigration = (options, migration) => {
  const migrationEmitter = new MigrationEmitter();
  reporter(migrationEmitter);

  const tasks: Array<Task> = [];

  const registerTask: RegisterTask = (name, pattern, transformFn) => {
    tasks.push({ name, pattern, transformFn });
  };

  migration(registerTask);

  return createRunMigration(options, tasks, migrationEmitter);
};
