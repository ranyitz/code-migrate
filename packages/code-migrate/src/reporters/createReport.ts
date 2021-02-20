import { red, blue, underline, bold, supportsColor, reset } from 'chalk';
import { TaskError, TaskResult } from '../types';
import { groupBy, isEmpty } from 'lodash';
import { Migration } from '../Migration';

const ERROR_TEXT = 'ERROR';
const READY_TEXT = 'READY';

const ERROR = supportsColor
  ? reset.inverse.bold.red(` ${ERROR_TEXT} `)
  : ERROR_TEXT;

const READY = supportsColor
  ? reset.inverse.bold.green(` ${READY_TEXT} `)
  : READY_TEXT;

export const formatSingleTaskResult = (taskResult: TaskResult) => {
  switch (taskResult.type) {
    case 'transform': {
      return `${READY} ${taskResult.newFile.fileName}`;
    }

    case 'create': {
      return `${READY} ${taskResult.newFile.fileName}`;
    }

    case 'remove': {
      return `${READY} ${taskResult.file.fileName}`;
    }

    case 'rename': {
      const { originalFile, newFile } = taskResult;
      return `${READY} ${originalFile.fileName} -> ${newFile.fileName}`;
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
    output.push(
      '⚠️  ' +
        red(
          `The following migration tasks were failed, but you can still migrate the rest` +
            ' ⚠️'
        )
    );

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
    output.push(blue('🤷‍ No changes have been made'));
  }

  return output.join('\n\n');
};
