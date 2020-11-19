export type Pattern = string;

export type Transform = ({
  fileName,
  source,
}: {
  fileName: string;
  source: string;
}) => {};

export type Options = { cwd: string };

export type Task = { name: string; pattern: Pattern; transformFn: Transform };

export type TransformReturnValue = { source?: string; fileName?: string };

export type File = { source: string; fileName: string };

export type FileToChange = {
  originalFile: File;
  newFile: File;
};
