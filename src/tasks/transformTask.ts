import { isEqual } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { FileToChange, Pattern } from '../types';
import { isTruthy } from '../utils';

export type TransformReturnValue = { source?: string; fileName?: string };

export type TransformFn = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => TransformReturnValue;

export type TransformTask = {
  type: 'transform';
  title: string;
  pattern: Pattern;
  fn: TransformFn;
};

export const runTransformTask: RunTask<TransformTask> = (task, migration) => {
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

      const newFile = new File({
        cwd: migration.options.cwd,
        fileName: transformedFile.fileName || file.fileName,
        source: transformedFile.source || file.source,
      });

      const isRenamed = !isEqual(newFile.fileName, file.fileName);
      const isModified = isRenamed || !isEqual(newFile.source, file.source);

      if (isModified) {
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
