import { red, blue, green, yellow, underline, bold } from 'chalk';
import { TaskError, TaskResult } from '../types';
import { groupBy, isEmpty } from 'lodash';
import { Migration } from '../Migration';

export const formatSingleTaskResult = (taskResult: TaskResult) => {
  switch (taskResult.type) {
    case 'transform': {
      const { newFile } = taskResult;

      return `${blue('transform:')} ${newFile.fileName}`;
    }

    case 'create': {
      const { newFile } = taskResult;
      return `${green('create:')} ${newFile.fileName}`;
    }

    case 'remove': {
      return `${red('remove:')} ${taskResult.file.fileName}`;
    }

    case 'rename': {
      const { originalFile, newFile } = taskResult;
      return `${yellow('rename:')} ${originalFile.fileName} -> ${
        newFile.fileName
      }`;
    }

    default: {
      // @ts-expect-error ts thinks that task is "never"
      throw new Error(`unknown taskResult type "${taskResult.type}"`);
    }
  }
};
export const formatSingleTaskError = (taskError: TaskError) => {
  return `${red('X')} ${taskError.type}: ${taskError.file?.fileName}

${taskError.error.stack}`;
};

export const createReport = (migration: Migration) => {
  if (isEmpty(migration.results)) {
    return blue('🤷‍♂️ the migration passed without changes');
  }

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
    output.push(red(underline('Errors')));

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

  return output.join('\n\n');
};
