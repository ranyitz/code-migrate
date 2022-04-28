import { isEqual, isObject } from 'lodash';
import { File, getFiles } from '../File';
import { RunTask } from './runTask';
import { TaskResult, TaskError, Pattern } from '../types';
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

  let taskResults: Array<TaskResult> = [];
  let taskErrors: Array<TaskError> = [];

  for (let file of files) {
    // We let the user control this callback
    // If it was call, we want to stop looping the files
    if (aborted) {
      break;
    }

    migration.events.emit('task-start', { file, task });

    let transformedSource: TransformReturnValue;

    try {
      transformedSource = task.fn({
        source: file.source,
        fileName: file.fileName,
        abort,
      });
    } catch (error: any) {
      const taskError: TaskError = {
        file,
        type: task.type,
        task,
        error,
      };

      migration.events.emit('task-fail', taskError);

      taskErrors.push(taskError);
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
      const taskResult = {
        originalFile: file,
        newFile,
        type: task.type,
        task,
      };

      migration.events.emit('task-success', taskResult);

      taskResults.push(taskResult);
      continue;
    }

    migration.events.emit('task-noop', {
      task,
      file,
    });
  }

  if (aborted) {
    return { taskErrors: [], taskResults: [] };
  }

  taskResults.forEach((result) => {
    if (result.type !== 'transform') {
      throw new Error('wrong action type');
    }

    migration.fs.removeSync(result.originalFile.path);
    migration.fs.writeFileSync(result.newFile.path, result.newFile.source);
  });

  return { taskResults, taskErrors };
};
