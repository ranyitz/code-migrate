import { isEqual, isObject } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { isTruthy, strigifyJson } from '../utils';

type TransformReturnValue = string | Record<string, any>;

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

  const fileResults: Array<FileAction> = files
    .map((file) => {
      migration.events.emit('transform-start', { file, task });

      let transformedSource: TransformReturnValue;

      try {
        transformedSource = task.fn(file);
      } catch (error) {
        migration.events.emit('transform-fail', {
          file,
          error,
          task,
        });
        return null;
      }

      let source;

      if (isObject(transformedSource)) {
        source = strigifyJson(transformedSource);
      } else {
        source = transformedSource;
      }

      const newFile = new File({
        cwd: migration.options.cwd,
        fileName: file.fileName,
        source,
      });

      const isRenamed = !isEqual(newFile.fileName, file.fileName);
      const isModified = isRenamed || !isEqual(newFile.source, file.source);

      if (isModified) {
        const fileAction = {
          originalFile: file,
          newFile,
          type: task.type,
        };

        migration.events.emit('transform-success-change', {
          task,
          ...fileAction,
        });

        return fileAction;
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
