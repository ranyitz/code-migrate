export type Pattern = string;
import type { File } from './File';
import type { RenameFn, RenameTask, TransformFn, TransformTask } from './tasks';

export type CreateReturnValue = { fileName: string; source: string };

export type CreateFn = () => CreateReturnValue;

export type RunMigration = () => void;

export type Options = { cwd: string };

export type TaskType = 'transform' | 'rename' | 'delete' | 'create';

export type DeleteTask = {
  type: 'delete';
  title: string;
  pattern: Pattern;
};

export type CreateTask = {
  type: 'create';
  title: string;
  fn: CreateFn;
};

export type Task = TransformTask | RenameTask | DeleteTask | CreateTask;

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

export type RegisterDeleteTask = (title: string, pattern: Pattern) => void;

export type RegisterCreateTask = (title: string, createFn: CreateFn) => void;

export type FileToChange = {
  originalFile: File;
  newFile: File;
};
