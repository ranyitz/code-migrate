import fs from 'fs-extra';
import { getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { isTruthy } from '../utils';

export type DeleteReturnValue = { fileName?: string };

export type DeleteFn = ({ fileName }: { fileName: string }) => void;

export type DeleteTask = {
  type: 'delete';
  title: string;
  pattern: Pattern;
};

export const runDeleteTask: RunTask<DeleteTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern);

  const fileResults: Array<FileAction> = files
    .map((file) => {
      migration.events.emit('delete-start', { file, task });

      if (!file.exists) {
        migration.events.emit('delete-success-noop', {
          task,
          file,
        });

        return null;
      }

      migration.events.emit('delete-success', {
        task,
        file,
      });

      return {
        type: task.type,
        filePath: file.path,
      };
    })
    .filter(isTruthy);

  return fileResults;
};
