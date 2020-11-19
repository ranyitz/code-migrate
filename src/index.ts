type Pattern = string;

type Transform = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => {};

type RegisterTask = (
  taskName: string,
  pattern: Pattern,
  transformFn: Transform
) => void;

type Migration = (registerTask: RegisterTask) => void;

type RunMigration = () => void;

type Options = { cwd: string };

type CreateMigration = (options: Options, migration: Migration) => RunMigration;

export type Task = { name: string; pattern: Pattern; transformFn: Transform };

type TransformReturnValue = { source?: string; fileName?: string };

export type File = { source: string; fileName: string };

type FileToChange = {
  originalFile: File;
  newFile: File;
};

import globby from 'globby';
import path from 'path';
import fs from 'fs-extra';
import { isEqual, flatMap } from 'lodash';
import { reporter } from './reporter';
import { MigrationEmitter } from './migrationEmitter';

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

    filesToChange.forEach(({ originalFile, newFile }) => {
      fs.removeSync(originalFile.fileName);
      fs.writeFileSync(newFile.fileName, newFile.source);
    });
  };
};

function runTask(
  task: Task,
  options: Options,
  migrationEmitter: MigrationEmitter
): Array<FileToChange> {
  const fileNames = globby.sync(task.pattern, { cwd: options.cwd });

  if (!fileNames) {
    migrationEmitter.emit('');
    return [];
  }

  const files: Array<File> = fileNames.map((fileName) => {
    const source = fs.readFileSync(path.join(options.cwd, fileName), 'utf-8');
    return { source, fileName };
  });

  const fileResults: Array<FileToChange> = files
    .map((file) => {
      migrationEmitter.emitTransformEvent('transform-start', { file, task });

      let transformFile: TransformReturnValue = {};

      try {
        transformFile = task.transformFn(file);
      } catch (error) {
        migrationEmitter.emitTransformEvent('transform-fail', {
          file,
          error,
          task,
        });
        return null;
      }

      const newFile = { ...file, ...transformFile };
      const hasChanged = isEqual(newFile, file);

      if (hasChanged) {
        migrationEmitter.emitTransformEvent('transform-success-change', {
          task,
          file,
        });
        return { originalFile: file, newFile };
      }

      migrationEmitter.emitTransformEvent('transform-success-noop', {
        task,
        file,
      });
      return null;
    })
    .filter(Boolean) as Array<FileToChange>;

  return fileResults;
}
