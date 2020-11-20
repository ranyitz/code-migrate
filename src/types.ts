export type Pattern = string;
import type { File } from './File';

export type TransformReturnValue = { source?: string; fileName?: string };
export type RenameReturnValue = { fileName?: string };
export type CreateReturnValue = { fileName: string; source: string };

export type TransformFn = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => TransformReturnValue;

export type RenameFn = ({
  fileName,
}: {
  fileName: string;
}) => RenameReturnValue;

export type CreateFn = () => CreateReturnValue;

export type RunMigration = () => void;

export type Options = { cwd: string };

export type TaskType = 'transform' | 'rename' | 'delete' | 'create';

export type TransformTask = {
  type: 'transform';
  title: string;
  pattern: Pattern;
  fn: TransformFn;
};

export type RenameTask = {
  type: 'rename';
  title: string;
  pattern: Pattern;
  fn: RenameFn;
};

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
