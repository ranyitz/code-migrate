import { flatMap } from 'lodash';
import { runTask } from './tasks/runTask';
import fs from 'fs-extra';
import type { FileToChange, RunMigration } from './types';
import { Migration } from './Migration';

export const createRunMigration = (
  migration: Migration
): RunMigration => () => {
  const filesToChange: Array<FileToChange> = flatMap(
    migration.tasks,
    (task) => {
      migration.events.emit('task-start', { task });

      return runTask(task, migration);
    }
  );

  // TODO: Prompt should start migration
  filesToChange.forEach(({ originalFile, newFile }) => {
    fs.removeSync(originalFile.path);
    fs.writeFileSync(newFile.path, newFile.source);
  });
};
