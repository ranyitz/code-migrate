import globby from 'globby';
import path from 'path';
import fs from 'fs-extra';
import { isEqual } from 'lodash';
import { MigrationEmitter } from './migrationEmitter';
import type {
  Options,
  Task,
  FileToChange,
  File,
  TransformReturnValue,
} from './types';

export function runTask(
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
      const hasChanged = !isEqual(newFile, file);

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
