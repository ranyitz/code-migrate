export type Pattern = string;

export type File = { source: string; fileName: string; path: string };

export type TransformReturnValue = { source?: string; fileName?: string };

export type Transform = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => TransformReturnValue;

export type RunMigration = () => void;

export type Options = { cwd: string };

export type Task = { name: string; pattern: Pattern; transformFn: Transform };

export type FileToChange = {
  originalFile: File;
  newFile: File;
};
