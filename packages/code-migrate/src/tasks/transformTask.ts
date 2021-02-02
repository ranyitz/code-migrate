import { isEqual, isObject } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { FileAction, Pattern } from '../types';
import { strigifyJson } from '../utils';

type TransformReturnValue = string | Record<string, any>;

export type TransformFn = ({
  fileName,
  source,
  abort,
}: {
  fileName: string;
  source: string;
  abort: () => void;
}) => TransformReturnValue;

export type TransformTask = {
  type: 'transform';
  title: string;
  pattern: Pattern;
  fn: TransformFn;
};

export const runTransformTask: RunTask<TransformTask> = (task, migration) => {
  const files = getFiles(migration.options.cwd, task.pattern, migration);
  let aborted = false;

  const abort = () => {
    aborted = true;
  };

  let fileResults: Array<FileAction> = [];

  for (let file of files) {
    // We let the user control this callback
    // If it was call, we want to stop looping the files
    if (aborted) {
      break;
    }

    migration.events.emit('transform-start', { file, task });

    let transformedSource: TransformReturnValue;

    try {
      transformedSource = task.fn({
        source: file.source,
        fileName: file.fileName,
        abort,
      });
    } catch (error) {
      migration.events.emit('transform-fail', {
        file,
        error,
        task,
      });
      continue;
    }

    let source;

    if (isObject(transformedSource)) {
      source = strigifyJson(transformedSource);
    } else {
      source = transformedSource;
    }

    const newFile = new File({
      cwd: migration.options.cwd,
      fileName: file.fileName,
      source,
      migration,
    });

    const isRenamed = !isEqual(newFile.fileName, file.fileName);
    const isModified = isRenamed || !isEqual(newFile.source, file.source);

    if (isModified) {
      const fileAction = {
        originalFile: file,
        newFile,
        type: task.type,
        task,
      };

      migration.events.emit('transform-success-change', fileAction);

      fileResults.push(fileAction);
      continue;
    }

    migration.events.emit('transform-success-noop', {
      task,
      file,
    });
  }

  if (aborted) {
    return [];
  }

  fileResults.forEach((fileAction) => {
    if (fileAction.type !== 'transform') {
      throw new Error('wrong action type');
    }

    migration.fs.removeSync(fileAction.originalFile.path);
    migration.fs.writeFileSync(
      fileAction.newFile.path,
      fileAction.newFile.source
    );
  });

  return fileResults;
};
