import type { TaskResult, Task, TaskError } from '../types';
import { Migration } from '../Migration';
import { runTransformTask } from './transformTask';
import { runRenameTask } from './renameTask';
import { runCreateTask } from './createTask';
import { runRemoveTask } from './removeTask';

type RunTaskReturnValue = {
  taskResults: Array<TaskResult>;
  taskErrors: Array<TaskError>;
};

export function runSingleTask(
  task: Task,
  migration: Migration
): RunTaskReturnValue {
  let chosenRunTask: RunTask<any>;

  switch (task.type) {
    case 'transform': {
      chosenRunTask = runTransformTask;
      break;
    }

    case 'create': {
      chosenRunTask = runCreateTask;
      break;
    }

    case 'remove': {
      chosenRunTask = runRemoveTask;
      break;
    }

    case 'rename': {
      chosenRunTask = runRenameTask;
      break;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown task type "${task.type}"`);
    }
  }

  return chosenRunTask(task, migration);
}

export type RunTask<T extends Task> = (
  task: T,
  migration: Migration
) => RunTaskReturnValue;
