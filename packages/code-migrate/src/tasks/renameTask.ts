import { isEqual } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { TaskResult, Pattern, TaskError } from '../types';

export type RenameReturnValue = string;

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

  let taskResults: Array<TaskResult> = [];
  let taskErrors: Array<TaskError> = [];

  for (let file of files) {
    migration.events.emit('task-start', { file, task });

    let renamedFile: RenameReturnValue;

    try {
      renamedFile = task.fn(file);
    } catch (error) {
      const taskError: TaskError = {
        type: task.type,
        file,
        error,
        task,
      };

      migration.events.emit('task-fail', taskError);

      taskErrors.push(taskError);
      continue;
    }

    const newFile = new File({
      cwd: migration.options.cwd,
      fileName: renamedFile || file.fileName,
      source: file.source,
      migration,
    });

    const isRenamed = !isEqual(newFile.fileName, file.fileName);

    if (isRenamed) {
      const taskResult = {
        task,
        originalFile: file,
        newFile,
        type: task.type,
      };

      migration.events.emit('task-success', taskResult);

      migration.fs.renameSync(file.path, newFile.path);

      taskResults.push(taskResult);
      continue;
    }

    migration.events.emit('task-noop', {
      task,
      file,
    });
  }

  return { taskResults, taskErrors };
};
