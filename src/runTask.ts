import globby from 'globby';
import path from 'path';
import { isEqual } from 'lodash';
import { MigrationEmitter } from './MigrationEmitter';
import type {
  Options,
  Task,
  FileToChange,
  TransformReturnValue,
  TransformTask,
  RenameTask,
} from './types';
import { File, getFiles } from './File';
import { isTruthy } from './utils';
import { Migration } from './Migration';

export function runTask(task: Task, migration: Migration): Array<FileToChange> {
  switch (task.type) {
    case 'transform': {
      return runTransformTask(task, migration);
    }

    // case 'create': {
    // }

    // case 'delete': {
    // }

    // case 'rename': {
    // return runRenameTask(task, options, migrationEmitter);
    // }

    default: {
      throw new Error(`unknown task type "${task.type}"`);
    }
  }
}

export type RunTask<T extends Task> = (
  task: T,
  migration: Migration
) => Array<FileToChange>;

const runTransformTask: RunTask<TransformTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern);

  const fileResults: Array<FileToChange> = files
    .map((file) => {
      migration.events.emit('transform-start', { file, task });

      let transformedFile: TransformReturnValue = {};

      try {
        transformedFile = task.fn(file);
      } catch (error) {
        migration.events.emit('transform-fail', {
          file,
          error,
          task,
        });
        return null;
      }

      const newFile = File.createFile({
        cwd: migration.options.cwd,
        fileName: transformedFile.fileName || file.fileName,
        source: transformedFile.source || file.source,
      });

      const isRenamed = !isEqual(newFile.fileName, file.fileName);
      const isModified = !isEqual(newFile.source, file.source);

      if (isRenamed || isModified) {
        const fileToChange = {
          originalFile: file,
          newFile,
        };

        migration.events.emit('transform-success-change', {
          task,
          ...fileToChange,
        });

        return fileToChange;
      }

      migration.events.emit('transform-success-noop', {
        task,
        file,
      });

      return null;
    })
    .filter(isTruthy);

  return fileResults;
};
