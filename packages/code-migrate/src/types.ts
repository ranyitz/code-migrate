import type { File } from './File';
import type {
  CreateFn,
  CreateTask,
  EmptyCreateFn,
  RemoveFn,
  RemoveTask,
  RenameFn,
  RenameTask,
  TransformFn,
  TransformTask,
} from './tasks';

import type { AfterHookFn } from './hooks';

export type Pattern = string | string[];

export type Options = { cwd: string; quiet: boolean };

export type TaskType = 'transform' | 'rename' | 'remove' | 'create';

export type Task = TransformTask | RenameTask | RemoveTask | CreateTask;

export type RegisterTransformTask = (
  title: string,
  pattern: Pattern,
  transformFn: TransformFn
) => void;

export type RegisterRenameTask = (
  title: string,
  pattern: Pattern,
  renameFn: RenameFn
) => void;

export type RegisterRemoveTask = (
  title: string,
  pattern: Pattern,
  removeFn?: RemoveFn
) => void;

export type RegisterCreateTask = (
  title: string,
  patternOrCreateFn: EmptyCreateFn | Pattern,
  createFn?: CreateFn
) => void;

export type RegisterAfterHook = (afterHook: AfterHookFn) => void;

export type TaskError =
  | {
      type: 'transform';
      file: File;
      task: Task;
      error: Error;
    }
  | {
      type: 'rename';
      file: File;
      task: Task;
      error: Error;
    }
  | {
      type: 'remove';
      file: File;
      task: Task;
      error: Error;
    }
  | {
      type: 'create';
      file?: File;
      task: Task;
      error: Error;
    };

export type TaskResult =
  | {
      type: 'transform';
      originalFile: File;
      newFile: File;
      task: Task;
    }
  | {
      type: 'rename';
      originalFile: File;
      newFile: File;
      task: Task;
    }
  | {
      type: 'remove';
      file: File;
      task: Task;
    }
  | {
      type: 'create';
      originalFile?: File;
      newFile: File;
      task: Task;
    };
