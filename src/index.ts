import { flatMap } from 'lodash';
import { reporter } from './reporter';
import { MigrationEmitter } from './migrationEmitter';
import { runTask } from './runTask';
import type { Options, Task, Pattern, Transform, FileToChange } from './types';
import fs from 'fs-extra';

type RunMigration = () => void;

type RegisterTask = (
  taskName: string,
  pattern: Pattern,
  transformFn: Transform
) => void;

type Migration = (registerTask: RegisterTask) => void;

type CreateMigration = (options: Options, migration: Migration) => RunMigration;

export const createMigration: CreateMigration = (options, migration) => {
  const migrationEmitter = new MigrationEmitter();
  reporter(migrationEmitter);

  const tasks: Array<Task> = [];

  const registerTask: RegisterTask = (name, pattern, transformFn) => {
    tasks.push({ name, pattern, transformFn });
  };

  migration(registerTask);

  return () => {
    const filesToChange: Array<FileToChange> = flatMap(tasks, (task) =>
      runTask(task, options, migrationEmitter)
    );

    // console.log(filesToChange);
    filesToChange.forEach(({ originalFile, newFile }) => {
      fs.removeSync(originalFile.fileName);
      fs.writeFileSync(newFile.fileName, newFile.source);
    });
  };
};
