import { isEqual } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { isTruthy } from '../utils';

export type RenameReturnValue = { fileName?: string };

export type RenameFn = ({
  fileName,
}: {
  fileName: string;
}) => RenameReturnValue;

export type RenameTask = {
  type: 'rename';
  title: string;
  pattern: Pattern;
  fn: RenameFn;
};
export const runRenameTask: RunTask<RenameTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern, migration);

  const fileResults: Array<FileAction> = files
    .map((file) => {
      migration.events.emit('rename-start', { file, task });

      let renamedFile: RenameReturnValue = {};

      try {
        renamedFile = task.fn(file);
      } catch (error) {
        migration.events.emit('rename-fail', {
          file,
          error,
          task,
        });

        return null;
      }

      const newFile = new File({
        cwd: migration.options.cwd,
        fileName: renamedFile.fileName || file.fileName,
        source: file.source,
        migration,
      });

      const isRenamed = !isEqual(newFile.fileName, file.fileName);

      if (isRenamed) {
        migration.events.emit('rename-success-change', {
          task,
          originalFile: file,
          newFile,
        });

        migration.fs.renameSync(file.path, newFile.path);

        return {
          type: task.type,
          originalFile: file,
          newFile,
          task,
        };
      }

      migration.events.emit('rename-success-noop', {
        task,
        file,
      });

      return null;
    })
    .filter(isTruthy);

  return fileResults;
};
