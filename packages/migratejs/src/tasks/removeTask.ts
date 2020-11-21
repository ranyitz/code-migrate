import { getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { isTruthy } from '../utils';

export type RemoveReturnValue = { fileName?: string };

export type RemoveFn = ({ fileName }: { fileName: string }) => void;

export type RemoveTask = {
  type: 'remove';
  title: string;
  pattern: Pattern;
};

export const runRemoveTask: RunTask<RemoveTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern, migration);

  const fileResults: Array<FileAction> = files
    .map((file) => {
      migration.events.emit('remove-start', { file, task });

      if (!file.exists) {
        migration.events.emit('remove-success-noop', {
          task,
          file,
        });

        return null;
      }

      migration.events.emit('remove-success', {
        task,
        file,
      });

      migration.fs.removeSync(file.path);
      return {
        type: task.type,
        file,
        task,
      };
    })
    .filter(isTruthy);

  return fileResults;
};
