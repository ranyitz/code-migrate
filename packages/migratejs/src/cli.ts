// TODO - implement

import { Migration, RegisterTasks } from './Migration';

const migration = Migration.create({ cwd: process.cwd() });

export type Migrate = (
  title: string,
  fn: (RegisterTasks: RegisterTasks) => void
) => void;

const migrate: Migrate = (title, fn) => {
  fn(migration.registerTaskMethods);
};

// @ts-expect-error not sure how to type this
globalThis.migrate = migrate;
