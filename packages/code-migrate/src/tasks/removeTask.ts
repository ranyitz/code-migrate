import { getFiles } from '../File';
import { RunTask } from './runTask';
import { TaskResult, Pattern } from '../types';

export type RemoveReturnValue = { fileName?: string };

export type RemoveFn = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => void;

export type RemoveTask = {
  type: 'remove';
  title: string;
  pattern: Pattern;
  fn?: RemoveFn;
};

export const runRemoveTask: RunTask<RemoveTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern, migration);

  const taskResults: Array<TaskResult> = [];

  for (let file of files) {
    migration.events.emit('task-start', { file, task });

    if (!file.exists) {
      migration.events.emit('task-noop', {
        task,
        file,
      });

      continue;
    }

    if (task.fn) task.fn(file);

    migration.events.emit('task-success', {
      task,
      file,
      type: task.type,
    });

    migration.fs.removeSync(file.path);
    const taskResult = { type: task.type, file, task };
    taskResults.push(taskResult);
  }

  return { taskResults, taskErrors: [] };
};
