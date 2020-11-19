import { flatMap } from 'lodash';
import { runTask } from './runTask';
import fs from 'fs-extra';
import type { FileToChange, Options, Task, RunMigration } from './types';
import { MigrationEmitter } from './migrationEmitter';

export const createRunMigration = (
  options: Options,
  tasks: Array<Task>,
  migrationEmitter: MigrationEmitter
): RunMigration => () => {
  const filesToChange: Array<FileToChange> = flatMap(tasks, (task) =>
    runTask(task, options, migrationEmitter)
  );

  // TODO: Prompt should start migration
  filesToChange.forEach(({ originalFile, newFile }) => {
    fs.removeSync(originalFile.path);
    fs.writeFileSync(newFile.path, newFile.source);
  });
};
