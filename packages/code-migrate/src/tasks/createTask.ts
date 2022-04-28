import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { TaskResult, Pattern, TaskError } from '../types';
import { isNull, isUndefined } from 'lodash';

export type CreateReturnValue = { source?: string; fileName?: string } | null;

export type EmptyCreateFn = () => CreateReturnValue;

export type CreateFn = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => CreateReturnValue;

export type CreateTask = {
  type: 'create';
  title: string;
  pattern?: Pattern;
  fn: CreateFn | EmptyCreateFn;
};

export const runCreateTask: RunTask<CreateTask> = (task, migration) => {
  let taskResults: Array<TaskResult> = [];
  let taskErrors: Array<TaskError> = [];

  let createdFiles: CreateReturnValue[] = [];

  if (!task.pattern) {
    try {
      // @ts-expect-error
      const createdFile = task.fn();
      createdFiles.push(createdFile);
    } catch (error: any) {
      const taskError: TaskError = {
        type: task.type,
        task,
        error,
      };

      migration.events.emit('task-fail', taskError);

      taskErrors.push(taskError);
    }
  } else {
    const files = getFiles(migration.options.cwd, task.pattern, migration);

    for (let file of files) {
      migration.events.emit('task-start', { file, task });

      try {
        const createdFile = task.fn({
          fileName: file.fileName,
          source: file.source,
        });

        createdFiles.push(createdFile);
      } catch (error: any) {
        const taskError: TaskError = {
          type: task.type,
          task,
          error,
        };

        migration.events.emit('task-fail', taskError);

        taskErrors.push(taskError);
      }
    }
  }

  for (let createdFile of createdFiles) {
    if (isNull(createdFile)) {
      migration.events.emit('create-success-abort', { task });
      continue;
    }

    if (!createdFile.fileName) {
      throw new Error(
        'the return value of a create function needs to contain an object with { fileName: <string> }'
      );
    }

    if (isUndefined(createdFile.source)) {
      throw new Error(
        'the return value of a create function needs to contain an object with { source: <string> }'
      );
    }

    const originalFile = new File({
      cwd: migration.options.cwd,
      fileName: createdFile.fileName,
      migration,
    });

    const newFile = new File({
      cwd: migration.options.cwd,
      fileName: createdFile.fileName,
      source: createdFile.source,
      migration,
    });

    const taskResult: TaskResult = {
      newFile,
      type: task.type,
      task,
    };

    if (originalFile.exists) {
      // Add the original File to mark that the file exists

      taskResult.originalFile = originalFile;

      // @ts-expect-error - we know that originalFile exists here
      migration.events.emit('create-success-override', taskResult);
    }

    migration.events.emit('task-success', taskResult);

    migration.fs.writeFileSync(newFile.path, newFile.source);

    taskResults.push(taskResult);
  }

  return { taskErrors, taskResults };
};
