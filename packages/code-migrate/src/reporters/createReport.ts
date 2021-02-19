import {
  red,
  blue,
  green,
  yellow,
  underline,
  bold,
  magenta,
  supportsColor,
  reset,
} from 'chalk';
import { TaskError, TaskResult, TaskType } from '../types';
import { groupBy, isEmpty } from 'lodash';
import { Migration } from '../Migration';

const ERROR_TEXT = 'ERROR';
const PASS_TEXT = 'PASS';

const ERROR = supportsColor
  ? reset.inverse.bold.red(` ${ERROR_TEXT} `)
  : ERROR_TEXT;

const PASS = supportsColor
  ? reset.inverse.bold.green(` ${PASS_TEXT} `)
  : PASS_TEXT;

// const styleTaskType = (taskType: TaskType) => {
//   switch (taskType) {
//     case 'transform':
//       return blue('transform');
//     case 'create':
//       return green('create');
//     case 'remove':
//       return magenta('remove');
//     case 'rename':
//       return yellow('rename');
//   }
// };

export const formatSingleTaskResult = (taskResult: TaskResult) => {
  switch (taskResult.type) {
    case 'transform': {
      return `${PASS} ${taskResult.newFile.fileName}`;
    }

    case 'create': {
      return `${PASS} ${taskResult.newFile.fileName}`;
    }

    case 'remove': {
      return `${PASS} ${taskResult.file.fileName}`;
    }

    case 'rename': {
      const { originalFile, newFile } = taskResult;
      return `${PASS} ${originalFile.fileName} -> ${newFile.fileName}`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown taskResult type "${taskResult.type}"`);
    }
  }
};
export const formatSingleTaskError = (taskError: TaskError) => {
  return `${ERROR} ${taskError.file?.fileName}

${taskError.error.stack}`;
};

export const createReport = (migration: Migration) => {
  const output = [];

  for (const [taskTitle, taskResults] of Object.entries(
    groupBy(migration.results, 'task.title')
  )) {
    output.push(
      underline(bold(taskTitle)) +
        '\n' +
        taskResults.map(formatSingleTaskResult).join('\n')
    );
  }

  if (migration.errors.length > 0) {
    output.push(red(underline(`Errors`)));

    for (const [taskTitle, taskErrors] of Object.entries(
      groupBy(migration.errors, 'task.title')
    )) {
      output.push(
        underline(bold(taskTitle)) +
          '\n' +
          taskErrors.map(formatSingleTaskError).join('\n')
      );
    }
  }

  if (isEmpty(migration.results)) {
    output.push(blue('🤷‍♂️ No changes have been made'));
  }

  return output.join('\n\n');
};
