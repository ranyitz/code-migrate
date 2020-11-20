import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { isTruthy } from '../utils';

export type CreateReturnValue = { source?: string; fileName?: string };

export type CreateFn = ({
  fileName,
  source,
}: {
  fileName?: string;
  source?: string;
}) => CreateReturnValue;

export type CreateTask = {
  type: 'create';
  title: string;
  pattern?: Pattern;
  fn: CreateFn;
};

export const runCreateTask: RunTask<CreateTask> = (task, migration) => {
  if (!task.pattern) {
    return [createFile()].filter(isTruthy);
  }

  const files = getFiles(migration.options.cwd, task.pattern);

  const fileResults: Array<FileAction> = files.map(createFile).filter(isTruthy);

  return fileResults;

  function createFile(file?: File): FileAction | null {
    migration.events.emit('create-start', { file, task });

    let createdFile: CreateReturnValue = {};

    try {
      createdFile = task.fn({ fileName: file?.fileName, source: file?.source });
    } catch (error) {
      migration.events.emit('create-fail', {
        file,
        error,
        task,
      });

      return null;
    }

    if (!createdFile.fileName) {
      throw new Error(
        'the return value of a create function needs to contain an object with { fileName: <string> }'
      );
    }

    if (!createdFile.source) {
      throw new Error(
        'the return value of a create function needs to contain an object with { source: <string> }'
      );
    }

    const originalFile = new File({
      cwd: migration.options.cwd,
      fileName: createdFile.fileName,
    });

    const newFile = new File({
      cwd: migration.options.cwd,
      fileName: createdFile.fileName,
      source: createdFile.source,
    });

    const fileAction: FileAction = {
      newFile,
      type: task.type,
    };

    if (originalFile.exists) {
      // Add the original File to mark that the file exists

      fileAction.originalFile = originalFile;

      // @ts-expect-error - we know that originalFile exists here
      migration.events.emit('create-success-override', {
        task,
        ...fileAction,
      });
    }

    migration.events.emit('create-success', {
      task,
      ...fileAction,
    });

    return fileAction;
  }
};
