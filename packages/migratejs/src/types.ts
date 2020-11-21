import type { File } from './File';
import type {
  CreateFn,
  CreateTask,
  RemoveTask,
  RenameFn,
  RenameTask,
  TransformFn,
  TransformTask,
} from './tasks';

export type Pattern = string | string[];

export type CreateReturnValue = { fileName: string; source: string };

export type Options = { cwd: string };

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

export type RegisterRemoveTask = (title: string, pattern: Pattern) => void;

export type RegisterCreateTask = (
  title: string,
  patternOrCreateFn: CreateFn | Pattern,
  createFn?: CreateFn
) => void;

export type FileAction =
  | {
      type: 'transform';
      originalFile: File;
      newFile: File;
    }
  | {
      type: 'rename';
      originalFile: File;
      newFile: File;
    }
  | {
      type: 'remove';
      file: File;
    }
  | {
      type: 'create';
      originalFile?: File;
      newFile: File;
    };
