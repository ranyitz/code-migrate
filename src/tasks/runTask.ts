import type { Task, FileToChange } from '../types';
import { Migration } from '../Migration';
import { runTransformTask } from './transformTask';
import { runRenameTask } from './renameTask';

export function runTask(task: Task, migration: Migration): Array<FileToChange> {
  switch (task.type) {
    case 'transform': {
      return runTransformTask(task, migration);
    }

    // case 'create': {
    // }

    // case 'delete': {
    // }

    case 'rename': {
      return runRenameTask(task, migration);
    }

    default: {
      throw new Error(`unknown task type "${task.type}"`);
    }
  }
}

export type RunTask<T extends Task> = (
  task: T,
  migration: Migration
) => Array<FileToChange>;
