import { reporter } from './reporter';
import type { Options, RunMigration } from './types';
import { createRunMigration } from './createRunMigration';
import { Migration, RegisterTasks } from './Migration';

export type RegisterMigration = (registerTasks: RegisterTasks) => void;

type CreateMigration = (
  options: Options,
  registerMigration: RegisterMigration
) => RunMigration;

export const createMigration: CreateMigration = (
  options,
  registerMigration
) => {
  const migration = new Migration(options);

  reporter(migration);

  registerMigration(migration.getRegisterTaskMethods());

  return createRunMigration(migration);
};
